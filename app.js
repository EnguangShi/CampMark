const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require("./schemas");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const Review = require("./models/review");

mongoose
  .connect("mongodb://127.0.0.1:27017/CampMark")
  .then(console.log("Database connected"))
  .catch((err) => {
    console.log("Connection error:");
    console.log(err);
  });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ exteneded: true }));
app.use(methodOverride("_method"));

const validateSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

// CAMPGROUND ROUTES

// show all campgrounds
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// show the form for creating a campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// create a new campground
app.post(
  "/campgrounds",
  validateSchema(campgroundSchema),
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// show one campground
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
  })
);

// show the form for updating a campground
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

// update a campground
app.put(
  "/campgrounds/:id",
  validateSchema(campgroundSchema),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// delete a campground
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// REVIEW ROUTES

app.post(
  "/campgrounds/:id/reviews",
  validateSchema(reviewSchema),
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

// if a route doesn't match all the route handlers above, send '404 Not Found'
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
