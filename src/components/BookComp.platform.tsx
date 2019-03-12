import * as React from 'react';
import { throttle } from 'lodash';

export type Path = number[];
export type RefType = React.RefObject<HTMLDivElement>;
export type RefHandler = (ref: RefType, path: Path) => void;
type ScrollableUnitProps = {
    onScrollVisible?: (path: Path) => void,
    onRefAssigned?: RefHandler,
    path: Path,
};
class ScrollableUnit extends React.Component<ScrollableUnitProps> {
    public ref: RefType | null = null;

    public handleScroll = throttle(() => {
        if (this.props.onScrollVisible && this.isPartiallyVisible()) {
            this.props.onScrollVisible(this.props.path);
        }
    }, 250);

    constructor(props: ScrollableUnitProps) {
        super(props);
        this.ref = React.createRef();
        if (props.onRefAssigned) {
            props.onRefAssigned(this.ref, props.path);
        }
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    public boundingClientRect() {
        const current = currentObject(this.ref);
        return current
            && current.getBoundingClientRect
            && current.getBoundingClientRect()
            ;
    }

    public isPartiallyVisible() {
        const rect = this.boundingClientRect();
        if (rect) {
            const { top, height } = rect;
            return top <= 0 && top + height >= 0;
        }

        return false;
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
            onScrollVisible={props.onScrollVisible}
            onRefAssigned={props.onRefAssigned}
            path={props.path}
        ><C {...props} /></ScrollableUnit>;
}

export function scrollToRef(ref: RefType | undefined) {
    if (ref) {
        const current = currentObject(ref);
        if (current) {
            // const rect = current.getBoundingClientRect();
            // const top = rect.top;
            const top = current.offsetTop + 112; // TODO: what is 112???
            window.scrollTo({
                top: top,
            });
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

function scrollHeight() {
    const element = document.scrollingElement || document.body;
    return element.scrollHeight;
}

function currentObject(ref: RefType | null) {
    return ref && ref.current;
}
