import {
    Book, Library, BookId, library,
} from '../model';
import {
    fetchBI, fetchLibrary, fetchUserInfo,
    convertBook, convertLibrary, convertUserInfo, fetchTokenForFb,
} from '../api';
import { stores } from './persistent';
import { forEach } from '../utils';
import { dispatchSetUserAction } from './store';

export async function bookForId(bi: BookId): Promise<Book> {
    const book = stores.books.get(bi.name);
    if (book) {
        return book;
    }

    const volume = await fetchBI(bi);
    const converted = convertBook(volume, bi);
    stores.books.set(converted.id.name, converted);

    return converted;
}

export async function currentLibrary(): Promise<Library> {
    try {
        const lib = await fetchLibrary();

        const converted = convertLibrary(lib);
        forEach(converted.books, (id, info) => stores.library.set(id, info));

        return converted;
    } catch {
        // TODO: report problems ?
        return library(stores.library.all());
    }
}

async function loginWithToken(token: string) {
    const userInfo = await fetchUserInfo(token);
    if (userInfo) {
        const user = convertUserInfo(userInfo);
        dispatchSetUserAction(user);
        return user;
    } else {
        return undefined;
    }
}

export async function loginWithStoredToken() {
    const token = stores.token.get();
    if (token) {
        const result = await loginWithToken(token);
        if (!result) {
            stores.token.clear();
        }
        return result;
    } else {
        return undefined;
    }
}

export async function loginWithFbToken(fbToken: string) {
    const newToken = await fetchTokenForFb(fbToken);
    if (newToken) {
        const user = loginWithToken(newToken);
        if (user) {
            stores.token.set(newToken);
        }

        return user;
    } else {
        return undefined;
    }
}
