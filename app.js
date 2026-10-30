const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const _ = require('lodash')
require('dotenv').config(); 
const date = require(__dirname + "/date.js"); 

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true})); 


// mongoose.connect('mongodb://localhost:27017/toDoListDB'); 
async function connectDB(){
  // new password atlas database idiotLeaked@321
  await mongoose.connect(process.env.CONNECTIONSTRING, {
                         
    family: 4 // Force Node.js to use IPv4 instead of IPv6
  }); 
}


async function connectDB2(){
  await mongoose.connect(process.env.CONNECTIONSTRING, {
    family: 4 // Force Node.js to use IPv4 instead of IPv6
  }); 
}
connectDB2(); 
const itemsSchema = new mongoose.Schema({
  name: String
})

const  listSchema = new mongoose.Schema({
  name: String, 
  list: [itemsSchema], 
})

const Item = mongoose.model('item', itemsSchema); 
const List = mongoose.model('list', listSchema); 


const item1 = new Item({
  name: "Welcole to the world"
})

const item2 = new Item({
  name: "first let's take over the world"
})

const item3 = new Item({
  name: "second Let's get rich"
})

const defaultItems = [item1, item2, item3]
 async function insertDoc (){
   try {
     const insertedDocs = await Item.insertMany(defaultItems); 
     console.log("Success"); 
   } catch(err){
     console.error("Insertion failed", error)
   }
 }

//  insertDoc(); 
 let items = []; 

 async function readData(){
   try {
    const data = await Item.find({}); 
    items = data.map(item => item.name); 
    if(!items.length) {
      insertDoc(); 
    }
    // console.log(data)
   }catch(err){
     console.error(err); 
   }
 }

async function fineOne(name) {
  try {
    const user = await List.findOne({name: name})
    if(user){
      console.log("Item found")
      return user; 
    } else {
      console.log("Item not found"); 
      return false; 
    }
  }catch(err){
    console.log(err); 
  }
} 



async function deleteByName(element){
  try {
    const result = await Item.deleteOne({name: element})
    console.log("Deleted items: " + result.deletedCount); 
  } catch(err){
    console.error(err); 
  }
}

 readData()
// let items = ["Buy the Food", "Cook the Food", "Eat the Food"]; 
// let work = []; 

app.get("/", async function (req, res) {   
  const day = date.getDate(); 
  await readData()
  res.render('list', {Today: day, Name: "list", ItemsList : items}); 

});

app.post("/", async function(req, res) {
  const newItem = req.body.addItem; 
  const listName = req.body.list; 

  const itemX = new Item({
    name: newItem,
  })
  if(listName === 'list') {
    await itemX.save(); 
    res.redirect('/')
  }
  else {
    const foundList = await fineOne(listName);  
    foundList.list.push(itemX); 
    await foundList.save(); 
    res.redirect('/' + listName)
  }
 

 
  
 
})


app.post('/delete', async function(req, res){
 
  const checked = req.body.checkbox; 
  const listNamex = req.body.listName; 

  if(listNamex === "list"){
    await deleteByName(checked); 
    res.redirect('/')
  } else {
    // const list = await fineOne(listName); 

    const listName = listNamex; // The name of the main list document
    const itemNameToRemove = checked; // The name of the item inside the array

     const updatedList = await List.findOneAndUpdate(
      { name: listName },
      { $pull: { list: { name: itemNameToRemove } } },
      { returnDocument: 'after' } // Returns the document *after* the item is deleted
    );
     res.redirect('/' + listName); 
  }



})


app.get('/:listName', async function  (req, res){
  const listName = _.capitalize(req.params.listName); 
  const foundList = await fineOne(listName); 

  if(foundList) {
    res.render('list', {Today: date.getDate(),Name: foundList.name,  ItemsList : foundList.list.map(item => item.name)}); 
  } else {
    const list = new List({
      name: listName, 
      list: defaultItems, 

    })
    await list.save(); 
    res.render('list', {Today: date.getDate(),Name: list.name,  ItemsList : list.list.map(item => item.name)}); 
  }
})




app.get("/about", function(req, res) {
  res.render('about'); 
})
 

app.listen(3000, function () {
  console.log("server is running");
});











const currentday = function() {
    const date = new Date(); 
    let today = ""; 
    switch(date.getDay()){
        case 0 : today = "Sunday"; 
                 break; 
        case 1 : today = "Monday"; 
                 break; 
        case 2 : today = "Tuesday"; 
                 break; 
        case 3 : today = "Wednsday"; 
                 break; 
        case 4 : today = "Thursday"; 
                 break; 
        case 5 : today = "Friday"; 
                 break; 
        case 6 : today = "Satuday"; 
                 break; 
    }
    return today; 
}