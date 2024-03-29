import bcrypt from "bcrypt";
import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Place",
    },
  ],
  avatarUrl: { type: String, default: "" },
  role: { type: String, default: "member" },
});

usersSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const Users = mongoose.model("Users", usersSchema);
export default Users;
