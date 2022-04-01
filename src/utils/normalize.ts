import { TypeUser, TypeNormalizeData } from "../database"


// удаляем password и лишние поля из объекта userData для генерации JWT токена
export const noramlizeUserData = (userData: TypeUser): TypeNormalizeData => {
    const { _id, email, activationLnk, name, lastname, avatar, lastseen, organization, phone } = userData

    return {
        _id,
        email,
        activationLnk,
        name,
        lastname,
        avatar,
        lastseen,
        organization,
        phone
    }

}