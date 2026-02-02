import { model, Schema, Types } from "mongoose";

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return val !== val.toUpperCase();
        },
        message: "Title must not be entirely uppercase",
      },
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Notes = model("Note", notesSchema);
