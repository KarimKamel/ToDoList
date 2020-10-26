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
const e = require("express");

mongoose.connect("mongodb://localhost/todoListDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

const ItemSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("Item", ItemSchema, "items");

const CollectionSchema = new mongoose.Schema({
  collectionName: String,
  collectionItems: [ItemSchema],
});
const Collection = mongoose.model("Collection", CollectionSchema);

var currentRoute = "";
var item1 = new Item({ name: "get food" });
var item2 = new Item({ name: "cook food" });
var item3 = new Item({ name: "eat food" });
const defaultItems = [item1, item2, item3];

var dateOptions = { weekday: "long" };
var today = new Date();
var dayOfWeek = today.toLocaleDateString("en-US", dateOptions);

app.get("/:customRoute", (req, res) => {
  var customRoute = req.params.customRoute;
  var collection = new Collection({
    collectionName: customRoute,
    collectionItems: defaultItems,
  });
  console.log(collection);
  Collection.findOne({ collectionName: customRoute }, (err, docsFound) => {
    if (err) console.log(err);
    else if (docsFound) {
      console.log("list found");
      res.render("list", {
        listTitle:
          "today is " +
          dateUtil.getDay() +
          ".This is your " +
          docsFound.collectionName +
          " to-do list",
        // title:"to do list",
        newListItems: docsFound.collectionItems,
        collectionName: docsFound.collectionName,
      });
    } else {
      collection.save((err, doc) => {
        console.log("saving ", doc);
        res.redirect("/" + doc.collectionName);
      });
    }
  });
});
//   var itemList = Item.find((err, docsFound) => {
//     if (err) console.log(err);
//     else {
//       res.render("index", {
//         title:
//           "today is " +
//           dateUtil.getDay() +
//           ".This is your " +
//           collectionName +
//           " to-do list",
//         // title:"to do list",
//         todoItemsEJS: docsFound,
//         buttonTypeEJS: "homeToDo",
//       });
//     }
//   });
// });
app.get("/", function (req, res) {
  // getItems(res);
  var d = new Date();
  var n = d.getDay();
  var itemList = Item.find((err, docsFound) => {
    if (err) console.log(err);
    else {
      if (docsFound.length == 0) {
        Item.insertMany(defaultItems, (err, docsInserted) => {
          if (err) console.log(err);
          else {
            docsFound = docsInserted;
            res.render("index", {
              title:
                "today is " +
                dateUtil.getDay() +
                ".This is your " +
                Item.modelName +
                " to-do list",
              // title:"to do list",
              todoItemsEJS: docsFound,
              buttonTypeEJS: "homeToDo",
            });
          }
        });
      } else {
        res.render("index", {
          title:
            "today is " +
            dateUtil.getDay() +
            ".This is your " +
            Item.modelName +
            " to-do list",
          // title:"to do list",
          todoItemsEJS: docsFound,
          buttonTypeEJS: "homeToDo",
        });
      }
    }
  });
});

// var items = Item.find().then(function (doc) {
//   var itemList = doc.map(item => {
//     return item.name;
//   });

// res.render("index", {
//   title: "today is " + dateUtil.getDay() + ".This is your Home to-do list",
//   // title:"to do list",
//   todoItemsEJS: itemList,
//   buttonTypeEJS: "homeToDo",
// });

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

app.post("/:customRoute", (req, res) => {
  var collectionName = req.params.customRoute;
  var receivedItem = req.body.newItem;
  // var collection;
  // if (req.body.todoButton == "homeToDo")
  insertItemsCustom(req, res, collectionName);
  // else if (req.body.todoButtonRemove == "homeToDo") removeItems(req, res);
  // console.log(req.body.todoItem);
  // var todoItem = req.body.todoItem;
  // if (req.body.todoButton == "workToDo") {

  //   res.redirect("/work");
  // } else if (req.body.todoButton == "homeToDo") {

  //   res.redirect("/");
  // }
});
app.post("/", (req, res) => {
  if (req.body.todoButton == "homeToDo") insertItems(req, res);
  else if (req.body.todoButtonRemove == "homeToDo") removeItems(req, res);
  // console.log(req.body.todoItem);
  // var todoItem = req.body.todoItem;
  // if (req.body.todoButton == "workToDo") {

  //   res.redirect("/work");
  // } else if (req.body.todoButton == "homeToDo") {

  //   res.redirect("/");
  // }
});
function removeItems(req, res) {
  console.log(req);
  var itemIds = req.body.delCheckBox;
  Item.deleteMany({ _id: itemIds }, err => {
    if (err) console.log(err);
    else res.redirect("/");
  });
}
function insertItems(req, res) {
  var item = req.body.todoItem;
  var collectionItem = new Item({ name: item });
  collectionItem.save((err, doc) => {
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
}
function insertItems(req, res) {
  var item = req.body.todoItem;
  var collectionItem = new Item({ name: item });
  collectionItem.save((err, doc) => {
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
}
function insertItemsCustom(req, res, listName) {
  var item = req.body.newItem;
  var collectionItem = new Item({ name: item });
  Collection.findOneAndUpdate(
    { collectionName: listName },
    { $push: { collectionItems: collectionItem } },
    (err, docs) => {
      if (!err) console.log(docs);
      res.redirect("/" + listName);
    }
  );
  // collectionItem.save((err, doc) => {
  //   if (err) console.log(err);
  //   else {
  //     res.redirect("/" + listName);
  //   }
  // });
}
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
