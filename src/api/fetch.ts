import axios from 'axios';
import { BookId } from '../model';
import * as Contracts from '../contracts';
import { debugValue, debugBackendBase } from '../utils';

export const backendBaseProd = 'https://reader-back.herokuapp.com/';
export const backendBaseDebug = debugBackendBase();
const backendBase = debugValue({
    debug: backendBaseDebug,
    production: backendBaseProd,
});
const jsonPath = 'json/';
const libraryApi = 'library';

export async function fetchLibrary(): Promise<Contracts.Library> {
    const lib = await fetchJson(backendBase + libraryApi) as Contracts.Library;
    return lib;
}

export async function fetchBI(bookId: BookId): Promise<Contracts.BookContent> {
    const backendBook = fetchBook(bookId.name);
    return backendBook;
}

export async function fetchBook(bookName: string): Promise<Contracts.BookContent> {
    const response = await fetchJson(backendBase + jsonPath + bookName) as Contracts.BookContent;
    return response;
}

export async function fetchJson(url: string): Promise<object> {
    const json = await axios.get(url, {
        responseType: 'json',
    });

    return json.data;
}
