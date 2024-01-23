import { FetchHttp } from "../api/FetchHttp.js";
const serverURL = "/recipes";

window.addEventListener("DOMContentLoaded", function(e){
    fetchAllRecipes();
}) 


let fetchAllRecipes = () => {
    let url = `${serverURL}/listRecipes`;
    FetchHttp.get(url).then((data) => {
        let recipes = data;
        let recipeRow = '';
        for(let recipe of recipes){
            recipeRow +=
            `<tr>
                <td hidden>${recipe._id}</td>
                <td>${recipe.title}</td>
                <td>${recipe.ingredients}</td>
                <td>${recipe.timeToCook}</td>
                <td>${recipe.description}</td>
                <td>
                    <button class="update">update</button>
                    <button class="delete">delete</button>
                </td>
            </tr>`
        }
        document.getElementById("table-body").innerHTML = recipeRow;
    }).catch((err) => {
        console.log(err);
    })
}

let clearFormFields = () => {
    document.getElementById('add-title').value = '';
    document.getElementById('add-ingredients').value = '';
    document.getElementById('add-timeToCook').value = '';
    document.getElementById('add-description').value = '';
}

let addRecipeForm = document.getElementById("add-recipe-form");
addRecipeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    $('#add-recipe-modal').modal('hide');
    let recipe = {
        title: document.getElementById('add-title').value,
        ingredients: document.getElementById('add-ingredients').value,
        timeToCook: document.getElementById('add-timeToCook').value,
        description: document.getElementById('add-description').value
    };
    console.log(recipe);
    let url = `${serverURL}/addRecipe`;
    FetchHttp.post(url, recipe).then((data) => {
        console.log(data);
        fetchAllRecipes();
    }).catch((err) => {
        console.log(err);
    })
    clearFormFields();
})

let populateUpdateModal = (selectedRecipe) => {
    document.getElementById('update-id').value = selectedRecipe._id;
    document.getElementById('update-title').value = selectedRecipe.title;
    document.getElementById('update-ingredients').value = selectedRecipe.ingredients;
    document.getElementById('update-timeToCook').value = selectedRecipe.timeToCook;
    document.getElementById('update-description').value = selectedRecipe.description;
    $('#update-recipe-modal').modal('show');
}

let tableBody = document.getElementById('table-body');
tableBody.addEventListener('click', function(e) {
    let targetRecipe = e.target;
    if(targetRecipe.classList.contains('delete')) {
        let selectedID = targetRecipe.parentElement.parentElement.firstElementChild.innerHTML;
        let url = `${serverURL}/${selectedID}`;
        FetchHttp.delete(url).then((data) => {
            console.log(data);
            fetchAllRecipes();
        }).catch((err) => {
            console.log(err);
        })
    }
    if(targetRecipe.classList.contains('update')) {
        let recipeID = targetRecipe.parentElement.parentElement.firstElementChild.innerHTML;
        let url = `${serverURL}/listRecipes`;
        FetchHttp.get(url).then((data) => {
            let recipes = data;
            let selectedRecipe = recipes.find((recipe) => {
                return recipe._id === recipeID.trim();
            })
            populateUpdateModal(selectedRecipe);
        }).catch((err) => {
            console.log(err);
        })
    }
})

let updateRecipeForm = document.getElementById("update-recipe-form");
updateRecipeForm.addEventListener('submit', function(e) {
    let recipeID = document.getElementById('update-id').value.trim();
    e.preventDefault();
    $('#update-recipe-modal').modal('hide');
    let recipe = {
        title: document.getElementById('update-title').value,
        ingredients: document.getElementById('update-ingredients').value,
        timeToCook: document.getElementById('update-timeToCook').value,
        description: document.getElementById('update-description').value
    };
    let url = `${serverURL}/${recipeID}`;
    FetchHttp.put(url, recipe).then((data) => {
        console.log(data);
        fetchAllRecipes();
    }).catch((err) => {
        console.log(err);
    })
    clearFormFields();
})