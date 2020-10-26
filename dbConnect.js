const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/todoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected");
  const ItemSchema = new mongoose.Schema({
    name: String,
  });
  const Item = mongoose.model("Item", ItemSchema, "items");
  const items = [
    { name: "get food" },
    { name: "cook food" },
    { name: "eat food" },
  ];
  Item.insertMany(items, function (error, docs) {
    if (error) {
      console.log(error);
    } else {
      console.log(docs);
    }
  });
});
