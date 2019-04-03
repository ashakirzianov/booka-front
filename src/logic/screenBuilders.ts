import {
    bookScreen, libraryScreen, Screen, bookLocator,
} from '../model';
import { bookForId, currentPosition, currentLibrary } from './dataAccess';
import { ToBook, NavigationObject } from '../model/navigationObject';
import { assertNever } from '../utils';

function buildBookScreen(navigation: ToBook): Promise<Screen> {
    const book = bookForId(navigation.id);
    const path = navigation.location.location === 'current'
        ? currentPosition(navigation.id)
        : Promise.resolve(navigation.location.path || []);

    const promise = Promise.all([book, path]).then(([b, p]) => {
        const { id, toc, footnoteId } = navigation;
        const locator = bookLocator(id, p);
        return bookScreen(b, locator, toc, footnoteId);
    });

    return promise;
}

function buildLibraryScreen(): Promise<Screen> {
    return currentLibrary().then(l => libraryScreen(l));
}

export function buildScreenForNavigation(navigation: NavigationObject): Promise<Screen> {
    switch (navigation.navigate) {
        case 'book':
            return buildBookScreen(navigation);
        case 'default':
        case 'library':
        case 'unknown':
            // TODO: report errors
            return buildLibraryScreen();
        default:
            return assertNever(navigation);
    }
}
