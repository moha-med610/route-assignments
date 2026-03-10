import mongoose, { Schema, model } from "mongoose";

const revokeTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jti: {
      type: String,
      required: true,
    },
    expireIn: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

revokeTokenSchema.index("expireIn", {
  expireAfterSeconds: 0,
});

export const RevokeToken =
  mongoose.models.RevokeToken || model("RevokeToken", revokeTokenSchema);
