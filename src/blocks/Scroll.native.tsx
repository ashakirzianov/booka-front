export type RefType = null;
export type RefHandler = (ref: RefType) => void;

// TODO: implement below
export function isPartiallyVisible(ref?: RefType) {
    return false;
}

export function boundingClientRect(ref?: RefType) {
    return undefined;
}

export function scrollToRef(ref: RefType | undefined) {
    return false;
}

export function scrollToBottom() {
    return;
}

export function scrollToTop() {
    return;
}
