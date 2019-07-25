import * as React from 'react';
import { NativeMethodsMixinStatic, View, ScrollView } from 'react-native';
import { ScrollProps } from './Scroll';
import { WithChildren } from './common';

export type RefType = NativeMethodsMixinStatic | null;
export type RefHandler = (ref: any) => void;

export function Scroll(props: WithChildren<ScrollProps>) {
    return <ScrollView
        onScroll={props.onScroll}
        scrollEventThrottle={1024}
    >
        {props.children}
    </ScrollView>;
}

export function refable<P = {}>(C: React.ComponentType<P>) {
    return React.forwardRef<View, P & { children?: React.ReactNode }>((props, ref) =>
        <View ref={ref} style={{ display: 'flex' }}>
            <C {...props} />
        </View>
    );
}

export async function isPartiallyVisible(ref?: RefType) {
    if (ref) {
        const rect = await visibleRect(ref);
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
export async function visibleRect(ref?: RefType): Promise<Rect | undefined> {
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
