import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  naver_map_url: { type: String, default: "" },
  info: {
    hashtags: [{ type: String, trim: true }],
    location: { type: String, default: "" },
    contact: { type: String, default: "" },
    time: { type: String, default: "" },
  },
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
    likes: { type: Number, default: 0, required: true },
  },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
  photoUrl: [{ type: String }],
});

placeSchema.static("formatHashtags", function (hashtags) {
  return hashtags.split(",");
});

const Place = mongoose.model("Place", placeSchema);
export default Place;
