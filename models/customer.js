const mongoose = require("mongoose"); // Import Mongoose

const { model, Schema } = mongoose;

const customerSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const Customer = model("Customer", customerSchema);

module.exports = Customer;
