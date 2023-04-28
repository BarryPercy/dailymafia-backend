import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { Model, Document, Types } from "mongoose";
import { UserDocument } from "../users/model";


export interface ActiveGameDocument extends Document {
    mafia: Types.ObjectId[] | UserDocument[];
    vigilante: Types.ObjectId | UserDocument;
    nerfedMedic: Types.ObjectId | UserDocument;
    vanillaTown: Types.ObjectId[] | UserDocument[];
    nightKills: {
      user: Types.ObjectId | UserDocument;
      night: number;
      killedBy: "Mafia" | "Vigilante";
    }[];
    medicSaves: {
      target: Types.ObjectId | UserDocument;
      night: number;
    }[];
    copResults: {
      target: Types.ObjectId | UserDocument;
      night: number;
    }[];
    rngs: number[];
    createdAt: Date;
    updatedAt: Date;
}

const { Schema, model } = mongoose

const activeGameSchema = new Schema(
    {
        mafia: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        vigilante: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        nerfedMedic: { type: Schema.Types.ObjectId, ref: 'User', required:true },
        vanillaTown: [{ type: Schema.Types.ObjectId, ref: 'User', required:true }],
        nightKills:[{
            user: { type: Types.ObjectId, ref: 'User', required:true },
            night: { type: Number, required: true },
            killedBy:{type: String, required:true, enum:["Mafia", "Vigilante"] }
          }],
        medicSaves:[{
            target:{type:Types.ObjectId,ref:'User', required:true},
            night: {type:Number, required:true}
        }],
        copResults:[{
            target:{type:Types.ObjectId,ref:'User', required:true},
            night:{type:Number, required:true}
        }],
        rngs:{type: [Number], required: true, enum:[0,1,2]}
    },
    { timestamps: true }
)

const ActiveGameModel=model<ActiveGameDocument>(
  "ActiveGame",
  activeGameSchema
);

export default ActiveGameModel
