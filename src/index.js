const express = require("express");
const mongoose = require("mongoose");
const route = require("./route/route");
const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://harsh-developer:aA12345678@cluster0.lxbes.mongodb.net/customerDiscountApp?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )

  .then(() => console.log("MongoDb is connected..."))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
