import Restaurant from "../models/Restaurant";
import Users from "../models/Users";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const places = await Restaurant.find({});
  const tmp = [];
  places.forEach((place) => {
    tmp.push(...place.info.hashtags);
  });
  const hashtags = [...new Set(tmp)];
  return res.render("home", { pageTitle: "홈", hashtags });
};

export const search = async (req, res) => {
  const { search } = req.query;
  const places = await Restaurant.find();
  return res.render("restaurants/search", {
    pageTitle: "검색",
    places,
  });
};

export const info = async (req, res) => {
  const { id } = req.params;
  const place = await Restaurant.findById(id).populate({
    path: "comments",
    populate: { path: "owner" },
  });
  place.meta.views += 1;
  await place.save();
  return res.render("restaurants/info", {
    pageTitle: place.name,
    place,
  });
};

export const createComment = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { commentReview, commentRating },
    params: { id },
    files: { commentImg },
  } = req;
  const filePaths = [];
  if (commentImg) {
    for (let i = 0; i < commentImg.length; i++) {
      filePaths.push(commentImg[i].path);
    }
  }
  try {
    const newComment = await Comment.create({
      text: commentReview,
      owner: _id,
      rating: commentRating,
      restaurant: id,
      photoUrl: filePaths,
    });
    const user = await Users.findById(_id);
    user.comments.push(newComment._id);
    user.save();
    const restaurant = await Restaurant.findById(id);
    restaurant.comments.push(newComment._id);
    filePaths.forEach((filePath) => {
      restaurant.photoUrl.push(filePath);
    });
    // 식당 평점 계산
    restaurant.meta.rating = (
      (restaurant.meta.rating + Number(commentRating)) /
      restaurant.comments.length
    ).toFixed(1);
    restaurant.save();
    return res.redirect(`/restaurants/${id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    return res.redirect("/");
  }
};
