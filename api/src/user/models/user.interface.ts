

export interface user{

    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;

}

export enum UserRole {

    ADMIN='admin',
    CHIFEDITOR='chifeditor',
    EDITOR='editor',
    USER='user'
}