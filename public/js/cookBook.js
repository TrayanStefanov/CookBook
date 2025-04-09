import { FetchHttp } from "../api/FetchHttp.js";
const serverURL = "/recipes";

//BS 5 Modal declaration
var updateModal = new bootstrap.Modal(document.getElementById('update-recipe-modal'));
var addModal = new bootstrap.Modal(document.getElementById('add-recipe-modal'));


// Attaching event handlers on DOM loaded

window.addEventListener("DOMContentLoaded", function (e) {
    navbarClicker();
    fetchLatestCategoryRecipes();
    categoryClicker();
})

// Attach search event listener

document.getElementById('searchField').addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        let searchTerm = document.getElementById('searchField').value;
        searchRecipes(searchTerm);
    }
})

// Attach Event listener to recipe categories on Main page and All recipe page
// On category click it searches the database by the clicked category. Or fetches all recipes.

let categoryClicker = () => {
    document.getElementById('mainCourse').addEventListener('click', () => {
        searchRecipes("Основно")
    })
    document.getElementById('breakfast').addEventListener('click', () => {
        searchRecipes("Закуска")
    })
    document.getElementById('desert').addEventListener('click', () => {
        searchRecipes("Десерт")
    })
    document.getElementById('easyPeasy').addEventListener('click', () => {
        searchRecipes("Бързо&Лесно")
    })
    document.getElementById('dateNight').addEventListener('click', () => {
        searchRecipes("Романтични вечери")
    })
}

// Attach Event listener to recipe categories in navbar
// On category click it searches the database by the clicked category. Or fetches all recipes.

let navbarClicker = () => {
    document.getElementById('nav-allRecipes').addEventListener('click', () => {
        fetchAllRecipes()
    })
    document.getElementById('nav-mainCourse').addEventListener('click', () => {
        searchRecipes("Основно")
    })
    document.getElementById('nav-breakfast').addEventListener('click', () => {
        searchRecipes("Закуска")
    })
    document.getElementById('nav-desert').addEventListener('click', () => {
        searchRecipes("Десерт")
    })
    document.getElementById('nav-easyPeasy').addEventListener('click', () => {
        searchRecipes("Бързо&Лесно")
    })
    document.getElementById('nav-dateNight').addEventListener('click', () => {
        searchRecipes("Романтични вечери")
    })
}

// Searches DB by search term

let searchRecipes = (searchTerm) => {
    // Resets the page's scroll back to top.
    document.getElementById('layer-0').scrollTo({ top: 0, left: 0, behavior: "smooth" });
    document.getElementById('layer-1').style.height = "auto";
    // Check if it was a category search.
    let category = '';
    switch (searchTerm) {
        case 'Основно':
            category = 'mainCourse';
            break;
        case 'Закуска':
            category = 'breakfast';
            break;
        case 'Десерт':
            category = 'desert';
            break;
        case 'Бързо&Лесно':
            category = 'easyPeasy';
            break;
        case 'Романтични вечери':
            category = 'dateNight';
            break;
        default: category = 'allRecipes'

    }
    let url = `${serverURL}/searchRecipes/?${searchTerm}`;
    // Server request.
    FetchHttp.get(url).then((data) => {
        let recipesPage =
            `
            <div id="recipe-list-header">
                <h1 id="title" class="pb-1 text-center">
                    Какво ще готвим заедно днес?
                </h1>
            </div>
            <div class="row" id="categories-container">
                <div class="category-header">
                    <div class="category" id="allRecipes">Всички</div>
                    <span class="category-underline" style="display: none;"></span>
                </div>
                <div class="category-header">
                    <div class="category" id="mainCourse">Основно</div>
                    <span class="category-underline" style="display: none;"></span>
                </div>
                <div class="category-header">
                    <div class="category" id="breakfast">Закуска</div>
                    <span class="category-underline" style="display: none;"></span>
                </div>
                <div class="category-header">
                    <div class="category" id="desert">Десерт</div>
                    <span class="category-underline" style="display: none;"></span>
                </div>
                <div class="category-header">
                    <div class="category" id="easyPeasy">Бързо&Лесно</div>
                    <span class="category-underline" style="display: none;"></span>
                </div>
                <div class="category-header">
                    <div class="category" id="dateNight">Романтични вечери</div>
                    <span class="category-underline" style="display: none;"></span>
                </div>
                </div>
                <div id="recipe-list" class="justify-content-center">
                </div> 
        `
        // Visualizing HTML block to prepare for recipe data.
        document.getElementById('layer-1').innerHTML = recipesPage;
        let recipes = data;
        let recipeRow = `<div class="row" style="justify-content: center;">`;
        // Looping the recipes. Preperaing the HTML code block.
        for (let recipe of recipes) {
            recipeRow += `
            <div class="col pb-2">
                <div class="card">
                    <img  class="card-img-top" src="${recipe.imgDirPath}" alt="2">
                    <div class="card-time-circle">
                    <div class="card-time-container">
                        <i class="fa-regular fa-clock clock"></i>
                        <div class="card-timeToCook">${recipe.timeToCook}</div>
                    </div>
                    </div>
                    <div class="card-body p2">
                        <div hidden>${recipe._id}</div>
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text"> ${recipe.summary}</p>
                    </div>
                    <button class="btn more-info-btn";">Прочети повече</button>
                </div>
            </div>`;
        }
        // Visualizing the built HTML code block.
        document.getElementById("recipe-list").innerHTML = recipeRow;
        // Underline category if clicked/searched
        document.getElementById(category).nextElementSibling.style.display = "block";
        // Reattaching Event listeners
        categoryClicker();
        document.getElementById('allRecipes').addEventListener('click', () => {
            fetchAllRecipes()
        })
    }).catch((err) => {
        console.log(err);
    })
}

