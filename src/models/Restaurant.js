import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  naver_map_url: { type: String, default: "" },
  category: {
    dong: { type: String, default: "" },
    cate_1: { type: String, default: "" },
    cate_2: { type: String, default: "" },
  },
  info: {
    main_photo_url: { type: String, default: "" },
    location: { type: String, default: "" },
    contact: { type: String, default: "" },
    opening_hours: { type: String, default: "" },
  },
  meta: {
    naver_star_point: { type: Number, default: 0 },
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
