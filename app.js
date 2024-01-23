import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDatabase from "./config/database.js";
import recipeRoutes from "./recipes/recipeRoutes.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDatabase();

const port = process.env.PORT;
const hostName = process.env.HOSTNAME;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/recipes', recipeRoutes);


app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname+'/index.html'))
});

app.listen(port, () => console.log(`Server running at http:/${hostName}:${port}`));