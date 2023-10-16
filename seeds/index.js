const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/CampMark")
  .then(console.log("Database connected"))
  .catch((err) => {
    console.log("Connection error:");
    console.log(err);
  });

// return a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// seeding: create a few campground samples
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};

// close the database after seeding
seedDB().then(() => {
  mongoose.connection.close();
});
