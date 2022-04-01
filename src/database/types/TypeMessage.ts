import { TypeUser } from './TypeUser'
import { TypeDialog } from './TypeDialog'

export interface TypeMessage {
    _id: string,
    text: string,
    dialog_id: TypeDialog | string,
    author: TypeUser | string,
    read: boolean,
    attachments: []
}