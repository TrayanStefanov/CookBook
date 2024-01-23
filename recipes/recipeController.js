import mongoose from "mongoose";
import Recipe from "./recipeModel.js";
import { handleServerError } from "../utils/functions.js";

const addRecipe = async(req, res) => {
    try{
        const {title, ingredients, timeToCook, description} = req.body;
        if(!title || !ingredients || !timeToCook || !description) {
            return res.status(400).json({message: "Incomplete Data"});
        }

        const recipeExists = await Recipe.findOne({description});
        if(recipeExists){
            return res.status(400).json({message: "Recipe already exists"});
        }
        const newRecipe = await Recipe.create({
            title,
            ingredients,
            timeToCook,
            description
        });
        res.status(201).json({
            _id: newRecipe._id,
            title: newRecipe.title,
            ingredients: newRecipe.ingredients,
            timeToCook: newRecipe.timeToCook,
            description: newRecipe.description
        });
    } catch (error){
        handleServerError(res, error);
    }
};

const listRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        res.status(200).json(recipes);
    } catch (error){
        handleServerError(res, error);
    }
};

//Description needs to be different or validation picks it up due to being unique field

const editRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const {title} = req.body;
        const {ingredients} = req.body;
        const {timeToCook} = req.body;
        const {description} = req.body;
        
        if(!title && !ingredients && !timeToCook && !description){
            return res.status(400).json({message: "Incomplete Data"})
        }
        if(!mongoose.Types.ObjectId.isValid(recipeId)){
            return res.status(400).json({message: "Invalid recipe ID"});
        }

        const recipe = await Recipe.findById(recipeId);
        if(!recipe){
            return res.status(404).json({message: "Recipe not found"});
        }

        recipe.title = title;
        recipe.ingredients = ingredients;
        recipe.timeToCook = timeToCook;
        recipe.description = description;
        
        await recipe.save();
        res.status(200).json(recipe);
    } catch (error){
        handleServerError(res, error);
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(recipeId)){
            return res.status(400).json({message: "Invalid recipe ID"});
        }

        const recipe = await Recipe.findById(recipeId);
        if(!recipe){
            return res.status(404).json({message: "Recipe not found"});
        }

        await Recipe.findByIdAndDelete({_id: recipeId});
        res.status(200).json({message: "Recipe deleted"});
    } catch (error){
        handleServerError(res, error);
    }
};

export {addRecipe, listRecipes, editRecipe, deleteRecipe};