import { Schema, model } from "mongoose";

export type UserRole = "user" | "admin";

export interface UserDoc {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true
    },
    avatarUrl: {
      type: String,
      required: false
    },
    lastLoginAt: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = model<UserDoc>("User", userSchema);
