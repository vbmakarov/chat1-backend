import express from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from './ApiError'
import { UserService, TokenService, TypeUser } from '../database'
//import MailSevice from '../database/service/MailSevice'
import { noramlizeUserData } from '../utils/normalize'

class UserController {

    async registration(req: express.Request<TypeUser>, res: express.Response, next: express.NextFunction) {

        try {
            // разворачиваем объект req.body на отдельные параметры
            const { email, password, name, lastname }: TypeUser = req.body

            //проверяем на ошибки при валидации email и password
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest('Ошибка валидации', errors.array())
            }
            const noramlizeUserData = await UserService.registration(email, password, name, lastname)
            const tokens = TokenService.generateToken(noramlizeUserData)
            await TokenService.saveToken(noramlizeUserData._id, tokens.refreshToken)

            //отправляем почту зарегистрированному пользователю
            //await MailSevice.sendMail(noramlizeUserData.email, noramlizeUserData.activationLnk)
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(200).json({
                ...tokens,
                user: noramlizeUserData
            })

        } catch (e) {
            console.log(e)
            next(e)
        }

    }

    async login(req: express.Request<TypeUser>, res: express.Response, next: express.NextFunction) {

        try {
            const { email, password } = req.body
            const noramlizeUserData = await UserService.login(email, password)
            const tokens = TokenService.generateToken(noramlizeUserData)
            await TokenService.saveToken(noramlizeUserData._id, tokens.refreshToken)
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(200).json({
                ...tokens,
                user: noramlizeUserData
            })

        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async logout(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { refreshToken } = req.cookies
            const result = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken');
            return res.status(200).json({
                ...result
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async updateUserData(req: express.Request<{}, {}, TypeUser>, res: express.Response, next: express.NextFunction) {
        try {
            const { name, lastname, email, phone, organization, _id } = req.body
            const user = await UserService.findUser(_id)
            if (user) {
                user.name = name
                user.lastname = lastname
                user.email = email
                user.phone = phone
                user.organization = organization
                await user.save()
                const userData = noramlizeUserData(user)
                const tokens = TokenService.generateToken(userData)
                await TokenService.saveToken(userData._id, tokens.refreshToken)
                res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                return res.status(200).json({
                    ...tokens,
                    user: userData
                })
            }
            return res.status(401).json('No user data. Bad request')
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async activateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const activationLink = req.params.link
            await UserService.activateUser(activationLink)
            res.redirect(301, String(process.env.REDIRECT_URL));
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async refresh(req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log('refresh')
        try {

            // получаем refreshToken из cookie
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                throw ApiError.Unauthorized('refreshToken не найден')
            }

            // проверяем токен на валидность
            const tokenData = TokenService.verifyRefreshToken(refreshToken)

            if (!tokenData) {
                throw ApiError.Unauthorized('Токен не валидный')
            }

            // ищем token в базе данных
            const token = await TokenService.findToken(refreshToken)

            if (!token) {
                throw ApiError.Unauthorized('Токен отсутствует в базе данных')
            }

            const user: TypeUser | null = await UserService.findUser(tokenData._id)

            if (!user) {
                throw ApiError.Unauthorized('Пользователь с данным токеном не найден')

            }

            // удаляем старый токен из базы
            await TokenService.deleteToken(refreshToken)

            // преобразуем данные о пользователе в объект пригодный для JWT (удаляем поле password)
            const normUserData = noramlizeUserData(user)

            // генерируем пару новых токенов
            const tokens = TokenService.generateToken(normUserData)

            // сохраняем новый токен базу данных
            await TokenService.saveToken(normUserData._id, tokens.refreshToken)
            res.clearCookie('refreshToken');
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(200).json({
                ...tokens,
                user: normUserData
            })

        } catch (e) {
            console.log(e)
            next(e)
        }


    }

    async getUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const limit: number = 100
            let page = req.query.page || 1

            if (page === 'all') {
                const allUsers = await UserService.fetchAllUsers()
                return res.status(200).json(allUsers)
            }

            if (!page || isNaN(+page) || typeof +page === 'string') {
                page = 1
            }

            const skip: number = (+page - 1) * limit

            const users = await UserService.fetchLimitUsers(skip, limit)
            return res.status(200).json(users)

        } catch (e) {
            console.log(e)
            next(e)
        }
    }


    async setAvatar(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const userData = TokenService.verifyRefreshToken(req.cookies.refreshToken)
            if (userData) {
                const user = await UserService.findUser(userData._id)
                if (user) {
                    user.avatar = req.file?.filename
                    await user.save()
                    return res.status(200).json(noramlizeUserData(user))
                } else {
                    return res.status(404).json({
                        status: "error",
                        message: "Dialog not found",
                    });
                }
            }

        } catch (e) {
            console.log(e)
            next(e)
        }
    }

}


export default new UserController()