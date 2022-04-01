import { model, Schema } from 'mongoose'
import { TypeDialog } from '../types/TypeDialog'

const DialogSchema = new Schema(
    {
        partner: { type: Schema.Types.ObjectId, ref: "User" },
        author: { type: Schema.Types.ObjectId, ref: "User" },
        lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
        unreadMessages: {
            type: [{ type: Schema.Types.ObjectId, ref: "Message" }],
        }
    },
    {
        timestamps: true
    }

)


export const DialogModel = model<TypeDialog>('Dialog', DialogSchema)