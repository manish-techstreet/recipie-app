// Check if the favorites meal array exists in local storage, and create it if not
if (localStorage.getItem("favouritesList") === null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Function to fetch meals from the API and return the data
async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

// Show all meal cards in the main section based on the search input value
function showMealList() {
    let inputValue = document.getElementById("my-search").value;
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = '';

    // Fetch meal data based on the input value
    let meals = fetchMealsFromApi(url, inputValue);

    meals.then(data => {
        if (data.meals) {
            data.meals.forEach((element) => {
                let isFav = false;
                for (let index = 0; index < arr.length; index++) {
                    if (arr[index] === element.idMeal) {
                        isFav = true;
                    }
                }

                // Create HTML structure for meal cards
                html += `
                <div class="wrapper">
                    <div class="card">
                        <img src="${element.strMealThumb}">
                        <div class="descriptions">
                            <h1>${element.strMeal}</h1>
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light ${isFav ? 'active' : ''}" onclick="addRemoveFromFavList(${element.idMeal})" style="border-radius: 50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
            });
        } else {
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-6 lead">
                                There is no meal matching your search.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    });
}

// Show details of a selected meal
async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    let data = await fetchMealsFromApi(url, id);

    if (data.meals) {
        const meal = data.meals[0];
        html += `
          <div id="meal-details" class="container mt-5">
            <div class="row">
              <div class="col-md-6">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid">
              </div>
              <div class="col-md-6">
                <h2>${meal.strMeal}</h2>
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Area:</strong> ${meal.strArea}</p>
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
                <a href="${meal.strYoutube}" target="_blank" class="btn btn-primary">Watch Video</a>
              </div>
            </div>            
          </div>
        `;
    }

    document.getElementById("main").innerHTML = html;
}

// Show all favorite meals in the favorites section
async function showFavMealList() {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (arr.length === 0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">Your Favorites</span>
                            <div class="mb-4 lead">
                                No meals added to your favorites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="dropdown-cart">
                <div class="dropdown-cart-header">
                    <span class="cart-title">Your Favorites</span>
                </div>
                <div class="dropdown-cart-body">
        `;
        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url, arr[index]).then(data => {
                html += `
                    <div class="dropdown-cart-item">
                        <div class="item-image">
                            <img src="${data.meals[0].strMealThumb}" alt="..." class="img-thumbnail">
                        </div>
                        <div class="item-details">
                            <h5 class="item-title">${data.meals[0].strMeal}</h5>
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveFromFavList(${data.meals[0].idMeal})"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                `;
            });
        }
        html += `
                </div>
            </div>
        `;
    }
    document.getElementById("favourites-body").innerHTML = html;
}

// Add or remove meals from the favorites list
function addRemoveFromFavList(id) {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let contain = false;
    for (let index = 0; index < arr.length; index++) {
        if (id === arr[index]) {
            contain = true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("Meal removed from your favorites list");
    } else {
        arr.push(id);
        alert("Meal added to your favorites list");
    }
    localStorage.setItem("favouritesList", JSON.stringify(arr));
    showMealList();
    showFavMealList();
}
