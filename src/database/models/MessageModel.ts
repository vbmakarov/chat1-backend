import { model, Schema } from 'mongoose'
import { TypeMessage } from '../types/TypeMessage'

const MessageSchema = new Schema(
    {
        text: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User" },
        dialog_id: { type: Schema.Types.ObjectId, ref: 'Dialog' },
        read: { type: Boolean, required: true },
        attachments: []
    },
    {
        timestamps: true
    }
)

export const MessageModel = model<TypeMessage>('Message', MessageSchema)