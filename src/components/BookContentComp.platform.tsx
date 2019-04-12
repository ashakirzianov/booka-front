import * as React from 'react';

import { Comp, Callback } from '../blocks';
import { SpanInfo, pathToString, stringToPath } from './BookContentComp';
import { BookRange, BookPath, bookRangeUnordered } from '../model';

export function subscribeScroll(handler: Callback<void>) {
    window.addEventListener('scroll', handler);
}

export function unsubscribeScroll(handler: Callback<void>) {
    window.removeEventListener('scroll', handler);
}

export function subscribeSelection(handler: Callback<void>) {
    window.addEventListener('mouseup', handler);
    window.addEventListener('keydown', handler);
}

export function unsubscribeSelection(handler: Callback<void>) {
    window.removeEventListener('mouseup', handler);
    window.removeEventListener('keydown', handler);
}

// TODO: add id
export const CapitalizeFirst: Comp<{ text: string, info: SpanInfo }> = (props => {
    const text = props.text.trimStart();
    const firstInfo = props.info;
    const secondInfo = {
        path: props.info.path.slice(),
    };
    secondInfo.path[secondInfo.path.length - 1] += 1;
    return <span>
        <span
            id={infoToId(firstInfo)}
            style={{
                float: 'left',
                fontSize: '400%',
                lineHeight: '80%',
            }}
        >
            {text[0]}
        </span>
        <span id={infoToId(secondInfo)}>
            {text.slice(1)}
        </span>
    </span>;
});

export const TextRun: Comp<{ text: string, info: SpanInfo }> = (props =>
    <span id={infoToId(props.info)}>
        {props.text}
    </span>
);

export function getSelectionRange(): BookRange | undefined {
    const selection = window.getSelection();
    if (!selection) {
        return undefined;
    }

    const anchorPath = pathForNode(selection.anchorNode);
    const focusPath = pathForNode(selection.focusNode);

    if (anchorPath && focusPath) {
        anchorPath[anchorPath.length - 1] += selection.anchorOffset;
        focusPath[focusPath.length - 1] += selection.focusOffset;
        return bookRangeUnordered(anchorPath, focusPath);
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

function infoToId(id: SpanInfo): string {
    return `id:${pathToString(id.path)}`;
}

function idToInfo(str: string): SpanInfo | undefined {
    const comps = str.split(':');
    if (comps.length !== 2 || comps[0] !== 'id') {
        return undefined;
    }
    const path = stringToPath(comps[1]);

    return { path };
}
