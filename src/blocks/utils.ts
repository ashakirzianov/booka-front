// import Radium from 'radium';

// export type HoverableProps<T> = T extends { style?: infer S }
//     ? T & { style?: { ':hover'?: S } }
//     : T;
// export function hoverable<T>(Cmp: React.ComponentType<T>): React.ComponentType<HoverableProps<T>> {
//     const result = Radium(Cmp);
//     result.displayName = (Cmp.displayName || (Cmp as any).name);

//     return result as any;
// }

export function isOpenNewTabEvent(e: React.MouseEvent) {
    return isMacOs()
        ? e.metaKey
        : e.ctrlKey;
}

function isMacOs(): boolean {
    return navigator.platform.startsWith('Mac');
}
