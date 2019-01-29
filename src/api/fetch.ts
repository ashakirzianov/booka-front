import axios from 'axios';
import { Book, noBook, errorBook, BookLocator, Library } from "../model";
import { ExcludeKeys } from '../utils';

export const backendBaseProd = 'https://reader-back.herokuapp.com/';
export const backendBaseDebug = 'http://localhost:3042/';
const backendBase = process.env.NODE_ENV === 'production' ?
    backendBaseProd : backendBaseDebug;
const jsonPath = 'json/';
const libraryApi = 'library';

// TODO: address this mess with contract mismatch !!
type BackendLibraryJson = Library['books'];
type BackendBookJson = ExcludeKeys<Book, 'locator'>;

export async function fetchLibrary(): Promise<Library> {
    const lib = await fetchJson(backendBase + libraryApi) as BackendLibraryJson;
    return {
        books: lib,
    };
}

export async function fetchBL(bookLocator: BookLocator): Promise<Book> {
    switch (bookLocator.bl) {
        case 'no-book':
            return Promise.resolve(noBook());
        case 'static-book':
            const backendBook = fetchBook(bookLocator.name);
            let book = backendBook as any as Book;
            book.locator = bookLocator;
            return book;
        default:
            return Promise.resolve(noBook());
    }
}

export async function fetchBook(bookName: string): Promise<BackendBookJson> {
    try {
        const response = await fetchJson(backendBase + jsonPath + bookName);
        return response as Book;
    } catch (reason) {
        return errorBook("Can't find static book: " + bookName);
    }
}

export async function fetchJson(url: string): Promise<object> {
    const json = await axios.get(url, {
        responseType: 'json',
    });

    return json.data;
}
