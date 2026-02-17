import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otpExpire: Date,
    password: {
      type: String,
      required: true,
    },
    isActivate: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    strict: true,
    strictQuery: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
    validateBeforeSave: true,
  },
);

userSchema
  .virtual("userName")
  .set(function (val) {
    const [firstName, lastName] = val.split(" ");
    this.set("firstName", firstName);
    this.set("lastName", lastName);
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });
export const Users = mongoose.models.User || model("User", userSchema);
