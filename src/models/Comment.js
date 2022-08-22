import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  photoUrl: { type: Array },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users" },
  rating: { type: Number, default: "0" },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Place",
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
