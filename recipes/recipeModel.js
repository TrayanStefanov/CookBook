import mongoose from "mongoose";

const recipeSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    ingredients:{
        type: String,
        required: true,
    },
    timeToCook:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
        unique: true,
    }
})

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;