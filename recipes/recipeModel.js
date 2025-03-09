import mongoose from "mongoose";

// Defining the schema for the Recipe model
const recipeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        typeOfDish: {
            type: String,
            required: true,
        },
        ingredients: {
            type: String,
            required: true,
        },
        timeToCook: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
            unique: true,
        },
        imgDirPath: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    })

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;