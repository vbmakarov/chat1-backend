import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../controllers/ApiError'
import UserService from '../database/service/UserService'
import { TokenService } from '../database'


// проверяем accessToken на валидность
export const authMiddleware = async (req: Request, _: Response, next: NextFunction) => {

    try {

        if (!req.headers.authorization) {
            throw ApiError.Unauthorized('Пользователь не авторизован1')
        }

        const accessToken = req.headers.authorization?.split(' ')[1]
        if (!accessToken) {
            throw ApiError.Unauthorized('Пользователь не авторизован2')
        }

        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            throw ApiError.Unauthorized('Пользователь не авторизован3')
        }

        const userData = TokenService.verifyAccessToken(accessToken)

        if (!userData) {
            throw ApiError.Unauthorized('Пользователь не авторизован4')
        }
        const user = await UserService.findUser(userData._id)
        if (user) {
            user.lastseen = new Date()
            await user.save()
        }
        req.body.user = userData
        next();

    } catch (e) {
        console.log(e)
        next(e)
    }
}
