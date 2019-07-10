import { NativeMethodsMixinStatic } from 'react-native';

export type RefType = NativeMethodsMixinStatic | null;
export type RefHandler = (ref: any) => void;

export async function isPartiallyVisible(ref?: RefType) {
    console.warn('heello');
    if (ref) {
        const rect = await boundingClientRect(ref);
        console.log(rect);
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

type Rect = {
    top: number,
    left: number,
    width: number,
    height: number,
};
export async function boundingClientRect(ref?: RefType): Promise<Rect | undefined> {
    const current = currentObject(ref);
    const promise = new Promise<Rect | undefined>((resolve, reject) => {
        if (current) {
            current.measure((x, y, width, height) =>
                resolve({
                    top: x,
                    left: y,
                    width,
                    height,
                }));
        } else {
            resolve(undefined);
        }
    });

    return promise;
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

function currentObject(ref: RefType | null | undefined) {
    return ref || undefined;
}
