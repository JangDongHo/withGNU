import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  photoUrl: [{ type: String, default: "" }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users" },
  rating: { type: Number, default: "0" },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Restaurant",
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
