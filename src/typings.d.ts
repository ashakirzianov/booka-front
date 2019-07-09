declare module 'store' {
    type StoreType = object | number | string;
    interface Store {
        get(key: string): StoreType | undefined;
        set(key: string, value: StoreType | undefined): void;
        remove(key: string): void;
        clearAll(): void;
        each(f: (key: string, value: StoreType) => void): void;
    }

    const store: Store;
    export = store;
}

declare module 'react-native-popover-view' {
    type PopoverProps = {
        isVisible?: boolean,
        fromView?: any,
        placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
        onRequestClose?: () => void,
        children: any,
    };
    type Popover = (props: PopoverProps) => any;

    const Popover: Popover;
    export = Popover;
}
