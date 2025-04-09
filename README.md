# CookBook Website

  A personal Cookbook for saving recipes so as to not forget them. This website was coded with VScode. 
  It is localy hosted. Alpha version.

## Specifications

  - Full stack project.
  - Runs on a mongo DB.
  
## How to Setup

  - Clone the repository.
  - All dependancies needed are included in the package.json file.
  - .env file is included. Change variables as needed.
  - Start database with "mongod --dbpath *your directory*\CookBook\data\db".  
  - Start the server with "npm run server".

## Features

  - Carousels showing latest 10 recipes from latest 5(currently the only 5) categories.
  - Searching recipes. Currently only supports exact strings. 
  - Adding recipes. You can do this via the cutting board icon on the homepage. All modal fields are required. Currently only supports 1 image upload.
  - Updating recipes. On each recipe's detailed page via a button. At the moment updating recipe image is not supported.
  - Deleting recipes. On each recipe's detailed page via a button.

# For the future
  
  - The project is in active development.
  - After the project is in a comfortable place I plan to evolve it into a social platform centered on diverse, tasty and healty food.

Advice regarding any part of the project and new ideas are always welcomed. 
