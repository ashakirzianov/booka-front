import * as React from 'react';
import { Callback } from 'booka-common';

import { WithChildren } from './common';
import { useScroll } from './subscribeEffects';

export type ScrollProps = WithChildren<{
    onScroll?: Callback<void>,
}>;
export function Scroll({ onScroll, children }: ScrollProps) {
    useScroll(onScroll);

    return <>
        {children}
    </>;
}

export type RefType = HTMLElement | null;
export type RefHandler = (ref: any) => void;

export function refable<P = {}>(C: React.ComponentType<P>) {
    return React.forwardRef<HTMLDivElement, P & { children?: React.ReactNode }>((props, ref) =>
        <div ref={ref} style={{ display: 'flex' }}>
            <C {...props} />
        </div>
    );
}

export async function isPartiallyVisible(ref?: RefType) {
    if (ref) {
        const rect = boundingClientRect(ref);
        if (rect) {
            const { top, height } = rect;
            const result = top <= 0 && top + height >= 0;
            if (result) {
                return result;
            }
        }
    }

    return false;
}

export function boundingClientRect(ref?: RefType) {
    const current = currentObject(ref);
    return current
        && current.getBoundingClientRect
        && current.getBoundingClientRect()
        ;
}

export function scrollToRef(ref: RefType | undefined) {
    if (ref) {
        const current = currentObject(ref);
        if (current) {
            current.scrollIntoView();
            // TODO: find other solution ?
            // window.scrollBy(0, 1); // Ugly -- fix issue with showing prev element path in the url after navigation
            return true;
        }
    }
    return false;
}

export function scrollToBottom() {
    window.scrollTo({
        behavior: 'smooth',
        top: scrollHeight(),
    });
}

export function scrollToTop() {
    window.scrollTo(0, 0);
}

function scrollHeight() {
    const element = document.scrollingElement || document.body;
    return element.scrollHeight;
}

function currentObject(ref: RefType | null | undefined) {
    return ref;
}
