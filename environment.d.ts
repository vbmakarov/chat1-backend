declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number,
            ACCESS_SECRET_KEY: string | undefined,
            REFRESH_SECRET_KEY: string | undefined,
            SMTP_HOST: string,
            SMTP_PORT: number | undefined,
            ADMIN_MAIL: string,
            PASSWORD_MAIL: string,
            HOST: string,
            REDIRECT_URL: string
        }
    }
}

export { }
