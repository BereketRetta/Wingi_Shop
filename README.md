# Wingi Store

Wingi Store Website made with React.js Framework.


## Demo
* [Demo Link](https://63f254503c915f05e4c84b96--rainbow-kringle-678e83.netlify.app/)


## Tech Stack

* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Bootstrap](https://getbootstrap.com/)
* [Firebase](https://firebase.google.com/)


## To Set it Up locally
* First clone the project `git clone https://github.com/BereketRetta/Wingi_Shop.git`
* chnage the directory using the command `cd wingi_shop`
* install all the dependecies by running the command `yarn`
* FInally, you can do `yarn start` to start the development server and go to your favorite browser and type `localhost:3000`


## Website Structure
* There is a home page with all teh products 
* There is also a contact us page
* There is bothe sign in and log in page which are fully functional and integrated with firebase
* After logging in you can see there is a new button called `Go To Dashboard` which will take you to a Dashboard page
* In the Dashboard page you can add a product using the busson add product and you can edit existing product by pressing edit products
* When press Add Product you can find a form and there you can all the relevant info and after pressing `Add` the changes will be persisted on firebaste's firestore database
* Editing also works the same way you can edit existing products and persist it in a firestore database.
* If changes are not reflected quickly reload the page.
