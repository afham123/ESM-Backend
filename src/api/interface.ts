import { Request, Router } from 'express';
import { User } from './user/user.interface';

export interface Controller {
    path: string;
    router: Router;
}

export interface RequestWithUser extends Request {
    user: User;
}