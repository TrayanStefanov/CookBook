/* 
    This file contains the functions that will be called when the routes are used
*/

import mongoose from "mongoose";
import Recipe from "./recipeModel.js";
import { handleServerError } from "../utils/functions.js";
import { console } from "inspector";

// Returns all recipes queried from DB. Sorts by creation date. Newest first.
const listRecipes = async (req, res) => {
    try {
        // Change the sort variable to 1 for oldest first.
        const recipes = await Recipe.find().sort({createdAt: -1});
        res.status(200).json(recipes);
        console.log(req.body);
    } catch (error){
        handleServerError(res, error);
    }
};

// Returns recipes queried from DB based on search query. Case insensitive and exact string match.
const searchRecipes = async (req, res) => {
    try {
        let request = JSON.stringify(req.query);
        const recipes = await Recipe.find({ $text: { $search: request} });
        res.status(200).json(recipes);
        console.log(res.body);
    } catch (error){
        handleServerError(res, error);
    }
}

// Returns the 10 latest recipes queried from DB. Sorts by creation date. Newest first. 
const latestRecipes = async (req, res) => {
    try {
        // Change the sort variable to 1 for oldest first. Change the limit to get more or less recipes.
        const recipes = await Recipe.find().sort({createdAt: -1}).limit(10);
        res.status(200).json(recipes);
        console.log(req.body);
    } catch (error){
        handleServerError(res, error);
    }
};

// Returns the 10 latest recipes by category queried from DB. Sorts by creation date. Newest first. 
const latestCategoryRecipes = async (req, res) => {
    try {
        // Change the sort variable to 1 for oldest first. Change the limit to get more or less recipes.
        let request = JSON.stringify(req.query);
        const recipes = await Recipe.find({ $text: { $search: request} }).sort({createdAt: -1}).limit(10);
        res.status(200).json(recipes);
        console.log(req.body);
    } catch (error){
        handleServerError(res, error);
    }
};

//Description needs to be different or validation picks it up due to being unique field

//Reminder to make it impossible to edit a recipe by multiple people
// Edits a recipe in the database. Requires a valid recipe ID.
const editRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const {title} = req.body;
        const {summary} = req.body;
        const {typeOfDish} = req.body;
        const {ingredients} = req.body;
        const {timeToCook} = req.body;
        const {description} = req.body;
        
        // Checks if any of the required fields are missing.
        if(!title && !summary && !typeOfDish && !ingredients && !timeToCook && !description){
            return res.status(400).json({message: "Incomplete Data"})
        }
        // Checks if the recipe ID is valid.
        if(!mongoose.Types.ObjectId.isValid(recipeId)){
            return res.status(400).json({message: "Invalid recipe ID"});
        }

        // Finds the recipe in the daзззtabase. Overwrites the recipe data.
        const recipe = await Recipe.findById(recipeId);
        recipe.title = title;
        recipe.summary = summary;
        recipe.typeOfDish = typeOfDish;
        recipe.ingredients = ingredients;
        recipe.timeToCook = timeToCook;
        recipe.description = description;
        // Save the updated recipe to the database.
        await recipe.save();
        // Return the updated recipe.
        res.status(200).json(recipe);
    } catch (error){
        handleServerError(res, error);
    }
};

// Deletes a recipe from the database. Requires a valid recipe ID.
const deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(recipeId)){
            return res.status(400).json({message: "Invalid recipe ID"});
        }
        // Checks if the recipe ID is valid.
        const recipe = await Recipe.findById(recipeId);
        if(!recipe){
            return res.status(404).json({message: "Recipe not found"});
        }
        // Deletes the recipe from the database.
        await Recipe.findByIdAndDelete({_id: recipeId});
        res.status(200).json({message: "Recipe deleted"});
    } catch (error){
        handleServerError(res, error);
    }
};



export {listRecipes, searchRecipes, latestRecipes, latestCategoryRecipes, editRecipe, deleteRecipe};