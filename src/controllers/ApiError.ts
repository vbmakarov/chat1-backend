import { ValidationError } from 'express-validator'

export class ApiError extends Error {

    status: number
    errors: ValidationError[] | undefined

    constructor(status: number, message: string, errors?: ValidationError[]) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static BadRequest(message: string, errors?: ValidationError[]) {
        return new ApiError(400, message, errors)
    }

    static Unauthorized(message: string, errors?: ValidationError[]) {
        return new ApiError(401, message, errors)
    }

    static ServerError(message: string, errors?: ValidationError[]) {
        return new ApiError(500, message, errors)
    }

}
