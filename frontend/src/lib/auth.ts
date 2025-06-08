import { betterAuth } from "better-auth"
import { createPool } from "mysql2/promise"

export const auth = betterAuth({
    database: createPool({
        host: process.env.MARIADB_HOST,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE,
        port: Number(process.env.MARIADB_PORT),
        connectionLimit: 10,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            enabled: true,
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24, 
    },
    user: {
        additionalFields: {
            displayName: {
                type: "string"
            },
            avatar: {
                type: "string"
            },
            createdAt: {
                type: "date"
            },
            lastLoginAt: {
                type: "date"
            },
        },
    },
})