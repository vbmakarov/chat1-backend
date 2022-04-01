import { NextFunction, Request, Response } from 'express'
import MessageService from '../database/service/MessageService'
import DialogController from '../controllers/DialogController'
import { IUserPayload, TypeMessage } from '../database'
import { io } from '../server'

interface IMessageCreate {
    dialog_id: string, author: string, text: string, user: IUserPayload, attachments: []
}

class MessageController {


    async updateReadStatusAll(dialogId: string, userId: string) {
        const updatResult = await MessageService.updateStatus(dialogId, userId)
        io.emit('UPDATE ALL MESSAGES', {
            dialogId,
            userId
        })
        return updatResult
    }

    async updateReadStatusOne(req: Request<{}, {}, { user: IUserPayload, messageId: string }>, res: Response, next: NextFunction) {
        try {
            const messageId = req.body.messageId
            const message = await MessageService.findMessage(messageId)
            if (message) {
                const dialog = await DialogController.findDialog(message.dialog_id.toString(), next)
                if (dialog && dialog.unreadMessages.length) {
                    dialog.unreadMessages = []
                    await dialog.save()
                }
            }
            if (message) {
                message.read = true
                await message.save()
                io.emit('UPDATE MESSAGE STATUS', {
                    newMessage: message
                })
                return res.status(200).json(message)
            }
        } catch (e) {
            console.log(e)
            next(e)
        }
    }


    fetch = async (req: Request<{ id: string }, {}, { user: IUserPayload }>, res: Response, next: NextFunction) => {
        try {
            const dialogId = req.params.id
            const userId = req.body.user._id
            const dialog = await DialogController.findDialog(dialogId, next)
            if (dialog) {
                const lastMessageData = await MessageService.findMessage(dialog.lastMessage?.toString())
                if (lastMessageData && dialog.unreadMessages.length && lastMessageData?.author.toString() !== userId) {
                    dialog.unreadMessages = []
                    await dialog.save()
                }
                await this.updateReadStatusAll(dialogId, userId)
                const messages = await MessageService.fetch(dialogId)
                if (!messages) {
                    //TODO unset in prod
                    console.log(messages, 'MessageController:fetch')
                    return res.status(404).json({
                        status: "error",
                        message: "No messages. DialogId is not found",
                    });
                }
                return res.status(200).json(messages)
            } else {
                console.log(132)
                return res.status(404).json({
                    status: "error",
                    message: "No messages. DialogId is not found",
                });
            }
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async create(req: Request<{}, {}, IMessageCreate>, res: Response, next: NextFunction) {
        try {
            const dialog_id = req.body.dialog_id
            const text = req.body.text
            const emoji = req.body.attachments
            const author = req.body.user._id
            console.log(dialog_id, 'dialog_id')
            console.log(author, 'author')
            if (dialog_id && author) {
                const dialog = await DialogController.findDialog(dialog_id, next)
                if (dialog) {
                    let newMessage = {} as TypeMessage
                    if (!emoji.length && text) {
                        newMessage = await MessageService.create(dialog_id, author, text)
                    } else if (emoji.length) {
                        newMessage = await MessageService.create(dialog_id, author, emoji[emoji.length - 1], emoji)
                    }
                    if (newMessage) {
                        dialog.lastMessage = newMessage
                        dialog.unreadMessages.push(newMessage._id as never)
                        await dialog.save()
                        io.emit('NEW MESSAGE', {
                            author: dialog.author,
                            partner: dialog.partner,
                            newMessage
                        })
                        return res.status(200).json(newMessage)
                    } else {
                        return res.status(400).json({
                            status: "error",
                            message: "Don't create message",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: "error",
                        message: "Don't create dialog. Dialog not found",
                    });
                }
            } else {
                return res.status(400).json({
                    status: "error",
                    message: "Don't create dialog. Check params",
                });
            }

        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async createFileMessage(req: Request<{}, {}, { dialog_id: string, text: string, author: string }>, res: Response, next: NextFunction) {
        try {
            if (req.files && req.files.length > 0) {
                const { dialog_id, text, author } = req.body
                let attachments: string[] = []
                if (Array.isArray(req.files)) {
                    req.files.forEach((file, _) => {
                        attachments.push(file.filename)
                    })
                }
                const dialog = await DialogController.findDialog(dialog_id, next)
                if (dialog && text && author && attachments.length) {
                    let newMessage = {} as TypeMessage
                    newMessage = await MessageService.create(dialog_id, author, text, attachments)
                    if (newMessage) {
                        dialog.lastMessage = newMessage
                        dialog.unreadMessages.push(newMessage._id as never)
                        await dialog.save()
                        io.emit('NEW MESSAGE', {
                            author: dialog.author,
                            partner: dialog.partner,
                            newMessage
                        })
                        return res.status(200).json(newMessage)
                    }
                } else {
                    return res.status(400).json({
                        status: "error",
                        message: "Don't create fileMessage. Dialog_id wrong!",
                    });
                }
            } else {
                return res.status(400).json({
                    status: "error",
                    message: "Don't create fileMessage. Check params",
                });
            }
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {

        try {
            const id = req.params.id
            const message = await MessageService.delete(id)
            if (!message) {
                //TODO unset in prod
                console.log(message, 'MessageController: delete')
                return res.status(404).json({
                    status: "error",
                    message: "Can't delete message. Message not found",
                });
            }

            return res.status(200).json(message)

        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async deleteMessagesByDialogId(dialogId: string, next: NextFunction) {
        try {
            return await MessageService.deleteMessagesByDialogId(dialogId)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}

export default new MessageController()