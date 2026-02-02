import { Schema, model } from "mongoose";

const UsersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: [18, "Age must be between 18 and 60"],
      max: [60, "Age must be between 18 and 60"],
    },
  },
  {
    timestamps: true,
  },
);

export const Users = model("User", UsersSchema);
