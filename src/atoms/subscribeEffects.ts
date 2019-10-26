import { useEffect } from 'react';
import { Callback } from 'booka-common';

export function useSelection(callback: Callback<Event>) {
    useEffect(() => {
        window.document.addEventListener('selectionchange', callback);

        return function unsubscribe() {
            window.document.removeEventListener('selectionchange', callback);
        };
    }, [callback]);
}

export function useCopy(callback: Callback<ClipboardEvent>) {
    useEffect(() => {
        window.addEventListener('copy', callback as any);

        return function unsubscribe() {
            window.removeEventListener('copy', callback as any);
        };
    }, [callback]);
}

export function useScroll(callback?: Callback<Event>) {
    useEffect(() => {
        if (callback) {
            window.addEventListener('scroll', callback);
        }

        return callback && function unsubscribe() {
            window.removeEventListener('scroll', callback);
        };
    }, [callback]);
}
