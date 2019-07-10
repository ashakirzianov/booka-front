import { NativeMethodsMixinStatic } from 'react-native';

export type RefType = NativeMethodsMixinStatic | null;
export type RefHandler = (ref: any) => void;

export async function isPartiallyVisible(ref?: RefType) {
    if (ref) {
        const rect = await boundingClientRect(ref);
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
            setTimeout(() =>
                current.measureInWindow((x, y, width, height) => {
                    if (x || y || width || height) {
                        resolve({
                            top: y,
                            left: x,
                            width,
                            height,
                        });
                    } else {
                        resolve(undefined);
                    }
                }
                ));
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
