import { Callback } from '../blocks';
import { BookSelection } from './BookContentComp';
import { BookPath, bookRangeUnordered } from '../model';
import { idToInfo } from './ParagraphComp';

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
    const id = idToInfo(idString);
    if (id) {
        return id.path;
    } else {
        return pathForHtmlElement(element.parentElement);
    }
}

export function subscribeScroll(handler: Callback<Event>) {
    window.addEventListener('scroll', handler);
}

export function unsubscribeScroll(handler: Callback<Event>) {
    window.removeEventListener('scroll', handler);
}

export function subscribeSelection(handler: Callback<Event>) {
    window.addEventListener('mouseup', handler);
    window.addEventListener('keydown', handler);
}

export function unsubscribeSelection(handler: Callback<Event>) {
    window.removeEventListener('mouseup', handler);
    window.removeEventListener('keydown', handler);
}

export function subscribeCopy(handler: Callback<ClipboardEvent>) {
    window.addEventListener('copy', handler as any);
}

export function unsubscribeCopy(handler: Callback<ClipboardEvent>) {
    window.removeEventListener('copy', handler as any);
}
