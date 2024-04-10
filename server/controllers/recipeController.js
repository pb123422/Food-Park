require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const Order = require('../models/Order');
const Student = require('../models/Student');

/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
    try {
      const limitNumber = 5;
      const categories = await Category.find({}).limit(limitNumber);
      const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
      const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
      const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
      const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

      const food = { latest, thai, american, chinese };


      res.render('index', { title: 'Food-Park - Home', categories,food} );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
    try {
      const limitNumber = 20;
      const categories = await Category.find({}).limit(limitNumber);
      res.render('categories', { title: 'Food-Park - Categoreis', categories } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 
  
  
  /**
   * GET /categories/:id
   * Categories By Id
  */
  exports.exploreCategoriesById = async(req, res) => { 
    try {
      let categoryId = req.params.id;
      const limitNumber = 20;
      const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
      res.render('categories', { title: 'Food-Park - Categoreis', categoryById } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 
   
  /**
   * GET /recipe/:id
   * Recipe 
  */
  exports.exploreRecipe = async(req, res) => {
    try {
      let recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
      res.render('recipe', { title: 'Food-Park - Recipe', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  /**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
      res.render('search', { title: 'Food-Park - Search', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
    
  }

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
    try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Food-Park - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  /**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
    try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Food-Park - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  /**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Food-Park - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
  }
  
  /**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
    try {

        let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
          });

        // const newRecipe = new Recipe({
        //     name: 'New choclate cake',
        //     description: 'sweet',
        //     email: 'abc@gmail.com',
        //     ingredients: 'water',
        //     category: 'Mexican',
        //     image: 'buddy-s-crispy-chicken.jpg'
        //   });

          await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  }catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}

 /**
 * GET /place-order
 * Place Order
*/
exports.placeOrder = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('place-order', { title: 'Food-Park - Place Order', infoErrorsObj, infoSubmitObj  } );
  }

  /**
 * POST /place-order
 * Place Order
*/
exports.placeOrderOnPost = async(req, res) => {
    try {

        const newOrder = new Order({
            name: req.body.name,
            order: req.body.description,
            email: req.body.email,
          });

          await newOrder.save();
          
          req.flash('infoSubmit', 'Your order has been placed. You will be further notified through your mail.')
          res.redirect('/place-order');
  }catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/place-order');
  }
}





// //Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'Thai green chicken curry' }, { name: 'New' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();

// //Update Student
// async function updateStudent(){
//   try {
//     const res = await Student.updateOne({name:{$eq:"Kevin"}}, {age:"25"});
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateStudent();

// //Sort Student on basis on age in ascending order;
// async function sortStudent(){
//   try {
//     const res = await Student.sort(
//       [
//         { $sort : { age : 1 } }
//       ]
//    );
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// sortStudent();

// Recipes.students.find().sort( { "name": 1 } )

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("Recipes");
//   var mysort = { name: 1 };
//   dbo.collection("students").find().sort(mysort).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
// });

// const query = {};
// const sort = { name: 1 };
// const cursor = collection.find(query).sort(sort);
// await cursor.forEach(console.dir);

Student.find().sort( { "dob": 1 } )



// //Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'maggi' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();

// var http = require('http');  
// var MongoClient = require('mongodb').MongoClient;  
// var url = "mongodb+srv://parth_72:JMapYT8AVXuUyVF@cluster0.okw39.mongodb.net/Recipes?retryWrites=true&w=majority";  
// MongoClient.connect(url, function(err, db) {  
//   if (err) throw err;  
//   var db = client.db('Recipes');
//   var mysort = { name: 1 };  
//   db.collection("students").find().sort(mysort).toArray(function(err, result) {  
//   if (err) throw err;  
//   console.log(result);  
//   db.close();  
//   });  
//   });  






// async function insertDymmyStudentData(){

//     try{
//         await Student.insertMany([
//         {
//                     "name": "Parth Bhargava",
//                     "age": "21",
//                     "dob": "07-07-2000",
//                     "yearofadmission": "2019"
//                   },
//                   {
//                     "name": "roshan",
//                     "age": "21",
//                     "dob": "08-07-2000",
//                     "yearofadmission": "2019"
//                   }, 
//                   {
//                     "name": "Parth2",
//                     "age": "21",
//                     "dob": "09-07-2000",
//                     "yearofadmission": "2019"
//                   },
//                   {
//                     "name": "Kevin",
//                     "age": "20",
//                     "dob": "01-07-2000",
//                     "yearofadmission": "2019"
//                   }, 
//                   {
//                     "name": "Parth3",
//                     "age": "18",
//                     "dob": "02-07-2000",
//                     "yearofadmission": "2019"
//                   }
//                 ]);
//     } catch (error) {
//         console.log('err', + error)
//     }
// }

// insertDymmyStudentData()



// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//         { 
//             "name": "Crispy garlicky chicken",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "American", 
//             "image": "crispy-garlicky-chicken.jpg"
//           },
//           { 
//             "name": "Thai green chicken curry",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "American", 
//             "image": "thai-green-chicken-curry.jpg"
//           },
//     { 
//             "name": "Perfect roast chicken",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "American", 
//             "image": "perfect-roast-chicken.jpg"
//           },
//           { 
//             "name": "Springtime roast chicken Caesar salad",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Mexican", 
//             "image": "easy-roast-chicken-caesar-salad.jpg"
//           },
//           { 
//             "name": "Jollof fried chicken",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Mexican", 
//             "image": "jollof-fried-chicken.jpg"
//           },
//           { 
//             "name": "Jack Dee's rotisserie-style chicken",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Mexican", 
//             "image": "jack-dee-s-rotisserie-style-chicken.jpg"
//           },
//           { 
//             "name": "The ultimate chicken in milk",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Thai", 
//             "image": "the-ultimate-chicken-in-milk.jpg"
//           },
//           { 
//             "name": "Farmhouse roast chicken",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Thai", 
//             "image": "farmhouse-roast-chicken.jpg"
//           },
//           { 
//             "name": "Sesame roast chicken",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Thai", 
//             "image": "sesame-roast-chicken.jpg"
//           },
//           { 
//             "name": "Buddy's crispy chicken",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Indian", 
//             "image": "buddy-s-crispy-chicken.jpg"
//           },
//           { 
//             "name": "Buddy's BBQ chicken lollipops",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Indian", 
//             "image": "buddys-bbq-chicken-lollipops.jpg"
//           },
//           { 
//             "name": "Proper chicken pie",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Indian", 
//             "image": "proper-chicken-pie.jpg"
//           },
//           { 
//             "name": "Easy harissa roast chicken fajitas",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Chinese", 
//             "image": "easy-harissa-roast-chicken-fajitas.jpg"
//           },
//           { 
//             "name": "Gennaro's classic spaghetti carbonara",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Chinese", 
//             "image": "gennaro-s-classic-spaghetti-carbonara.jpg"
//           },
//           { 
//             "name": "Super-quick fresh pasta",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Chinese", 
//             "image": "super-quick-fresh-pasta.jpg"
//           },
//           { 
//             "name": "Scruffy aubergine lasagne",
//             "description": `Super-simple to put together, this is a great, fast method for really good, crispy crumbed chicken, and I’ve added garlic for extra flavour. Pounding the chicken, both before adding the crumbs and to help them to stick, tenderises the meat and makes it even quicker to cook.`,
//             "email": "parth.bhargava2019@vitstudent.ac.in",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "Chinese", 
//             "image": "scruffy-aubergine-lasagne.jpg"
//           },
      
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();