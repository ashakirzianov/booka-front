import { BookLocator, blToString, BookId, biToString } from '../model';
import { actionCreators, dispatchAction } from '../redux';
import { buildScreenForNavigation } from './screenBuilders';
import { Action } from '../redux/store';
import { parsePartialUrl } from './parseUrl';
import { urlToNavigation } from './navigationObject';

export type Destination = string;
export function destinationToActions(dest: Destination): Action[] {
    const url = parsePartialUrl(dest);
    const no = urlToNavigation(url);
    const screen = buildScreenForNavigation(no);
    const action = actionCreators.navigateToScreen(screen);

    return [action];
}

export function dispatchNavigationEvent(dest: Destination) {
    const actions = destinationToActions(dest);
    actions.forEach(a => dispatchAction(a));
}

export function linkForBook(bl: BookLocator): Destination {
    return `/book/${blToString(bl)}`;
}

export function linkForToc(bi: BookId): Destination {
    return `/book/${biToString(bi)}?toc`;
}

export function linkForFootnote(bi: BookId, footnoteId: string): Destination {
    return `/book/${biToString(bi)}?fid=${footnoteId}`;
}

export function linkForLib(): Destination {
    return '/';
}
