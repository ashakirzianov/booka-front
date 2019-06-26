import { Callback } from '../blocks';
import { BookSelection } from './Reader.common';

// TODO: implement
export function getSelectionRange(): BookSelection | undefined {
    return undefined;
}

// TODO: implement
export const subscribe = {
    scroll(handler: Callback<Event>) {
        return;
    },
    selection(handler: Callback<Event>) {
        return;
    },
    copy(handler: Callback<ClipboardEvent>) {
        return;
    },
};

// TODO: implement
export const unsubscribe = {
    copy(handler: Callback<ClipboardEvent>) {
        return;
    },
    selection(handler: Callback<Event>) {
        return;
    },
    scroll(handler: Callback<Event>) {
        return;
    },
};
