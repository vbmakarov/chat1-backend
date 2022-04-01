export interface TypeUser {
    _id: string,
    email: string,
    password: string,
    name: string,
    lastname: string,
    city?: string,
    phone?: string,
    organization?: string,
    avatar?: string,
    activationLnk: string,
    isActive?: boolean,
    lastseen?: Date,
}

export interface TypeNormalizeData {
    _id: string,
    email: string,
    activationLnk: string,
    name?: string,
    lastname?: string,
    avatar?: string,
    lastseen?: Date,
    phone?: string,
    organization?: string,
}

export interface IUserPayload {
    _id: string,
    email: string,
    activationLnk?: string,
    iat?: number,
    exp?: number
}