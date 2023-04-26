import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { Model, Document } from "mongoose";


export interface UserDocument extends Document {
  userName: string;
  avatar: string;
  discordId:string;
  role: "User" | "Admin" | "Regular" | "SuperAdmin";
}

const { Schema, model } = mongoose

const usersSchema = new Schema(
  {
    userName: { type: String, required: true },
    discordId: {type: String, required: true },
    avatar: { type: String, required:true },
    role: { type: String, required: true, enum: ["Admin", "User", "Regular", "SuperAdmin"], default: "User" }
  },
  { timestamps: true }
)

const UserModel=model<UserDocument>(
  "User",
  usersSchema
);

export default UserModel
