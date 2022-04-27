import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dong: { type: String, required: true },
  category: {
    cate_1: { type: String },
    cate_2: { type: String },
    cate_3: { type: String },
  },
  doromyeong: { type: String, required: true },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
