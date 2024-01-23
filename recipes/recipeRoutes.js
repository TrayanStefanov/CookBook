import express from 'express';
import { addRecipe, listRecipes, editRecipe, deleteRecipe } from "./recipeController.js";

const router = express.Router();

router.post('/addRecipe' , addRecipe);
router.get('/listRecipes', listRecipes);
router.put('/:id', editRecipe);
router.delete('/:id', deleteRecipe);

export default router;