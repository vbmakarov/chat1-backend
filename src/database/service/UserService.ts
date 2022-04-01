import { Model } from 'mongoose'
import { TypeUser } from '../types/TypeUser'
import UserModel from '../models/UserModel'
import TokenService from '../service/TokenService'
import { ApiError } from '../../controllers/ApiError'
import { noramlizeUserData } from '../../utils/normalize'
//import { TypeNormalizeData } from '../types/TypeUser'
import bcrypt from 'bcrypt'
import * as uuid from 'uuid';


class UserService {

    usersModel: Model<TypeUser>

    constructor(model: Model<TypeUser>) {
        this.usersModel = model
    }

    async registration(email: string, password: string, name: string, lastname: string) {
        const user = await this.usersModel.findOne({ email })
        if (user) {
            throw ApiError.BadRequest('Пользователь с таким именем уже сущеcтвует')
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activationLnk = uuid.v4()

        // сохраняем нового пользователя и возвращаем результат
        const userData: TypeUser = await this.usersModel.create({
            email: email,
            password: hashPassword,
            name,
            lastname,
            activationLnk
        })


        // возвращаем userData без пароля и лишних полей для полседующей генерации JWT токенов
        return noramlizeUserData(userData)
    }

    async login(email: string, password: string) {
        const user = await this.usersModel.findOne({ email })

        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не сущетсвует!')
        }

        // сравниваем пароли
        const result = await bcrypt.compare(password, user.password)

        if (!result) {
            throw ApiError.BadRequest('Вы ввели неверный пароль!')
        }

        return noramlizeUserData(user)
    }

    async logout(refreshToken: string) {
        const token = await TokenService.deleteToken(refreshToken)
        return token
    }

    async activateUser(activationLink: string) {
        const user = await this.usersModel.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка')
        }

        user.isActive = true
        const result = user.save()
        return result
    }

    async findUser(id: string) {
        return await this.usersModel.findOne({ _id: id });
    }

    async fetchLimitUsers(skip: number, limit: number) {
        return await this.usersModel.find({}, ['-password', '-activationLnk']).limit(limit).skip(skip)
    }

    async fetchAllUsers() {
        return await this.usersModel.find()
    }


}

export default new UserService(UserModel)