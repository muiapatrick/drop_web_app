import { User } from './user';

export interface Token {
    refresh_token: string;
    access_token: string;
    user: User;
}
