import axios from 'axios';
import { BookId } from '../model';
import * as Contracts from '../contracts';
import { backendBase } from '../utils';

const backendUrl = backendBase() + '/';
const jsonPath = 'json/';
const libraryApi = 'library';

export async function fetchLibrary(): Promise<Contracts.Library> {
    const lib = await fetchJson(backendUrl + libraryApi) as Contracts.Library;
    return lib;
}

export async function fetchBI(bookId: BookId): Promise<Contracts.VolumeNode> {
    const backendBook = fetchBook(bookId.name);
    return backendBook;
}

export async function fetchBook(bookName: string): Promise<Contracts.VolumeNode> {
    const response = await fetchJson(backendUrl + jsonPath + bookName) as Contracts.VolumeNode;
    return response;
}

export async function fetchJson(url: string): Promise<object> {
    const json = await axios.get(url, {
        responseType: 'json',
    });

    return json.data;
}
