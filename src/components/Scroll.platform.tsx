import * as React from 'react';

export type Path = number[];
export type RefType = React.RefObject<HTMLDivElement>;
export type RefHandler = (ref: RefType, path: Path) => void;
type ScrollableUnitProps = {
    onRefAssigned: RefHandler,
    path: Path,
};
class ScrollableUnit extends React.Component<ScrollableUnitProps> {
    public ref: RefType | null = null;

    constructor(props: ScrollableUnitProps) {
        super(props);
        this.ref = React.createRef();
        if (props.onRefAssigned) {
            props.onRefAssigned(this.ref, props.path);
        }
    }

    public render() {
        return <div ref={this.ref}>
            {this.props.children}
        </div>;
    }
}

export function scrollableUnit<T>(C: React.ComponentType<T>) {
    type ExtendedProps = T & ScrollableUnitProps;
    return (props: ExtendedProps) =>
        <ScrollableUnit
            onRefAssigned={props.onRefAssigned}
            path={props.path}
        ><C {...props} /></ScrollableUnit>;
}

export function isPartiallyVisible(ref?: RefType) {
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
    return ref && ref.current;
}
