/*
  This is the main file for the application. It sets up the server and handles requests.
  The server is set up using express. The server listens on the port set in the .env file.
  The server handles requests for the default route and the /addRecipe route. 
  The other requests are forwarded to the recipeRoutes file.
  Note: Need to export file management to a standalone file.
*/

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { handleServerError } from "./utils/functions.js";
import Recipe from "./recipes/recipeModel.js";
import connectDatabase from "./config/database.js";
import recipeRoutes from "./recipes/recipeRoutes.js"

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env file
dotenv.config();

// Start database connection
connectDatabase();

// Port and hostname variables
const port = process.env.PORT;
const hostName = process.env.HOSTNAME;

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setting frontend public folder
app.use(express.static(path.join(__dirname, 'public')));

// Setting up paths for bootstrap module
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));

// Setting up path for handling server requests
app.use('/recipes', recipeRoutes);

// Setup Multer storage for recipe image upload
const storage = multer.diskStorage({
  // Setting destination for files. Change this to your liking. Remember to create the folder.
  destination: function (req, file, callback) {
    callback(null, __dirname + '/public/uploads');
  },
  // Setting how the file should be named when saved. I chose to keep the original name.
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
})
const upload = multer({ storage: storage })

// POST request handling when saving a recipe to the database. 
app.post('/recipes/addRecipe', upload.array("files"), (req, res) => {
  try {
    // Deconstructing the request body.
    const { title, summary, typeOfDish, ingredients, timeToCook, description } = req.body;
    // Checking if any of the required fields are missing.
    if (!title || !summary || !typeOfDish || !ingredients || !timeToCook || !description) {
      return res.status(400).json({ message: "Incomplete Data" });
    }
    // Checking if the recipe already by querying the database for the description. 
    const recipeExists = Recipe.findOne({ description });
    if (recipeExists) {
      res.status(400).json({ message: "Recipe already exists" });
    }
    // Creating path variable for the image file.  
    let newPath = './uploads/' + req.files[0].filename;
    // Creating a new recipe object and saving it to the database.
    const newRecipe = Recipe.create({
      title: req.body.title,
      summary: req.body.summary,
      typeOfDish: req.body.typeOfDish,
      ingredients: req.body.ingredients,
      timeToCook: req.body.timeToCook,
      description: req.body.description,
      imgDirPath: newPath
    });
    console.log("Recipe Saved");
  } catch (error) {
    console.log(error);
    handleServerError(res, error);
  }
});

// GET request handling for the default route. Sending html file to be loaded as homepage.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
});

// Server listening on port set in the .env file. Upon successful connection, a message is logged to the console.
app.listen(port, () => console.log(`Server running at http:/${hostName}:${port}`));