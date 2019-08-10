import * as Contracts from '../backContract';
import {
    Library, BookId, Book, tocFromVolume, User,
    VolumeNode,
} from '../model';

export function convertLibrary(lib: Contracts.BookCollection): Library {
    return {
        books: lib.books.reduce((current, bi) => {
            current[bi.id] = {
                title: bi.title,
                author: bi.author,
            };
            return current;
        }, {} as Library['books']),
    };
}

export function convertBook(volume: VolumeNode, id: BookId): Book {
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
