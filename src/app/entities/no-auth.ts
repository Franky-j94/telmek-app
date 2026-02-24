export enum NoAuth {
}

export interface SignInData {
    login: string;
    password: string;
}

export interface SignOutData {
    login: string;
}

export interface SessionData {
    access_token: string;
    login: string;
}

export interface GenericResponse<T> {
    data: T;
    status: number;
}