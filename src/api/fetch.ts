import { BackContract, PathMethodContract, LibContract } from 'booka-common';
import { BookId } from '../model';
import { config } from '../config';
import { createFetcher, FetchReturn } from './fetcher';

const backendUrl = config().backendBase;
const back = createFetcher<BackContract>(backendUrl);
const lib = createFetcher<LibContract>(config().libBase);

async function optional<C extends PathMethodContract>(promise: Promise<FetchReturn<C>>): Promise<C['return'] | undefined> {
    const result = await promise;
    if (result.success) {
        return result.value;
    } else {
        config().logger(result.response);
        return undefined;
    }
}

export async function uploadBook(bookData: any, token: string) {
    return lib.post('/upload', {
        auth: token,
        extra: {
            postData: bookData,
        },
    });
}

export async function fetchUserInfo(token: string) {
    return optional(back.get('/me/info', { auth: token }));
}

export async function fetchTokenForFb(fbToken: string) {
    return optional(back.get('/auth/fbtoken', {
        query: { token: fbToken },
    }));
}

export async function fetchLibrary() {
    return optional(lib.get('/all', {
        query: { page: 0 },
    }));
}

export async function fetchBI(bookId: BookId) {
    return optional(lib.get('/full', {
        query: { id: bookId.name },
    }));
}
