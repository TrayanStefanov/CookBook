import { FetchHttp } from "../api/FetchHttp.js";
const serverURL = "/recipes";

// Attaching event handlers on DOM loaded.

window.addEventListener("DOMContentLoaded", function (e) {
    fetchLatestRecipes();
    categoryClicker();
    navbarClicker();
})

// Attaching search event listener. Currently only via Enter key. 'Search' Button to be added.

document.getElementById('searchField').addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        let searchTerm = document.getElementById('searchField').value;
        searchRecipes(searchTerm);
    }
})


// Attaching Event listeners to recipe categories on Main page and All recipe pages. 
// On category click it searches the database by the clicked category.

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

// Attaching Event listeners to recipe categories in navbar.
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
            <div id="recipe-List-Header">
                <div id="title">
                    Какво ще готвим заедно днес?
                </div>
            </div>
            <div class="row" id="categories-container">
                    <div class="col category" id="allRecipes">Всички</div>
                    <div class="col category" id="mainCourse">Основно</div>
                    <div class="col category" id="breakfast">Закуска</div>
                    <div class="col category" id="desert">Десерт</div>
                    <div class="col category" id="easyPeasy">Бързо&Лесно</div>
                    <div class="col category" id="dateNight">Романтични вечери</div>
            </div>
            <div id="recipe-List" class="justify-content-center">
            </div> 
        `
        // Visualizing HTML block to prepare for recipe data.
        document.getElementById('layer-1').innerHTML = recipesPage;
        let recipes = data;
        let recipeRow = `<div class="row" style="justify-content: center;">`;
        // Looping the recipes. Preperaing the HTML code block.
        for (let recipe of recipes) {
            recipeRow += `
            <div class="col pb-2" style="min-width: 20%; max-width:16vw;">
                <div class="card" style="border:none; border-radius: 1vw 1vw 0 0;">
                    <img class="card-img-top" style="border-radius: 1vw 1vw 0 0;"
                        src="${recipe.imgDirPath}">
                    <div class="card-body p-2" style="position:relative">
                        <div hidden>${recipe._id}</div>
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.summary}</p>
                        <div class="card-bottom-container">
                                <img src="./img_assets/clock-icon.png" class="card-timeToCook-icon" alt="">
                                <div class ="card-timeToCook">${recipe.timeToCook}</div>
                                <button class="btn btn-success moreInfo" style="font-size:xx-small;">Прочети повече</button>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        // Visualizing the built HTML code block.
        document.getElementById("recipe-List").innerHTML = recipeRow;
        // Underline category if clicked/searched
        document.getElementById(category).style.textDecoration = "underline";
        // Reattaching Event listeners
        categoryClicker();
        document.getElementById('allRecipes').addEventListener('click', () => {
            fetchAllRecipes()
        })
    }).catch((err) => {
        console.log(err);
    })
}

// Fetches last 5 recipes added to database.

