const express = require("express");
const path = require("path");
const dateUtil = require(path.join(__dirname, "date.js"));
// const dateUtil = require(__dirname + "/date.js");
const app = express();
const port = 3000;
console.log(dateUtil);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/todoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error:"));
db.once("open", function () {
  console.log("connected to DB");
});
const ItemSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("Item", ItemSchema, "items");
const items = [
  { name: "get food" },
  { name: "cook food" },
  { name: "eat food" },
];
async function getItems(res) {
  var itemObj = await Item.find();
  var itemNames = [];
  itemObj.forEach(item => {
    itemNames.push({ id: item._id, name: item.name });
  });

  res.render("index2", {
    // title: "today is " + dateUtil.getDay() + ".This is your Home to-do list",
    title: "to do list",
    todoItemsEJS: itemNames,
    buttonTypeEJS: "homeToDo",
  });
}

async function insertItems(req, res) {
  var todoItem = req.body.todoItem;
  if (req.body.todoButton == "workToDo") {
    var item = new Item({ name: todoItem });
    await item.save(function (err, succ) {
      if (err) console.log(err);
      else console.log("inserting item " + succ);
    });
    res.redirect("/work");
  } else if (req.body.todoButton == "homeToDo") {
    var item = new Item({ name: todoItem });
    await item.save(function (err, succ) {
      if (err) console.log(err);
      else console.log("inserting item " + succ);
    });
    res.redirect("/");
  }
}

async function removeItems(req, res) {
  var todoItem = [];

  if (req.body.todoButton == "homeToDoRemove") {
    req.body.checkbox.forEach(id => {
      todoItem.push(id);
    });

    await Item.deleteMany({ _id: todoItem }, function (err, succ) {
      if (err) console.log(err);
      else console.log("inserting item " + succ);
    });
    res.redirect("/");
  }
}
// Item.insertMany(items, function (error, docs) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(docs);
//   }
// });
// var itemObj = Item.find();
// var itemNames = [];
// itemObj.forEach(item => {
//   itemNames.push(item.name);
// });

// var homeTodoItems = ["get food", "cook food", "eat food"];
var homeTodoItems = {};
var workTodoItems = [];
var dateOptions = { weekday: "long" };
var today = new Date();
var dayOfWeek = today.toLocaleDateString("en-US", dateOptions);

app.get("/", (req, res) => {
  getItems(res);
  // var d = new Date();
  // var n = d.getDay()

  // res.render("index", {
  //   // title: "today is " + dateUtil.getDay() + ".This is your Home to-do list",
  //   title:"to do list",
  //   todoItemsEJS: homeTodoItems,
  //   buttonTypeEJS: "homeToDo",
  // });
});
app.get("/work", (req, res) => {
  res.render("index", {
    title: "today is " + dateUtil.getDay() + ".This is your work to-do list ",
    todoItemsEJS: workTodoItems,
    buttonTypeEJS: "workToDo",
  });
});

app.get("/about", (req, res) => {
  res.render("about");
  // res.sendFile(path.join(__dirname, "public/about"));
});

app.post("/", (req, res) => {
  if (req.body.todoButton == "homeToDo") insertItems(req, res);
  else if (req.body.todoButton == "homeToDoRemove") removeItems(req, res);
  // console.log(req.body.todoItem);
  // var todoItem = req.body.todoItem;
  // if (req.body.todoButton == "workToDo") {

  //   res.redirect("/work");
  // } else if (req.body.todoButton == "homeToDo") {

  //   res.redirect("/");
  // }
});
app.post("/work", (req, res) => {
  console.log(req.body.workItem);
  var workItem = req.body.todoItem;
  workTodoItems.push(workItem);
  res.redirect("/work");
});
app.post("/remove", (req, res) => {
  homeTodoItems.pop();
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
