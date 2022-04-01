import { MessageModel } from '../models/MessageModel'
import { TypeMessage } from '../types/TypeMessage'

class MessageService {
    async fetch(id: string): Promise<TypeMessage[]> {
        return await MessageModel.find({ dialog_id: id })
    }
    async create(dialog_id: string, author: string, text: string, attachments?: string[] | []): Promise<TypeMessage> {
        const newMessage = await MessageModel.create({
            author,
            dialog_id,
            text,
            attachments,
            read: false
        })

        //return await newMessage.populate(['author', 'dialog_id'])
        return newMessage
    }

    // TODO: запроектировать удаление диалога вместе с сообщениями
    async delete(id: string) {
        return await MessageModel.deleteOne({ _id: id })
    }

    async deleteMessagesByDialogId(dialogId: string) {
        return await MessageModel.deleteMany({ dialog_id: dialogId })
    }

    async updateStatus(dialogId: string, userId: string) {
        return await MessageModel.updateMany({ dialog_id: dialogId, author: { $ne: userId } },
            { $set: { read: true } })
    }

    async updateStatusOne(messageId: string) {
        /*return await MessageModel.updateMany({ _id: messageId },
            { $set: { read: true } })*/

        return await MessageModel.findOneAndUpdate({ _id: messageId }, { $set: { read: true } })
    }

    async findMessage(messageId: string) {
        return await MessageModel.findById(messageId)
    }
}

export default new MessageService()