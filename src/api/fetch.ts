import axios from 'axios';
import {
    Book, errorBook, BookLocator, Library,
} from "../model";
import { LibraryJson, BookJson } from './contracts';
import { throwExp } from '../utils';

export const backendBaseProd = 'https://reader-back.herokuapp.com/';
export const backendBaseDebug = 'http://localhost:3042/';
const backendBase = process.env.NODE_ENV === 'production' ?
    backendBaseProd : backendBaseDebug;
const jsonPath = 'json/';
const libraryApi = 'library';

export async function fetchLibrary(): Promise<Library> {
    const lib = await fetchJson(backendBase + libraryApi) as LibraryJson;
    return {
        loading: false,
        books: lib,
    };
}

export async function fetchBL(bookLocator: BookLocator): Promise<Book> {
    switch (bookLocator.bl) {
        case 'remote-book':
            const backendBook = fetchBook(bookLocator.name);
            return backendBook;
        default:
            return throwExp(`Unsupported book locator: ${bookLocator}`);
    }
}

export async function fetchBook(bookName: string): Promise<Book> {
    try {
        const response = await fetchJson(backendBase + jsonPath + bookName) as BookJson;
        return response;
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
