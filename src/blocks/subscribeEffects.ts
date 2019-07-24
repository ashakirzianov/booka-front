import { Callback } from './common';
import { useEffect } from 'react';

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
