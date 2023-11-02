const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
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
  await Review.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      author: "653ee4d400413f934482d6d5",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dikzo7peu/image/upload/v1698732035/CampMark/kedc4tbqlfvd3dl2tnkc.png",
          filename: "CampMark/kedc4tbqlfvd3dl2tnkc",
        },
        {
          url: "https://res.cloudinary.com/dikzo7peu/image/upload/v1698732036/CampMark/kcpo4t5epvzpnekzrd4d.png",
          filename: "CampMark/kcpo4t5epvzpnekzrd4d",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima eos perferendis quod quam eius esse velit! Eum maxime excepturi itaque incidunt dolorum architecto laborum voluptatem magni cupiditate quisquam, suscipit minima.",
      price,
    });
    await camp.save();
  }
};

// close the database after seeding
seedDB().then(() => {
  mongoose.connection.close();
});
