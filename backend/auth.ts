import { Request, Response } from 'express';
import { User, users } from './users';
import * as jwt from 'jsonwebtoken';
import { apiConfig } from './api-config';
// import * as db from '../db.json' // This import style requires "esModuleInterop", see "side notes"

export const handleAuthentication = (req: Request, resp: Response) => {
    const user: User = req.body;
    if (isValid(user)) {
        const dbUser = users.find((obj) => obj.email == user.email);
        const token = jwt.sign({ sub: dbUser.email, iss: 'api' }, apiConfig.secret);
        resp.json({ name: dbUser.name, email: dbUser.email, accessToken: token });
    } else {
        resp.status(403).json({ message: 'Dados inválidos.' });
    }
}

export const handleGet = (req: Request, resp: Response) => {
    resp.json({ users: users });
}

function isValid(user: User): boolean {
    if (!user) {
        return false;
    }
    const dbUser = users.find((obj) => obj.email == user.email && obj.password == user.password);
    return dbUser !== undefined;
}