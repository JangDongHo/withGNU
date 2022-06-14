import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  naver_map_url: { type: String, default: "" },
  info: {
    campus: { type: String, default: "" },
    category: { type: String, default: "" },
    menu: { type: String, default: "" },
    location: { type: String, default: "" },
    contact: { type: String, default: "" },
    time: { type: String, default: "" },
  },
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
