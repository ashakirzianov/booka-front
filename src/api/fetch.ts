import axios from 'axios';
import {
    Book, noBook, errorBook, BookLocator, Library, BookNode,
} from "../model";

export const backendBaseProd = 'https://reader-back.herokuapp.com/';
export const backendBaseDebug = 'http://localhost:3042/';
const backendBase = process.env.NODE_ENV === 'production' ?
    backendBaseProd : backendBaseDebug;
const jsonPath = 'json/';
const libraryApi = 'library';

// TODO: address this mess with contract mismatch !!
type BackendLibraryJson = {
    [key: string]: {
        title: string,
        author?: string,
    } | undefined;
};
type BackendBookJson = {
    book: "book",
    meta: {
        title: string,
        author?: string,
    },
    content: BookNode[],
};

export async function fetchLibrary(): Promise<Library> {
    const lib = await fetchJson(backendBase + libraryApi) as BackendLibraryJson;
    return {
        loading: false,
        books: lib,
    };
}

export async function fetchBL(bookLocator: BookLocator): Promise<Book> {
    switch (bookLocator.bl) {
        case 'no-book':
            return Promise.resolve(noBook());
        case 'remote-book':
            const backendBook = fetchBook(bookLocator.name);
            return backendBook;
        default:
            return Promise.resolve(noBook());
    }
}

export async function fetchBook(bookName: string): Promise<Book> {
    try {
        const response = await fetchJson(backendBase + jsonPath + bookName) as BackendBookJson;
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
