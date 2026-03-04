import mongoose, { model, Schema } from "mongoose";
import { ROLES } from "../../constants/roles.js";
import { PROVIDER } from "../../constants/provider.js";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    profileImage: {
      type: String,
    },
    firstName: {
      type: String,
      required: function () {
        return !this.provider || this.provider === PROVIDER.system;
      },
    },
    lastName: {
      type: String,
      required: function () {
        return !this.provider || this.provider === PROVIDER.system;
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otpExpire: Date,
    password: {
      type: String,
      required: function () {
        return !this.provider || this.provider === PROVIDER.system;
      },
    },
    role: {
      type: Number,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    provider: {
      type: Number,
      enum: Object.values(PROVIDER),
      default: PROVIDER.system,
    },
    isActivate: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    profileVisitCount: {
      type: Number,
      default: 0,
    },
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
