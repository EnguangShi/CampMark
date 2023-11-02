const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary");

const imageSchema = new Schema({ url: String, filename: String });
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campgroundSchema = new Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (campground) {
  // console.log(campground);
  campground.images.forEach(async (img) => {
    console.log(img.filename);
    await cloudinary.uploader.destroy(img.filename);
  });
  if (campground.reviews.length) {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
