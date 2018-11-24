import axios from 'axios';
import { Book, noBook, errorBook, BookLocator, Library } from "../model";

export const backendBaseProd = 'https://reader-back.herokuapp.com/';
export const backendBaseDebug = 'http://localhost:3042/';
const backendBase = backendBaseProd; // TODO: set depending on env var
const jsonPath = 'json/';
const libraryApi = 'library';

export async function fetchLibrary(): Promise<Library> {
    const lib = await fetchJson(backendBase + libraryApi) as Library;
    return lib;
}

export async function fetchBL(bookLocator: BookLocator): Promise<Book> {
    switch (bookLocator.bl) {
        case 'no-book':
            return Promise.resolve(noBook());
        case 'static-book':
            return fetchBook(bookLocator.name);
        default:
            return Promise.resolve(noBook());
    }
}

export async function fetchBook(bookName: string): Promise<Book> {
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
