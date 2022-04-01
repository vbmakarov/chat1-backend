import { TypeUser } from './TypeUser'
import { TypeMessage } from './TypeMessage'
import { Document } from 'mongoose'

export interface TypeDialog extends Document {
    _id: string,
    author: TypeUser | string,
    partner: TypeUser | string,
    unreadMessages: TypeMessage[] | [],
    lastMessage: TypeMessage | ''
}


export type TypeDialogData = {
    _id?: string
    author: string,
    partner: string
}