// Fetches last 10 recipes from latest 5 category added to database.

let fetchLatestCategoryRecipes = () => {
    //Preping carousels
    let recipes = `
        <div class="category-header">
            <div class="category" id="mainCourse">Основно</div>
            <span class="category-underline"></span>
        </div>
        <div class="carouselWrapper">
            <div class="carousel slide" data-bs-interval="1000" id="carousel-mainCourse"
                data-bs-ride="carousel">
                <div class="carousel-inner" id="carousel-content-mainCourse">

                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-mainCourse"
                    data-bs-slide="prev">
                    <span class="carousel-la"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel-mainCourse"
                    data-bs-slide="next">
                    <span class="carousel-ra"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
                    <span class="visually-hidden">Next</span>
            </div>
        </div>
        <div class="category-header">
            <div class="category" id="breakfast">Закуска</div>
            <span class="category-underline"></span>
        </div>
        <div class="carouselWrapper">
            <div class="carousel slide" data-bs-interval="1000" id="carousel-breakfast"
                data-bs-ride="carousel">
                <div class="carousel-inner" id="carousel-content-breakfast">
                
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-breakfast"
                    data-bs-slide="prev">
                    <span class="carousel-la"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel-breakfast"
                    data-bs-slide="next">
                    <span class="carousel-ra"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
                    <span class="visually-hidden">Next</span>
            </div>
        </div>
        <div class="category-header">
            <div class="category" id="desert">Десерт</div>
            <span class="category-underline"></span>
        </div>
        <div class="carouselWrapper">
            <div class="carousel slide" data-bs-interval="1000" id="carousel-desert"
                data-bs-ride="carousel">
                <div class="carousel-inner" id="carousel-content-desert">
                
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-desert"
                    data-bs-slide="prev">
                    <span class="carousel-la"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel-desert"
                    data-bs-slide="next">
                    <span class="carousel-ra"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
                    <span class="visually-hidden">Next</span>
            </div>
        </div>
        <div class="category-header">
            <div class="category" id="easyPeasy">Бързо&Лесно</div>
            <span class="category-underline"></span>
        </div>
        <div class="carouselWrapper">
            <div class="carousel slide" data-bs-interval="1000" id="carousel-easyPeasy"
                data-bs-ride="carousel">
                <div class="carousel-inner" id="carousel-content-easyPeasy">
                
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-easyPeasy"
                    data-bs-slide="prev">
                    <span class="carousel-la"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel-easyPeasy"
                    data-bs-slide="next">
                    <span class="carousel-ra"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
                    <span class="visually-hidden">Next</span>
            </div>
        </div>
        <div class="category-header">
            <div class="category" id="dateNight">Романтични вечери</div>
            <span class="category-underline"></span>
        </div>
        <div class="carouselWrapper">
            <div class="carousel slide" data-bs-interval="1000" id="carousel-dateNight"
                data-bs-ride="carousel">
                <div class="carousel-inner" id="carousel-content-dateNight">
                
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-dateNight"
                    data-bs-slide="prev">
                    <span class="carousel-la"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel-dateNight"
                    data-bs-slide="next">
                    <span class="carousel-ra"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
                    <span class="visually-hidden">Next</span>
            </div>
        </div>
    `;
    //Calling Category search
    fetchCategoryRecipes("Основно");
    fetchCategoryRecipes("Закуска");
    fetchCategoryRecipes("Десерт");
    fetchCategoryRecipes("Бързо&Лесно");
    fetchCategoryRecipes("Романтични вечери");
    // Visualizing the built HTML code block.
    document.getElementById('latest-recipe-list').innerHTML = recipes;
}

