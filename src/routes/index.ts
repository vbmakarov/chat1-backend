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
router.get('/activation/:link', jsonParser, UserController.activateUser)
router.get('/users', [jsonParser, authMiddleware], UserController.getUsers)
router.get('/refresh', jsonParser, UserController.refresh)

//user
router.post('/registration',
    jsonParser,
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    UserController.registration
)
router.post('/login', jsonParser, UserController.login)
router.post('/logout', jsonParser, UserController.logout)
router.post('/update', [jsonParser, authMiddleware], UserController.updateUserData)


//Dialogs
router.post('/dialogs', [jsonParser, authMiddleware], DialogController.create)
router.get('/dialogs', [jsonParser, authMiddleware], DialogController.fetch)
router.post('/dialog', [jsonParser, authMiddleware], DialogController.fetchDialogById)
router.delete('/dialogs/:id', [jsonParser, authMiddleware], DialogController.delete)


//Messages
router.get('/dialogs/:id', [jsonParser, authMiddleware], MessageController.fetch)
router.post('/message/update', [jsonParser, authMiddleware], MessageController.updateReadStatusOne)
router.post('/message', [jsonParser, authMiddleware], MessageController.create)
router.post('/message/files', [jsonParser, authMiddleware, uploadFiles], MessageController.createFileMessage)
router.delete('/message/:id', [jsonParser, authMiddleware], MessageController.delete)


//File
router.get('/upload/file/:filename', [jsonParser, authMiddleware], FileController.downloadFile)
router.post('/avatar', [jsonParser, authMiddleware, uploadAvatar], UserController.setAvatar)

/*router.post('/avatar', function (req, res) {
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



