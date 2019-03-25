export type SearchObject = {
    [key: string]: string,
};
export type ParsedUrl = {
    path: string[],
    search: SearchObject,
    hash?: string,
};
export function parseUrl(urlString: string): ParsedUrl {
    const url = new URL(urlString);

    return {
        path: parsePathname(url.pathname),
        search: parseSearchString(url.search),
        hash: url.hash,
    };
}

function parsePathname(pathname: string | undefined): string[] {
    if (!pathname) {
        return [];
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