// Fetches last 10 recipes from category added to database.
let fetchCategoryRecipes = (searchTerm) => {
    let category = '';
    switch (searchTerm) {
        case 'Основно':
            category = 'mainCourse';
            break;
        case 'Закуска':
            category = 'breakfast';
            break;
        case 'Десерт':
            category = 'desert';
            break;
        case 'Бързо&Лесно':
            category = 'easyPeasy';
            break;
        case 'Романтични вечери':
            category = 'dateNight';
            break;
        default: category = 'allRecipes'

    }
    let url = `${serverURL}/latestCategoryRecipes/?${searchTerm}`;
    // Server request.
    FetchHttp.get(url).then((data) => {
        let categoryRecipes = data;
        let categoryRecipesList = ``;
        // Looping the recipes. Preperaing the HTML code block.
        for (let recipe of categoryRecipes) {
            categoryRecipesList += `
            <div class="carousel-item ${category}">
                <div class="col-md-3">
                    <div class="card">
                        <img class="card-img-top" src="${recipe.imgDirPath}" alt="2">
                        <div class="card-time-circle">
                        <div class="card-time-container">
                            <i class="fa-regular fa-clock clock"></i>
                            <div class="card-timeToCook">${recipe.timeToCook}</div>
                        </div>
                        </div>
                        <div class="card-body p2">
                            <div hidden>${recipe._id}</div>
                            <h5 class="card-title">${recipe.title}</h5>
                            <p class="card-text"> ${recipe.summary}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
            // Visualizing the built HTML code block in it's specific category carousel.
            document.getElementById("carousel-content-" + category).innerHTML = categoryRecipesList;
            //Setting the active carousel slide.
            document.getElementById("carousel-content-" + category).firstElementChild.classList.add("active");
            carouselVisualiser(category);
        }
    }).catch((err) => {
        console.log(err);
    })
}

// Fetches last 10 recipes added to database.
// Not used atm

let fetchLatestRecipes = () => {
    let url = `${serverURL}/latestRecipes`;
    // Server request.
    FetchHttp.get(url).then((data) => {
        let recipes = data;
        let recipeRow = ``;
        // Looping the recipes. Preperaing the HTML code block.
        for (let recipe of recipes) {
            recipeRow += `
            <div class="carousel-item">
                <div class="col-md-3">
                    <div class="card">
                        <img  class="card-img-top" src="${recipe.imgDirPath}" alt="2">
                        <div class="card-time-circle">
                        <div class="card-time-container">
                            <i class="fa-regular fa-clock clock"></i>
                            <div class="card-timeToCook">${recipe.timeToCook}</div>
                        </div>
                        </div>
                        <div class="card-body p2">
                            <div hidden>${recipe._id}</div>
                            <h5 class="card-title">${recipe.title}</h5>
                            <p class="card-text"> ${recipe.summary}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        // Visualizing the built HTML code block.
        document.getElementById("test1").innerHTML = recipeRow;
        document.getElementById("test1").firstElementChild.classList.add("active");
        carouselVisualiser();
    }).catch((err) => {
        console.log(err);
    })
}

// Fetches all recipes from database.

let fetchAllRecipes = () => {
    document.getElementById('layer-0').scrollTo({ top: 0, left: 0, behavior: "smooth" });
    document.getElementById('layer-1').style.height = "auto";
    let url = `${serverURL}/listRecipes`;
    // Server request.
    FetchHttp.get(url).then((data) => {
        let recipesPage =
            `
            <div id="recipe-list-header">
                <h1 id="title" class="pb-1 text-center">
                    Какво ще готвим заедно днес?
                </h1>
            </div>
            <div class="row" id="categories-container">
                    <div class="category-header">
                        <div class="category" id="allRecipes">Всички</div>
                        <span class="category-underline"></span>
                    </div>
                    <div class="category" id="mainCourse">Основно</div>
                    <div class="category" id="breakfast">Закуска</div>
                    <div class="category" id="desert">Десерт</div>
                    <div class="category" id="easyPeasy">Бързо&Лесно</div>
                    <div class="category" id="dateNight">Романтични вечери</div>
            </div>
            <div id="recipe-list">
            </div> 
        `
        // Visualizing HTML block to prepare for recipe data.
        document.getElementById('layer-1').innerHTML = recipesPage;
        let recipes = data;
        let recipeRow = `<div class="row">`;
        // Looping the recipes. Preperaing the HTML code block.
        for (let recipe of recipes) {
            recipeRow += `
            <div class="col pb-2">
                <div class="card">
                    <img  class="card-img-top" src="${recipe.imgDirPath}" alt="2">
                    <div class="card-time-circle">
                    <div class="card-time-container">
                        <i class="fa-regular fa-clock clock"></i>
                        <div class="card-timeToCook">${recipe.timeToCook}</div>
                    </div>
                    </div>
                    <div class="card-body p2">
                        <div hidden>${recipe._id}</div>
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text"> ${recipe.summary}</p>
                    </div>
                    <button class="btn more-info-btn">Прочети повече</button>
                </div>
            </div>`;
        }
        // Visualizing the built HTML code block.
        document.getElementById("recipe-list").innerHTML = recipeRow;
        // Reattaching Event listeners
        categoryClicker();
    }).catch((err) => {
        console.log(err);
    })
}

// Clearing all form field in add recipe modal

let clearFormFields = () => {
    document.getElementById('add-title').value = '';
    document.getElementById('add-summary').value = '';
    document.getElementById('add-typeOfDish').value = '';
    document.getElementById('add-ingredients').value = '';
    document.getElementById('add-timeToCook').value = '';
    document.getElementById('add-description').value = '';
    document.getElementById('add-files').value = '';
}

// Clearing all form field in update new recipe modal

let clearUpdateFormFields = () => {
    document.getElementById('update-id').value = '';
    document.getElementById('update-title').value = '';
    document.getElementById('update-summary').value = '';
    document.getElementById('update-typeOfDish').value = '';
    document.getElementById('update-ingredients').value = '';
    document.getElementById('update-timeToCook').value = '';
    document.getElementById('update-description').value = '';
}

// Add recipe modal form sumbit handler, Server call

let addRecipeForm = document.getElementById("add-recipe-form");
addRecipeForm.addEventListener('submit', function (e) {
    e.preventDefault();
    //Constructing FormData Object to send.
    let formData = new FormData();
    let files = document.getElementById('add-files').files;
    let title = document.getElementById('add-title');
    let summary = document.getElementById('add-summary');
    let typeOfDish = document.getElementById('add-typeOfDish');
    let ingredients = document.getElementById('add-ingredients');
    let timeToCook = document.getElementById('add-timeToCook');
    let description = document.getElementById('add-description');
    formData.append('title', title.value);
    formData.append('summary', summary.value);
    formData.append('typeOfDish', typeOfDish.value);
    formData.append('ingredients', ingredients.value);
    formData.append('timeToCook', timeToCook.value);
    formData.append('description', description.value);
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }
    // For debuging. To be removed.
    console.log(formData);
    console.log(addRecipeForm.files);
    console.log(addRecipeForm.body);
    let url = `${serverURL}/addRecipe`;
    fetch(url, {
        method: 'POST',
        body: formData, // Payload is formData object
    }).then(res => {
        console.log(res.json()); // show added recipe
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
    // Refetching latest recipes.
    /* 
    fetchLatestRecipes(); */
    // Clearing add modal for next function call. 
    clearFormFields();
    addModal.hide();
})

// Populate all form field in update recipe modal with data from server query

let populateUpdateModal = (selectedRecipe) => {
    document.getElementById('update-id').value = selectedRecipe._id;
    document.getElementById('update-title').value = selectedRecipe.title;
    document.getElementById('update-summary').value = selectedRecipe.summary;
    document.getElementById('update-typeOfDish').value = selectedRecipe.typeOfDish;
    document.getElementById('update-ingredients').value = selectedRecipe.ingredients;
    document.getElementById('update-timeToCook').value = selectedRecipe.timeToCook;
    document.getElementById('update-description').value = selectedRecipe.description;
    updateModal.show();
}

// Update, delete, more info button handlers.

// Update button handler. TO DO: Optimization needed. Filter server side to reduce request load.
let updateClick = () => {
    clearUpdateFormFields();
    let selectedID = document.getElementById('recipe-full-id').innerHTML;
    /* let objId = require('mongodb').ObjectId(recipeID);
    console.log(objId);                                     Optimize needed
    console.log(typeof(objId)); */
    let url = `${serverURL}/listRecipes`;
    // Server request.
    FetchHttp.get(url).then((data) => {
        let recipes = data;
        // Maybe make the search server side.

        let selectedRecipe = recipes.find((recipe) => {
            return recipe._id === selectedID.trim();
        })
        populateUpdateModal(selectedRecipe);
    }).catch((err) => {
        console.log(err);
    })
}

// Delete button handler.

let deleteClick = (targetRecipe) => {
    let selectedID = document.getElementById('recipe-full-id').innerHTML;
    let url = `${serverURL}/${selectedID}`;
    FetchHttp.delete(url).then((data) => {
        console.log(data);
        targetRecipe.parentElement.parentElement.remove();
        window.location.href = "/";
    }).catch((err) => {
        console.log(err);
    })
}

// MoreInfo button handler. TO DO: Optimization needed. Filter server side to reduce request load.

let moreInfoClick = (targetRecipe) => {

    //Make do without server query
    let recipeCard = targetRecipe;
    do{
        recipeCard = recipeCard.parentElement;
    } while (recipeCard.className != "card");
    let selectedID = recipeCard.children[2].firstElementChild.innerHTML;
    let url = `${serverURL}/listRecipes`;
    // Server request.

    FetchHttp.get(url).then((data) => {
        let recipes = data;
        let selectedRecipe = recipes.find((recipe) => {
            return recipe._id === selectedID.trim();
        })
        // Detailed recipe HTML block.

        document.getElementById('layer-1').innerHTML =
            `
            <div id="complete-Recipe-container">
                <div id="complete-Recipe">
                    <div class="col">
                        <div class="row" id="recipe-full-top">
                            <div class="col p-0" id="recipe-full-image-wrapper">
                                <div id="recipe-full-id" hidden>${selectedRecipe._id}</div>
                                <img id="recipe-full-image" class="rounded-4" src="${selectedRecipe.imgDirPath}">
                            </div>
                            <div class="col p-2 mt-2 rounded-4" id="recipe-title-time-sum-wrapper">
                                <div id="title-time-wrapper">
                                    <div id="recipe-full-title">
                                        <h3 class="recipe-headers px-2">
                                            ${selectedRecipe.title}
                                        </h3>
                                    </div>
                                    <div class="m-1" id="time-wrapper">
                                        <i class="fa-regular fa-clock clock"></i>
                                        <div class="font-italic font-weight-bold pl-2" id="recipe-full-timeToCook">
                                            ${selectedRecipe.timeToCook}
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="intro-wrapper">
                                    <div id="recipe-full-summary">
                                            ${selectedRecipe.summary}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row p-2 mt-2 rounded-4" id="ingredients-wrapper">
                                    <h3 class="recipe-headers px-2">Съставки:</h3>
                                    <div id="recipe-full-ingredients">
                                        ${selectedRecipe.ingredients}
                                    </div>
                                </div>
                        <div class="row p-2 mt-2 rounded-4" id="description-wrapper">
                            <h3 class="recipe-headers px-2">Начин на приготявяне:</h3>
                            <div id="recipe-full-description">
                                ${selectedRecipe.description}
                            </div>
                        </div>
                        <div class="row p-2 mt-2 btn-group-sm" id="recipe-options">
                            <button class="btn m-1 rounded-3 update-btn">Редактирай Рецептата</button>
                            <button class="btn m-1 rounded-3 delete-btn">Изтрий Рецептата</button>
                            <button class="btn m-1 rounded-3 home-btn"><a href="/">Начало</a></button>
                        </div>
                    </div>
                </div>
            </div>
            `
        }).catch((err) => {
        console.log(err);
    })
}

// Event listener for update, delete, more info buttons

let tableBody = document.getElementById('layer-1');
tableBody.addEventListener('click', function (e) {
    let targetRecipe = e.target;
    if (targetRecipe.classList.contains('delete-btn')) {
        deleteClick(targetRecipe)
    } else if (targetRecipe.classList.contains('update-btn')) {
        updateClick(targetRecipe)
        // More-info should trigger via btn, card title and card image.
    } else if (targetRecipe.classList.contains('more-info-btn') || 
               targetRecipe.classList.contains('card-img-top') ||
               targetRecipe.classList.contains('card-title')) {
        moreInfoClick(targetRecipe);
    }
})

// Update recipe modal form sumbit handler, Server call

let updateRecipeForm = document.getElementById('update-recipe-form');
updateRecipeForm.addEventListener('submit', function (e) {
    let recipeID = document.getElementById('update-id').value.trim();
    e.preventDefault();
    updateModal.hide();
    // Constructing recipe JSON object
    let recipe = {
        title: document.getElementById('update-title').value,
        summary: document.getElementById('update-summary').value,
        typeOfDish: document.getElementById('update-typeOfDish').value,
        ingredients: document.getElementById('update-ingredients').value,
        timeToCook: document.getElementById('update-timeToCook').value,
        description: document.getElementById('update-description').value
    };
    document.getElementById('recipe-full-title').innerHTML = recipe.title;
    document.getElementById('recipe-full-summary').innerHTML = recipe.summary;
    document.getElementById('recipe-full-timeToCook').innerHTML = recipe.timeToCook;
    document.getElementById('recipe-full-ingredients').innerHTML = recipe.ingredients;
    document.getElementById('recipe-full-description').innerHTML = recipe.description;
    let url = `${serverURL}/${recipeID}`;
    // Server request.
    FetchHttp.put(url, recipe).then((data) => {
        data._id = "hidden";
        console.log(data);
        //fetchAllRecipes(); Need to refresh Recipes
    }).catch((err) => {
        console.log(err);
    })
    clearUpdateFormFields();
})

// About page event listener and append content

document.getElementById('about').addEventListener('click', () => {
    document.getElementById('layer-1').innerHTML = `
        <div id="about-page-wrapper">
            <h1 id="about-header">Повече за сайта</h1>                
            <h2 class="about-subheader">За какво може да се използва сайтът?</h2>
            <p class="about-text rounded-4 p-2 mt-2">
                В момента сайтът е твоят персонален помощник за всичките ти кулинарни произведения на искуството.
                Тук можеш да записваш успешните гозби които си приготвил и не искаш.
                Или рецепти нуждаейки се от още усъвършенсвтане.
                По всяко време можеш да потърсиш и намериш подходяща рецепта на момента.
                Чрез категориите лесно може да избереш какво за сготвиш за всяко ядене от деня.  
            </p>
            <h2 class="about-subheader">Колко хора работят върху този проект?</h2>
            <p class="about-text rounded-4 p-2 mt-2">
                За момента се занимавам само аз. Ако искате да знаете повече за мен посете моят портфолио сайт.
                Достъпен по късно тази година.
            </p>
            <h2 class="about-subheader">Планове за бъдещето:</h2>
            <p class="about-text rounded-4 p-2 mt-2">
                Смятам да продължавам да работя по този проект през свободното ми време. Създадох този сайт за моето улесняване по време на готвене и създаване на нови рецепти. 
                Не мога да споделя конкретни планове за добавяне на нови функционалности,
                но нещо което свободно мога да разкрия е - проектът ще се развие от личен асситент към социален сайт за споделяне, развиване и създаване на вкусни рецепти. 
                Мечтата ми е някой ден този сайт да е най-разпространениа сайт за всичко кулинарни потребности на всеки българин.
            </p>
            <b id="aspirations" class="mt-2">Нека извисим българската кухня на първо място в света чрез нашите общи усилия.</b>    
        </div>
        `
})

// Navbar menu toggle

document.querySelector('#mobile-menu').addEventListener('click', function () {
    document.querySelector('#mobile-menu').classList.toggle('is-active');
    document.querySelector('.nav-menu').classList.toggle('active');
})

/* carousel logic */

let carouselVisualiser = (category) => {
    var items = document.querySelectorAll("." + category);
    items.forEach((el) => {
        const slide = 5;
        let next = el.nextElementSibling;
        for (var i = 0; i < slide; i++) {
            if (!next) {
                // wrap carousel by using first child
                next = items[0];
            }
            let cloneChild = next.cloneNode(true);
            el.appendChild(cloneChild.children[0]);
            next = next.nextElementSibling;
        }
    })
}
