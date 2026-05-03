import { Schema, model, type Types } from "mongoose";

export interface RefreshTokenDoc {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    revokedAt: {
      type: Date,
      required: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const RefreshTokenModel = model<RefreshTokenDoc>(
  "RefreshToken",
  refreshTokenSchema
);
