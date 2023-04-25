import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { Model, Document } from "mongoose";


export interface UserDocument extends Document {
  userName: string;
  password: string;
  avatar: string;
  discordId:string;
  role: "User" | "Admin" | "Regular" | "SuperAdmin";
}

interface UserModelInterface extends Model<UserDocument> {
  checkCredentials(
    email: string,
    plainPW: string
  ): Promise<UserDocument | null>;
}


const { Schema, model } = mongoose

const usersSchema = new Schema(
  {
    userName: { type: String, required: true },
    discordId: {type: String, required: true },
    avatar: { type: String },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["Admin", "User", "Regular", "SuperAdmin"], default: "User" }
  },
  { timestamps: true }
)

usersSchema.pre("save", async function () {

  const newUserData = this 
  if (newUserData.isModified("password")) {
    const plainPW = newUserData.password
    const hash = await bcrypt.hash(plainPW, 11)
    newUserData.password = hash
  }
})

usersSchema.methods.toJSON = function () {
  const currentUserDocument = this
  const currentUser = currentUserDocument.toObject()
  delete currentUser.password
  delete currentUser.createdAt
  delete currentUser.updatedAt
  delete currentUser.__v
  return currentUser
}

usersSchema.static("checkCredentials", async function (userName, plainPW) {
  const user = await this.findOne({ userName })
  if (user) {
    const passwordMatch = await bcrypt.compare(plainPW, user.password)
    if (passwordMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
})

const UserModel: UserModelInterface = model<UserDocument, UserModelInterface>(
  "User",
  usersSchema
);

export default UserModel
