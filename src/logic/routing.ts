import { stringToBL, BookLocator, blToString, BookId, biToString } from '../model';
import { actionCreators, dispatchAction } from '../redux';
import { buildBookScreen, buildLibraryScreen } from './screenBuilders';
import { Action } from '../redux/store';
import { parsePartialUrl } from './parseUrl';

export type Destination = string;
export function destinationToActions(dest: Destination): Action[] {
    const actions = Array.from(actionsForDest(dest));
    return actions;
}

function* actionsForDest(dest: Destination) {
    const url = parsePartialUrl(dest);
    const head = url.path[0];
    switch (head) {
        case 'book':
            const blString = url.path.slice(1).join('/');
            const bl = stringToBL(blString);
            // TODO: report bad BL
            if (bl) {
                const tocOpen = url.search.toc !== undefined;
                const footnoteId = url.search.fid !== undefined
                    ? url.search.fid
                    : undefined;
                yield actionCreators.navigateToScreen(buildBookScreen(bl, tocOpen, footnoteId));
                yield actionCreators.updateCurrentBookPosition(bl.range.start);
            }
            return;
        default:
            // TODO: report unsupported path
            yield actionCreators.navigateToScreen(buildLibraryScreen());
            return;
    }
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
