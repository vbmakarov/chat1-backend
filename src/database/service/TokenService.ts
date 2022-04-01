import jwt from 'jsonwebtoken'
import { TypeNormalizeData } from '../../database'
import TokenModel from '../models/TokenModel'
import { IUserPayload } from '../types/TypeUser'


class TokenService {

    generateToken(noramlizeData: TypeNormalizeData) {

        const accessToken = jwt.sign(noramlizeData, process.env.ACCESS_SECRET_KEY || "", { expiresIn: '4h' })
        const refreshToken = jwt.sign(noramlizeData, process.env.REFRESH_SECRET_KEY || "", { expiresIn: '30 days' })
        return {
            accessToken,
            refreshToken
        }

    }

    async saveToken(user_id: string, refreshToken: string) {

        const tokenData = await TokenModel.findOne({ user: user_id })

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const newTokenData = await TokenModel.create({
            user: user_id,
            refreshToken: refreshToken
        })

        return newTokenData

    }

    async deleteToken(refreshToken: string) {
        const token = await TokenModel.deleteOne({ refreshToken })
        return token
    }

    verifyAccessToken(accessToken: string): IUserPayload | void {
        return jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY || "", (err, payload) => {
            if (err) {
                return null
            }
            if (payload) {
                return payload
            }
        })
    }

    verifyRefreshToken(refreshToken: string): IUserPayload | void {
        return jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY || "", (err, payload) => {
            if (err) {
                return null
            }
            if (payload) {
                return payload
            }
        })
    }

    async findToken(refreshToken: string) {
        return await TokenModel.findOne({ refreshToken })
    }

}

export default new TokenService()