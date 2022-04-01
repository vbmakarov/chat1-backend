import { model, Schema } from 'mongoose'
import { TypeUser } from '../types/TypeUser'

const UserSchema: Schema = new Schema({
    //_id: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    city: { type: String },
    phone: { type: String },
    organization: { type: String },
    avatar: { type: String },
    activationLnk: { type: String },
    isActive: { type: Boolean, default: false },
    lastseen: { type: Date, default: Date.now },
})

const UserModel = model<TypeUser>('User', UserSchema);

export default UserModel