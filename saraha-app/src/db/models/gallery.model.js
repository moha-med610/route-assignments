import mongoose, { Schema } from "mongoose";

const gallerySchema = new Schema(
  {
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Gallery =
  mongoose.model.Gallery || mongoose.model("Gallery", gallerySchema);
