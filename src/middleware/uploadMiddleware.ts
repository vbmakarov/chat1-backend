import multer, { FileFilterCallback } from 'multer'
import { baseDir } from '../config'
import path from 'path'


type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void


/****** Avatar Upload Settings******/
const storageAvatar = multer.diskStorage({
    destination: function (_: Express.Request, __: Express.Multer.File, cb: DestinationCallback) {
        cb(null, path.join(baseDir, 'upload/avatars'))
    },

    filename: function (_: Express.Request, file: Express.Multer.File, cb: FileNameCallback) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

function filterAvatar(_: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) {

    const fileExtensionTypes = ['.png', '.jpg', '.jpeg', '.svg']
    const currentFileExt = path.extname(file.originalname)

    if (fileExtensionTypes.indexOf(currentFileExt) === -1) {
        cb(null, false)
    } else {
        cb(null, true)
    }

}
/********\Avatar***********/


/*Files Upload Settings*/
const storageFiles = multer.diskStorage({
    destination: function (_: Express.Request, __: Express.Multer.File, cb: DestinationCallback) {
        cb(null, path.join(baseDir, 'upload/files'))
    },

    filename: function (_: Express.Request, file: Express.Multer.File, cb: FileNameCallback) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

function filterFiles(_: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) {

    const fileExtensionTypes = ['.png', '.jpg', '.jpeg', '.svg', '.pdf', '.xls', '.txt', '.docx', '.doc']
    const currentFileExt = path.extname(file.originalname)

    if (fileExtensionTypes.indexOf(currentFileExt) === -1) {
        cb(null, false)
    } else {
        cb(null, true)
    }

}
/******\Files***************/

export const uploadAvatar = multer({ storage: storageAvatar, fileFilter: filterAvatar, limits: { fileSize: 1024 * 1024 * 2 } }).single('avatar')
export const uploadFiles = multer({ storage: storageFiles, fileFilter: filterFiles, limits: { fileSize: 1024 * 1024 * 10 } }).array('files', 10)