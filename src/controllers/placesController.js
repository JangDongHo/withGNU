import Place from "../models/Place";
import Users from "../models/Users";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const allPlaces = await Place.find({});
  const tmp = [];
  allPlaces.forEach((place) => {
    tmp.push(...place.info.hashtags);
  });
  const hashtags = [...new Set(tmp)];
  hashtags.sort(() => Math.random() - 0.5);
  let places = {};
  let maxcount = hashtags.length > 10 ? 10 : hashtags.length;
  for (let i = 0; i < maxcount; i++) {
    const place = await Place.find({
      "info.hashtags": { $regex: new RegExp(hashtags[i], "i") },
    })
      .sort("-meta.rating")
      .limit(4);
    places[hashtags[i]] = place;
  }
  return res.render("home", { pageTitle: "홈", places });
};

export const search = async (req, res) => {
  const { search } = req.query;
  try {
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
      search,
      places,
    });
  } catch (error) {
    req.flash("error", "검색어에 특수기호를 포함시킬 수 없습니다.");
    return res.redirect("/");
  }
};

export const info = async (req, res) => {
  const { id } = req.params;
  const mapId = process.env.MAPCLIENTID;
  try {
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
      mapId,
    });
  } catch (error) {
    return res.redirect("/");
  }
};

export const createComment = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { commentReview, commentRating },
    params: { id },
    files: { commentImg1, commentImg2, commentImg3 },
    fileValidationError,
  } = req;
  if (fileValidationError) {
    req.flash("error", fileValidationError);
    return res.redirect(`/places/${id}`);
  } else {
    const filePaths = [];
    console.log(commentImg1);
    const isHeroku = process.env.NODE_ENV === "production";
    if (commentImg1)
      filePaths.push(isHeroku ? commentImg1[0].location : commentImg1[0].path);
    if (commentImg2)
      filePaths.push(isHeroku ? commentImg2[0].location : commentImg2[0].path);
    if (commentImg3)
      filePaths.push(isHeroku ? commentImg3[0].location : commentImg3[0].path);
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
      req.flash("success", JSON.stringify("리뷰가 성공적으로 등록되었습니다."));
      return res.redirect(`/places/${id}`);
    } catch (error) {
      req.flash("error", JSON.stringify(error));
      return res.redirect("/");
    }
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
    rating = (
      (Number(comment.place.meta.rating) * person - Number(reviewRating)) /
      (person - 1)
    ).toFixed(1);
  }
  await Place.findByIdAndUpdate(
    placeId,
    {
      $pull: { comments: id.toString("hex") },
      "meta.rating": rating,
      $pullAll: { photoUrl: imagePaths },
    },
    { new: true }
  );
  await Users.findByIdAndUpdate(user._id, {
    $pull: { comments: id.toString("hex") },
  });
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(200);
};
