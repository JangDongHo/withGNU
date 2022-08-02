import Restaurant from "../models/Restaurant";
import Users from "../models/Users";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const restaurants = await Restaurant.find({});
  return res.render("home", { pageTitle: "홈", restaurants });
};

export const search = async (req, res) => {
  const { campus, type } = req.query;
  let filter = {};
  if (campus) {
    filter["category.dong"] = campus;
  }
  if (type === "dessert") {
    filter["category.cate_1"] = "커피점/카페";
  }
  const restaurants = await Restaurant.find(filter);
  return res.render("restaurants/search", {
    pageTitle: "검색",
    restaurants,
  });
};

export const info = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id).populate({
    path: "comments",
    populate: { path: "owner" },
  });
  return res.render("restaurants/info", {
    pageTitle: restaurant.name,
    restaurant,
  });
};

export const createComment = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { commentRating, commentReview, commentImg },
    params: { id },
  } = req;
  try {
    const newComment = await Comment.create({
      text: commentReview,
      owner: _id,
      rating: commentRating,
      restaurant: id,
    });
    const user = await Users.findById(_id);
    user.comments.push(newComment._id);
    user.save();
    const restaurant = await Restaurant.findById(id);
    restaurant.comments.push(newComment._id);
    restaurant.save();
    return res.redirect(`/restaurants/${id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    return res.redirect("/");
  }
};
