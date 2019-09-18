import { forEach } from 'booka-common';
import {
    BookObject, Library, BookId, library, User,
} from '../model';
import {
    fetchBI, fetchLibrary, fetchUserInfo,
    convertBook, convertLibrary, fetchTokenForFb,
} from '../api';
import { stores } from './persistent';
import { dispatchSetUserAction } from './store';

export async function bookForId(bi: BookId): Promise<BookObject | undefined> {
    const book = stores.books.get(bi.name);
    if (book) {
        return book;
    }

    const bookObject = await fetchBI(bi);
    if (bookObject) {
        const converted = convertBook(bookObject, bi);
        stores.books.set(converted.id.name, converted);

        return converted;
    } else {
        return undefined;
    }

}

export async function currentLibrary(): Promise<Library> {
    try {
        const lib = await fetchLibrary();

        if (lib) {
            const converted = convertLibrary(lib.values);
            forEach(converted.books, (id, info) => stores.library.set(id, info));

            return converted;
        } else {
            return library(stores.library.all());
        }
    } catch {
        // TODO: report problems ?
        return library(stores.library.all());
    }
}

async function loginWithToken(token: string) {
    const userInfo = await fetchUserInfo(token);
    if (userInfo) {
        const user: User = {
            token: token,
            name: userInfo.name,
            profilePictureUrl: userInfo.pictureUrl,
        };
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
        const user = loginWithToken(newToken.token);
        if (user) {
            stores.token.set(newToken.token);
        }

        return user;
    } else {
        return undefined;
    }
}

export async function logout() {
    stores.token.clear();
    dispatchSetUserAction(undefined);
}
