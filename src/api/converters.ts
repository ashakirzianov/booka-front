import * as Contracts from '../contracts';
import { Library, BookId, Book, tocFromVolume, User } from '../model';

export function convertLibrary(lib: Contracts.Library): Library {
    return {
        books: lib,
    };
}

export function convertBook(volume: Contracts.VolumeNode, id: BookId): Book {
    return {
        volume,
        id,
        toc: tocFromVolume(volume, id),
    };
}

export function convertUserInfo(userInfo: Contracts.UserInfo): User {
    return {
        name: userInfo.name,
        profilePictureUrl: userInfo.pictureUrl,
    };
}
