import mongoose from 'mongoose'
import config from '../config/config'
import { ApiError } from '../controllers/ApiError'

async function connect() {
    try {
        await mongoose.connect(config.mongoDB);
    } catch (e) {
        throw ApiError.ServerError('Не удалось подключиться к базе данных')
    }
}

connect()
