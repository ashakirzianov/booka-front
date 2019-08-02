import axios from 'axios';
import { BookId } from '../model';
import * as Contracts from '../contracts';
import { config } from '../config';

const backendUrl = config().backendBase + '/';
const jsonPath = 'json/';
const libraryApi = 'library';
const fbAuth = 'auth/fbtoken/';

export async function fetchTokenForFb(fbToken: string): Promise<string | undefined> {
    const response = await fetchJson<Contracts.AuthToken>(backendUrl + fbAuth + fbToken);

    return response.token;
}

export async function fetchLibrary(): Promise<Contracts.Library> {
    const lib = await fetchJson<Contracts.Library>(backendUrl + libraryApi);
    return lib;
}

export async function fetchBI(bookId: BookId): Promise<Contracts.VolumeNode> {
    const backendBook = fetchBook(bookId.name);
    return backendBook;
}

export async function fetchBook(bookName: string): Promise<Contracts.VolumeNode> {
    const response = await fetchJson<Contracts.VolumeNode>(backendUrl + jsonPath + bookName);
    return response;
}

export async function fetchJson<T = {}>(url: string): Promise<T> {
    const json = await axios.get(url, {
        responseType: 'json',
    });

    return json.data as T;
}
