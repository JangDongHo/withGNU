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
      (place.meta.rating * (Number(place.comments.length) - 1) +
        Number(commentRating)) /
      Number(place.comments.length)
    ).toFixed(1);
    place.save();
    return res.redirect(`/places/${id}`);
  } catch (error) {
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

export const editComment = async (req, res) => {
  const {
    body: { reviewText, oldReviewRating, newReviewRating },
    params: { id },
  } = req;
  try {
    const comment = await Comment.findById(id).populate("place");
    comment.text = reviewText;
    comment.rating = Number(newReviewRating);
    comment.save();
    const person = Number(comment.place.comments.length);
    comment.place.meta.rating = (
      (comment.place.meta.rating * person -
        Number(oldReviewRating) +
        Number(newReviewRating)) /
      person
    ).toFixed(1);
    comment.place.save();
  } catch (error) {
    console.log(error);
  }
  return res.status(200).json();
};

export const deleteComment = async (req, res) => {
  const {
    session: { user },
    params: { id },
    body: { reviewRating, imagePaths },
  } = req;
  const comment = await Comment.findById(id).populate("place");
  if (String(comment.owner) !== String(user._id)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
  }
  const placeId = comment.place.id;
  const person = Number(comment.place.comments.length);
  let rating = 0;
  if (person !== 1) {
    rating =
      (Number(comment.place.meta.rating) * person - Number(reviewRating)) /
      (person - 1);
  }
  console.log(rating);
  await Place.findByIdAndUpdate(
    placeId,
    {
      $pull: { comments: id.toString("hex") },
      meta: { rating },
      $pullAll: { photoUrl: imagePaths },
    },
    { new: true }
  );
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(200);
};
