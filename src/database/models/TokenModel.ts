import { Schema, model } from "mongoose";
import { TypeToken } from '../types/TypeToken'


const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String, required: true }
})


export default model<TypeToken>('Token', TokenSchema)
