import axios, { AxiosRequestConfig } from 'axios';
import { BookId } from '../model';
import * as Contracts from '../contracts';
import { config } from '../config';

const backendUrl = config().backendBase + '/';
const jsonPath = 'json/';
const libraryApi = 'library';
const fbAuth = 'auth/fbtoken/';
const user = 'user';

export async function fetchUserInfo(token: string): Promise<Contracts.UserInfo | undefined> {
    const response = await fetchJson<Contracts.UserInfo>(backendUrl + user, {
        accessToken: token,
    });

    return response;
}

export async function fetchTokenForFb(fbToken: string): Promise<string | undefined> {
    const response = await fetchJson<Contracts.AuthToken>(backendUrl + fbAuth + fbToken);

    return response.token;
}

export async function fetchLibrary(): Promise<Contracts.BookCollection> {
    const lib = await fetchJson<Contracts.BookCollection>(backendUrl + libraryApi);
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

type FetchOptions = {
    accessToken?: string,
};
async function fetchJson<T = {}>(url: string, opts?: FetchOptions): Promise<T> {
    const axiosConf: AxiosRequestConfig = {
        responseType: 'json',
        ...(opts && opts.accessToken && {
            headers: {
                Authorization: `Bearer ${opts.accessToken}`,
            },
        }),
    };
    const json = await axios.get(url, axiosConf);

    return json.data as T;
}
