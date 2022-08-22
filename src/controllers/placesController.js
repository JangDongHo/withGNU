import Place from "../models/Place";
import Users from "../models/Users";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const places = await Place.find({});
  const tmp = [];
  places.forEach((place) => {
    tmp.push(...place.info.hashtags);
  });
  const hashtags = [...new Set(tmp)];
  return res.render("home", { pageTitle: "홈", hashtags });
};

export const search = async (req, res) => {
  const { search } = req.query;
  const places = await Place.find({
    $or: [
      { name: { $regex: new RegExp(search, "i") } },
      { "info.hashtags": { $regex: new RegExp(search, "i") } },
    ],
  })
    .sort("-meta.rating")
    .sort("-meta.likes");
  return res.render("places/search", {
    pageTitle: "검색",
    places,
  });
};

export const info = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id).populate({
    path: "comments",
    populate: { path: "owner" },
  });
  let scrapClicked = false;
  if (req.session.loggedIn) {
    const userId = req.session.user._id;
    const user = await Users.findById(userId);
    const likes = user.likes;
    scrapClicked = likes.includes(id);
  }
  place.meta.views += 1;
  await place.save();
  return res.render("places/info", {
    pageTitle: place.name,
    place,
    scrapClicked,
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
      place: id,
      photoUrl: filePaths,
    });
    const user = await Users.findById(_id);
    user.comments.push(newComment._id);
    user.save();
    const place = await Place.findById(id);
    place.comments.push(newComment._id);
    filePaths.forEach((filePath) => {
      place.photoUrl.push(filePath);
    });
    // 식당 평점 계산
    place.meta.rating = (
      (place.meta.rating + Number(commentRating)) /
      place.comments.length
    ).toFixed(1);
    place.save();
    return res.redirect(`/places/${id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    return res.redirect("/");
  }
};

export const placeScrap = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const user = await Users.findById(_id);
  const place = await Place.findById(id);
  let userScraps = user.likes;
  const index = userScraps.indexOf(id);
  if (index !== -1) {
    userScraps.splice(index, 1);
    Users.findByIdAndUpdate(_id, { $set: { likes: userScraps } });
    user.save();
    place.meta.likes -= 1;
    place.save();
    return res.status(200).json({ msg: "cancelScrap" });
  } else {
    user.likes.push(id);
    user.save();
    place.meta.likes += 1;
    place.save();
    return res.status(200).json({ msg: "addScrap" });
  }
};
