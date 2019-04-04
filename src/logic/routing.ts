import { BookLocator, blToString, BookId, biToString } from '../model';
import { dispatchAction } from '../redux';
import { parsePartialUrl } from '../parseUrl';
import { urlToNavigation } from '../model/navigationObject';
import { Action, actionCreators } from '../redux/actions';

export type Destination = string;
export function destinationToActions(dest: Destination): Action[] {
    const url = parsePartialUrl(dest);
    const no = urlToNavigation(url);
    const action = actionCreators.navigate(no);

    return [action];
}

export function dispatchNavigationEvent(dest: Destination) {
    const actions = destinationToActions(dest);
    actions.forEach(a => dispatchAction(a));
}

export function linkForBook(bl: BookLocator): Destination {
    return `/book/${blToString(bl)}`;
}

export function linkForCurrentPosition(bi: BookId): Destination {
    return `/book/${bi.name}/current`;
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
