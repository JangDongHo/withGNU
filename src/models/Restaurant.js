import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  naver_map_url: { type: String, default: "" },
  category: {
    dong: { type: String },
    cate_1: { type: String },
    cate_2: { type: String },
  },
  info: {
    main_photo_url: { type: String },
    location: { type: String },
    contact: { type: String },
    opening_hours: { type: String },
  },
  meta: {
    naver_star_point: { type: Number, default: 0 },
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
