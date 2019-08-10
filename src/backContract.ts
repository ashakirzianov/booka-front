import { BookObject } from './common/bookFormat';

export type AuthToken = {
    token: string,
};

export type BookInfo = {
    id: string,
    title: string,
    author?: string,
};

export type BookCollection = {
    books: BookInfo[],
};

export type UserInfo = {
    name: string,
    pictureUrl?: string,
};

export type UserBooks = BookCollection;

export type BackContract = {
    '/auth/fbtoken': {
        get: {
            return: AuthToken,
            query: { token: string },
        },
    },
    '/me/info': { get: { return: UserInfo, auth: string } },
    '/me/books': { get: { return: UserBooks, auth: string } },
    '/book/single': {
        get: {
            return: BookObject,
            query: { id: string },
        },
    },
    '/book/all': { get: { return: BookCollection } },
    '/book/upload': {
        post: {
            return: string,
            files: 'book',
            auth: string,
        },
    },
};
