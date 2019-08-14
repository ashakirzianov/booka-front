import { BookId } from '../model';
import { config } from '../config';
import { createFetcher, FetchReturn } from '../common/fetcher';
import { BackContract } from '../backContract';
import { PathMethodContract } from '../common/contractTypes';

const backendUrl = config().backendBase;
const back = createFetcher<BackContract>(backendUrl);

async function optional<C extends PathMethodContract>(promise: Promise<FetchReturn<C>>): Promise<C['return'] | undefined> {
    const result = await promise;
    if (result.success) {
        return result.value;
    } else {
        config().logger(result.response);
        return undefined;
    }
}

export async function uploadBook(bookFile: File, token: string) {
    const data = new FormData();
    data.append('book', bookFile);
    await back.post('/book/upload', {
        auth: token,
        extra: {
            postData: data,
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
    return optional(back.get('/book/all', {}));
}

export async function fetchBI(bookId: BookId) {
    return optional(back.get('/book/single', {
        query: { id: bookId.name },
    }));
}
