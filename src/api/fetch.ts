import axios, { AxiosRequestConfig } from 'axios';
import { BookId } from '../model';
import * as Contracts from '../contracts';
import { config } from '../config';

const backendUrl = config().backendBase;
const bookById = '/book/id/';
const libraryApi = '/book/all';
const fbAuth = '/auth/fbtoken/';
const userInfo = '/me/info';

export async function fetchUserInfo(token: string): Promise<Contracts.UserInfo | undefined> {
    const response = await fetchJson<Contracts.UserInfo>(backendUrl + userInfo, {
        accessToken: token,
    });

    return response;
}

export async function fetchTokenForFb(fbToken: string) {
    return await fetchJson<Contracts.AuthToken>(backendUrl + fbAuth + fbToken);
}

export async function fetchLibrary() {
    return fetchJson<Contracts.BookCollection>(backendUrl + libraryApi);
}

export async function fetchBI(bookId: BookId) {
    return fetchBook(bookId.name);
}

export async function fetchBook(bookName: string) {
    return await fetchJson<Contracts.VolumeNode>(backendUrl + bookById + bookName);
}

type FetchOptions = {
    accessToken?: string,
};
async function fetchJson<T = {}>(url: string, opts?: FetchOptions): Promise<T | undefined> {
    const axiosConf: AxiosRequestConfig = {
        responseType: 'json',
        ...(opts && opts.accessToken && {
            headers: {
                Authorization: `Bearer ${opts.accessToken}`,
            },
        }),
    };
    const json = await axios.get(url, axiosConf);

    const apiResult = json.data as Contracts.Result<T>;

    if (apiResult.success) {
        return apiResult.value;
    } else {
        config().logger(apiResult.reason);
        return undefined;
    }
}