let fetchLatestRecipes = () => {
    let url = `${serverURL}/latestRecipes`;
    // Server request.
    FetchHttp.get(url).then((data) => {
        let recipes = data;
        let recipeRow = ``;
        // Looping the recipes. Preperaing the HTML code block.
        for (let recipe of recipes) {
            recipeRow += `<div class="col pb-2" style="min-width: 20%;">
                <div class="card" style="border:none; border-radius: 1vw 1vw 0 0;">
                    <img class="card-img-top" style="border-radius: 1vw 1vw 0 0;"
                        src="${recipe.imgDirPath}">
                    <div class="card-body p-2" style="position:relative">
                        <div hidden>${recipe._id}</div>
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.summary}</p>
                        <div class="card-bottom-container">
                                <img src="./img_assets/clock-icon.png" class="card-timeToCook-icon" alt="">
                                <div class ="card-timeToCook">${recipe.timeToCook}</div>
                                <button class="btn btn-success moreInfo" style="font-size:xx-small;">Прочети повече</button>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        // Visualizing the built HTML code block.
        document.getElementById("latest-Recipes").innerHTML = recipeRow;
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
            <div id="recipe-List-Header">
                <div id="title">
                    Какво ще готвим заедно днес?
                </div>
            </div>
            <div class="row" id="categories-container">
                    <div class="col category" style="text-decoration: underline" id="allRecipes">Всички</div>
                    <div class="col category" id="mainCourse">Основно</div>
                    <div class="col category" id="breakfast">Закуска</div>
                    <div class="col category" id="desert">Десерт</div>
                    <div class="col category" id="easyPeasy">Бързо&Лесно</div>
                    <div class="col category" id="dateNight">Романтични вечери</div>
            </div>
            <div id="recipe-List">
            </div> 
        `
        // Visualizing HTML block to prepare for recipe data.
        document.getElementById('layer-1').innerHTML = recipesPage;
        let recipes = data;
        let recipeRow = `<div class="row">`;
        // Looping the recipes. Preperaing the HTML code block.
        for (let recipe of recipes) {
            recipeRow += `
            <div class="col pb-2" style="min-width: 20%;">
                <div class="card" style="border:none; border-radius: 1vw 1vw 0 0;">
                    <img class="card-img-top" style="border-radius: 1vw 1vw 0 0;"
                        src="${recipe.imgDirPath}">
                    <div class="card-body p-2" style="position:relative">
                        <div hidden>${recipe._id}</div>
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.summary}</p>
                        <div class="card-bottom-container">
                                <img src="./img_assets/clock-icon.png" class="card-timeToCook-icon" alt="">
                                <div class ="card-timeToCook">${recipe.timeToCook}</div>
                                <button class="btn btn-success moreInfo" style="font-size:xx-small;">Прочети повече</button>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        // Visualizing the built HTML code block.
        document.getElementById("recipe-List").innerHTML = recipeRow;
        categoryClicker();
    }).catch((err) => {
        console.log(err);
    })
}

// Clearing all form fields in add recipe modal.

let clearFormFields = () => {
    document.getElementById('add-title').value = '';
    document.getElementById('add-summary').value = '';
    document.getElementById('add-typeOfDish').value = '';
    document.getElementById('add-ingredients').value = '';
    document.getElementById('add-timeToCook').value = '';
    document.getElementById('add-description').value = '';
    document.getElementById('add-files').value = '';
}

// Clearing all form fields in update recipe modal.

let clearUpdateFormFields = () => {
    document.getElementById('update-id').value = '';
    document.getElementById('update-title').value = '';
    document.getElementById('update-summary').value = '';
    document.getElementById('update-typeOfDish').value = '';
    document.getElementById('update-ingredients').value = '';
    document.getElementById('update-timeToCook').value = '';
    document.getElementById('update-description').value = '';
}

// Add recipe modal form sumbit handler

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
        body: formData,
    }).then(res => {
        // Show added recipe.
        console.log(res.json());
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
    // Refetching latest recipes.
    fetchLatestRecipes();
    // Clearing add modal for next function call. 
    clearFormFields();
    $('#add-recipe-modal').modal('hide');
})

// Populate all form fieldS in update recipe modal with data from server query.

let populateUpdateModal = (selectedRecipe) => {
    document.getElementById('update-id').value = selectedRecipe._id;
    document.getElementById('update-title').value = selectedRecipe.title;
    document.getElementById('update-summary').value = selectedRecipe.summary;
    document.getElementById('update-typeOfDish').value = selectedRecipe.typeOfDish;
    document.getElementById('update-ingredients').value = selectedRecipe.ingredients;
    document.getElementById('update-timeToCook').value = selectedRecipe.timeToCook;
    document.getElementById('update-description').value = selectedRecipe.description;
    $('#update-recipe-modal').modal('show');
}

// Update, delete, more info button handlers. Needs a refactoring.

let tableBody = document.getElementById('layer-1');
tableBody.addEventListener('click', function (e) {
    let targetRecipe = e.target;
    if (targetRecipe.classList.contains('deleteButton')) {
        // Delete button handler.
        let selectedID = document.getElementById('recipe-full-id').innerHTML;
        let url = `${serverURL}/${selectedID}`;
        // Server request.
        FetchHttp.delete(url).then((data) => {
            console.log(data);
            targetRecipe.parentElement.parentElement.remove();
            window.location.href = "/";
        }).catch((err) => {
            console.log(err);
        })
    } else if (targetRecipe.classList.contains('updateButton')) {
            // Update button handler. TO DO: Optimization needed. Filter server side to reduce request load.
            clearUpdateFormFields();
            let selectedID = document.getElementById('recipe-full-id').innerHTML;
            /* let objId = require('mongodb').ObjectId(recipeID);
            console.log(objId);                                     Optimization needed
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
        } else if (targetRecipe.classList.contains('moreInfo')) {
            // MoreInfo button handler. TO DO: Optimization needed. Filter server side to reduce request load.
            let selectedID = targetRecipe.parentElement.parentElement.firstElementChild.innerHTML;
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
                <div id="complete-Recipe">
                    <div class="col">
                        <div class="row">
                            <div class="col">
                                <div id="recipe-full-id" hidden>${selectedRecipe._id}</div>
                                <img id="recipe-full-image" src="${selectedRecipe.imgDirPath}">
                            </div>
                            <div class="col-7">
                                <div class="row">
                                    <div class="col-9">
                                        <div id="recipe-full-title">
                                            <h1>
                                                ${selectedRecipe.title}
                                            </h1>
                                        </div>
                                    </div>
                                    <div class="col d-flex justify-content-end" id="time-wrapper">
                                        <img id="clock-icon" src="./img_assets/clock-icon.png">
                                        <div class="font-italic font-weight-bold pl-2 pt-1" id="recipe-full-timeToCook">
                                            ${selectedRecipe.timeToCook}
                                        </div>
                                    </div>
                                </div>
                                <div class="row" id="intro-wrapper">
                                    <!-- 
                                        <h4>Интро</h4>
                                     -->
                                    <div class="shadow p-1 ml-3 mr-3" id="recipe-full-summary">
                                        <cite>
                                            ${selectedRecipe.summary}
                                        </cite>
                                    </div>
                                </div>
                                <div class="col mt-2" id="ingredients-wrapper">
                                    <h4>Съставки:</h4>
                                    <div id="recipe-full-ingredients">
                                        ${selectedRecipe.ingredients}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row m-1">
                            <h3>Начин на приготявяне</h3>
                        </div>
                        <div class="row m-1 pl-2">
                            <div id="recipe-full-description">
                                ${selectedRecipe.description}
                            </div>
                        </div>
                        <div class="row m-1 btn-group-sm justify-content-end" id="recipe-options">
                            <button class='btn btn-success updateButton'>Редактирай Рецептата</button>
                            <button class='btn btn-success deleteButton'>Изтрий Рецептата</button>
                            <a href="/"><button class='btn btn-success'>Начало</button></a>
                        </div>
                    </div>
                </div>
                `
            }).catch((err) => {
                console.log(err);
            })
        }
})

