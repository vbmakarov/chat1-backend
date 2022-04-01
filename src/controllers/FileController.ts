import { baseDir } from '../config'
import express from 'express'

class FileController {
    downloadFile(req: express.Request<{ filename: string }>, res: express.Response) {
        const { filename } = req.params
        const file = baseDir + '/upload/files/' + filename
        res.download(file)
    }
}

export default new FileController()