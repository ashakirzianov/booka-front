import { Callback } from '../blocks';
import { BookPath, bookRangeUnordered } from '../model';
import { idToPath } from './common';
import { BookSelection } from './Reader.common';

export function getSelectionRange(): BookSelection | undefined {
    const selection = window.getSelection();
    if (!selection) {
        return undefined;
    }

    const anchorPath = pathForNode(selection.anchorNode);
    const focusPath = pathForNode(selection.focusNode);

    if (anchorPath && focusPath) {
        anchorPath[anchorPath.length - 1] += selection.anchorOffset;
        focusPath[focusPath.length - 1] += selection.focusOffset;
        const range = bookRangeUnordered(anchorPath, focusPath);
        const text = selection.toString();
        return { range, text };
    } else {
        return undefined;
    }
}

function pathForNode(node: Node | null): BookPath | undefined {
    return node
        ? pathForHtmlElement(node.parentElement)
        : undefined;
}

function pathForHtmlElement(element: HTMLElement | null): BookPath | undefined {
    if (!element) {
        return undefined;
    }

    const idString = element.id;
    const path = idToPath(idString);
    if (path) {
        return path;
    } else {
        return pathForHtmlElement(element.parentElement);
    }
}

export const subscribe = {
    scroll(handler: Callback<Event>) {
        window.addEventListener('scroll', handler);
    },
    selection(handler: Callback<Event>) {
        window.document.addEventListener('selectionchange', handler);
    },
    copy(handler: Callback<ClipboardEvent>) {
        window.addEventListener('copy', handler as any);
    },
};

export const unsubscribe = {
    copy(handler: Callback<ClipboardEvent>) {
        window.removeEventListener('copy', handler as any);
    },
    selection(handler: Callback<Event>) {
        window.document.removeEventListener('selectionchange', handler);
    },
    scroll(handler: Callback<Event>) {
        window.removeEventListener('scroll', handler);
    },
};
