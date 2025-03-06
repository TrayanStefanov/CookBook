/*
    This is the server's router for the application.
    All routes for the applicatiion's handling of recipes are defined here.
*/

import express, { Router } from 'express';
import {listRecipes, editRecipe, latestRecipes, deleteRecipe, searchRecipes} from "./recipeController.js";

// Creating a new router
const router = express.Router();

// Setting up the routes for the different website paths.
router.get('/listRecipes', listRecipes);
router.get('/searchRecipes' , searchRecipes);
router.get('/latestRecipes', latestRecipes)
router.put('/:id', editRecipe);
router.delete('/:id', deleteRecipe);

export default router;