import { Request, Response, NextFunction } from 'express'

export function errorMiddleware(err: any, _: Request, res: Response, __: NextFunction) {
    if (err.status !== 500 && err.status !== undefined) {
        return res.status(err.status).json({ message: err.message, error: err.errors })
    }

    return res.status(500).json({ message: 'Ошибка сервера' })
}