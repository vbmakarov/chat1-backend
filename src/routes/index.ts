import express from 'express'
import { body } from 'express-validator'
import bodyParser from 'body-parser'
import UserController from '../controllers/UserController'
import DialogController from '../controllers/DialogController'
import MessageController from '../controllers/MessageController'
import FileController from '../controllers/FileController'
import { authMiddleware } from '../middleware/authMiddleware'
import { uploadAvatar, uploadFiles } from '../middleware/uploadMiddleware'

const jsonParser = bodyParser.json()
const router = express.Router();


//GET
router.get('/', authMiddleware, (req: express.Request, res: express.Response) => {
    res.status(200).json({
        ...req.body.user
    })
})
router.get('/api/activation/:link', jsonParser, UserController.activateUser)
router.get('/api/users', [jsonParser, authMiddleware], UserController.getUsers)
router.get('/api/refresh', jsonParser, UserController.refresh)

//user
router.post('/api/registration',
    jsonParser,
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    UserController.registration
)
router.post('/api/login', jsonParser, UserController.login)
router.post('/api/logout', jsonParser, UserController.logout)
router.post('/api/update', [jsonParser, authMiddleware], UserController.updateUserData)


//Dialogs
router.post('/api/dialogs', [jsonParser, authMiddleware], DialogController.create)
router.get('/api/dialogs', [jsonParser, authMiddleware], DialogController.fetch)
router.post('/api/dialog', [jsonParser, authMiddleware], DialogController.fetchDialogById)
router.delete('/api/dialogs/:id', [jsonParser, authMiddleware], DialogController.delete)


//Messages
router.get('/api/dialogs/:id', [jsonParser, authMiddleware], MessageController.fetch)
router.post('/api/message/update', [jsonParser, authMiddleware], MessageController.updateReadStatusOne)
router.post('/api/message', [jsonParser, authMiddleware], MessageController.create)
router.post('/api/message/files', [jsonParser, authMiddleware, uploadFiles], MessageController.createFileMessage)
router.delete('/api/message/:id', [jsonParser, authMiddleware], MessageController.delete)


//File
router.get('/api/upload/file/:filename', [jsonParser, authMiddleware], FileController.downloadFile)
router.post('/api/avatar', [jsonParser, authMiddleware, uploadAvatar], UserController.setAvatar)

/*router.post('/api/avatar', function (req, res) {
    uploadAvatar(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
        } else {
            console.log(err)
        }
        // Все прекрасно загрузилось.
    })
})*/


export default router



