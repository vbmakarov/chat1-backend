import { Request, Response, NextFunction } from 'express'
import DialogService from '../database/service/DialogService'
import MessageService from '../database/service/MessageService'
import { TypeDialogData, IUserPayload } from '../database'

class DialogController {

    async fetch(req: Request, res: Response, next: NextFunction) {
        try {
            const { _id } = req.body.user
            const dialogs = await DialogService.fetch(_id)
            if (!dialogs) {
                return res.status(404).json({
                    status: "error",
                    message: "Dialogs not found",
                });
            }
            return res.status(200).json(dialogs)
        } catch (e) {
            next(e)
        }
    }

    async create(req: Request<TypeDialogData>, res: Response, next: NextFunction) {
        try {
            const { author, partner } = req.body
            const dialog = await DialogService.create(author, partner)
            return res.status(200).json(dialog)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        try {
            const dialogId = req.params.id
            const removeMessages = await MessageService.deleteMessagesByDialogId(dialogId)
            const removeDialogs = await DialogService.delete(dialogId)
            //вернет 1 при удачном завершении операции либо 0 если такой записи нет 
            console.log(removeMessages, 'removeMessages')
            console.log(removeDialogs, 'removeDialogs')
            return res.status(200).json({
                removeMessages: removeMessages.deletedCount,
                removeDialogs: removeDialogs.deletedCount
            })
        } catch (e) {
            next(e)
        }
    }

    async findDialog(id: string, next: NextFunction) {
        try {
            return await DialogService.findDialog(id)
        } catch (e) {
            next(e)
        }
    }

    async fetchDialogById(req: Request<{}, {}, { user: IUserPayload, dialogId: string }>, res: Response, next: NextFunction) {
        try {
            const dialogId = req.body.dialogId
            const dialog = await DialogService.fetchDialogById(dialogId)
            return res.status(200).json(dialog)
        } catch (e) {
            next(e)
        }
    }
}

export default new DialogController()