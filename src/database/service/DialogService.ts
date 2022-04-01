import { DialogModel } from '../models/DialogModel'
import { TypeDialog } from '../types/TypeDialog'

class DialogService {
    async fetch(id: string) {
        return await DialogModel.find<Promise<TypeDialog>>({ $or: [{ author: id }, { partner: id }] }).populate('partner', '-password').populate('author', '-password').populate('lastMessage')
    }
    async create(author_id: string, partner_id: string) {
        const dialog = await DialogModel.find({
            $or: [
                { $and: [{ author: partner_id }, { partner: author_id }] },
                { $and: [{ author: author_id }, { partner: partner_id }] }
            ]
        }).populate('partner', '-password').populate('author', '-password')



        if (dialog && dialog.length > 0) {
            return dialog[0]
        }
        const newDialog = await DialogModel.create({
            author: author_id,
            partner: partner_id,
        })

        return await this.fetchDialogById(newDialog._id)
    }

    // TODO: запроектировать удаление диалога вместе с сообщениями
    async delete(id: string) {
        return await DialogModel.deleteOne({ _id: id })
    }

    async findDialog(id: string) {
        return await DialogModel.findById(id)
    }

    async fetchDialogById(dialogId: string) {
        return await DialogModel.findById(dialogId).populate('partner', '-password').populate('author', '-password')
    }
}

export default new DialogService()