const prompt = require("prompt-sync")();
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const Customer = require("./models/customer");

// CRUD Functions

// CREATE (C) Function
const create = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const custName = prompt("Enter Customer Name: ");
  const custAge = Number(prompt("Enter Customer Age: "));
  const custData = {
    name: custName,
    age: custAge,
  };
  const createCust = await Customer.create(custData);
  await mongoose.disconnect();
  console.log(`The following Customer has been created: `, createCust);
};

// READ (R) Function
const findAll = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const customers = await Customer.find({});
  await mongoose.disconnect();
  console.log(`Below is a list of customers:\n`);
  customers.forEach((cust) => {
    console.log(`id: ${cust.id} --  Name: ${cust.name}, Age: ${cust.age}`);
  });
};

// UPDATE (U) Function
const update = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Below is a list of customers:\n\n`);
  const customers = await Customer.find({});
  customers.forEach((cust) => {
    console.log(`id: ${cust.id} --  Name: ${cust.name}, Age: ${cust.age}`);
  });
  const custId = prompt(
    `Copy and paste the ID of the customer you would like to update here: `
  );
  const custName = prompt(`What is the customer's new name: `);
  const custAge = Number(prompt(`What is the customer's new age: `));

  const updatedCust = await Customer.findByIdAndUpdate(
    custId,
    { name: custName, age: custAge },
    { new: true }
  );
  await mongoose.disconnect();
  console.log(`Updated Customer Details: `, updatedCust);
};

// DELETE (D) Function
const destroy = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Below is a list of customers:\n`);
  const customers = await Customer.find({});
  customers.forEach((cust) => {
    console.log(`id: ${cust.id} --  Name: ${cust.name}, Age: ${cust.age}`);
  });
  const custId = prompt(
    `Copy and paste the ID of the customer you would like to delete here: `
  );
  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(custId)) {
    console.log(`Invalid Customer ID format.`);
    await mongoose.disconnect();
    return;
  }
  const removedCust = await Customer.findByIdAndDelete(custId);
  await mongoose.disconnect();
  if (!removedCust) {
    console.log(`No customer found with the provided ID.`);
  } else {
    console.log(`Removed Customer Details: `, removedCust);
  }
};

console.log(`Welcome to CRM\n`);

let running = true;

(async () => {
  while (running) {
    console.log(
      `What would you like to do?\n\n1. Create a Customer\n2. View All Customers\n3. Update A Customer\n4. Delete A Customer\n5. Quit\n`
    );
    let actionInput = prompt("Action to run: ");
    let action = Number(actionInput);
    if (isNaN(action) || action < 1 || action > 5) {
      console.log("Invalid option. Please enter a number between 1 and 5.");
      continue;
    }

    switch (action) {
      case 1:
        await create();
        break;
      case 2:
        await findAll();
        break;
      case 3:
        await update();
        break;
      case 4:
        await destroy();
        break;
      case 5:
        running = false;
        console.log("Goodbye!");
        mongoose.disconnect();
        break;
    }
  }
})();