// Update recipe modal form sumbit handler, Server call

let updateRecipeForm = document.getElementById('update-recipe-form');
updateRecipeForm.addEventListener('submit', function (e) {
    let recipeID = document.getElementById('update-id').value.trim();
    e.preventDefault();
    $('#update-recipe-modal').modal('hide');
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
    // Server request.
    let url = `${serverURL}/${recipeID}`;
    FetchHttp.put(url, recipe).then((data) => {
        data._id = "hidden";
        console.log(data);
        //fetchAllRecipes(); Need to refresh Recipes
    }).catch((err) => {
        console.log(err);
    })
    clearUpdateFormFields();
})

// About page event listener and append content.

document.getElementById('about').addEventListener('click', () => {
    document.getElementById('layer-1').innerHTML = `
    <h1>Повече за сайта</h1>                
            <h3>За какво може да се използва сайтът?</h3>
            <p>
                В момента сайтът е твоят персонален помощник за всичките ти кулинарни произведения на искуството.
                Тук можеш да записваш успешните гозби които си приготвил и не искаш.
                Или рецепти нуждаейки се от още усъвършенсвтане.
                По всяко време можеш да потърсиш и намериш подходяща рецепта на момента.
                Чрез категориите лесно може да избереш какво за сготвиш за всяко ядене от деня.  
            </p>
            <h3>Колко хора работят върху този проект?</h3>
            <p>
                За момента се занимавам само аз. Ако искате да знаете повече за мен посете моят портфолио сайт.
                Достъпен по късно тази година.
            </p>
            <h3>Планове за бъдещето</h3>
            <p>
                Смятам да продължавам да работя по този проект през свободното ми време. Създадох този сайт за моето улесняване по време на готвене и създаване на нови рецепти. 
                Не мога да споделя конкретни планове за добавяне на нови функционалности,
                но нещо което свободно мога да разкрия е - проектът ще се развие от личен асситент към социален сайт за споделяне, развиване и създаване на вкусни рецепти. 
                Мечтата ми е някой ден този сайт да е най-разпространениа сайт за всичко кулинарни потребности на всеки българин.
            </p>
            <b>Нека извисим българската кухня на първо място в света чрез нашите общи усилия.</b>    
    `
})

// Navbar menu toggle

document.querySelector('#mobile-menu').addEventListener('click', function () {
    document.querySelector('#mobile-menu').classList.toggle('is-active');
    document.querySelector('.nav-menu').classList.toggle('active');
})