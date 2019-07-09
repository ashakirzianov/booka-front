export type SearchObject = {
    [key: string]: string,
};
export type ParsedUrl = {
    path: string[],
    search: SearchObject,
    hash?: string,
};
export function parsePartialUrl(urlString: string, base: string = 'http://localhost'): ParsedUrl {
    return parseUrl(base + urlString);
}
export function parseUrl(urlString: string): ParsedUrl {
    // eslint-disable-next-line
    const urlRexString = '(\\w+)://([\\w0-9\\.\\:]+)((/[^/\\?#]*)*)(([\\?][^#]*)?)((#.*)?)';
    const urlRegex = new RegExp(urlRexString);
    // $1 -- $2 -- $3 -- $5 -- $7
    // 1 - https
    // 2 - www.some.ru -- base
    // 3 - /some/path -- pathname
    // 5 - ?one=1&two -- search
    // 7 - #anchor -- hash
    // https://www.some.ru/some/path?one=1&two#anchor
    const match = urlString.match(urlRegex) || [];
    const pathname = match[3];
    const search = match[5];
    const hash = match[7];

    return {
        path: parsePathname(pathname),
        search: parseSearchString(search),
        hash: hash || undefined,
    };
}

function parsePathname(pathname: string | undefined): string[] {
    if (!pathname || pathname === '/') {
        return [''];
    }

    return pathname
        .split('/')
        .filter(p => p)
        ;
}

function parseSearchString(searchString: string | undefined): SearchObject {
    if (!searchString || !searchString.startsWith('?')) {
        return {};
    }

    const params = searchString
        .substr(1)
        .split('&')
        ;

    const searchObject = params.reduce((obj, p) => {
        const eq = p.indexOf('=');
        const [key, value] = eq >= 0
            ? [p.substr(0, eq), p.substr(eq + 1)]
            : [p, ''];
        obj[key] = value;
        return obj;
    }, {} as SearchObject);

    return searchObject;
}
