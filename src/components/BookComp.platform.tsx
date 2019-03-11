import * as React from 'react';
import { throttle } from 'lodash';

export type Path = number[];
export type RefType = HTMLDivElement;
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

    public componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    public boundingClientRect() {
        return this.ref
            && this.ref.getBoundingClientRect
            && this.ref.getBoundingClientRect()
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
        return <div ref={ref => {
            this.ref = ref;
            if (ref && this.props.onRefAssigned) {
                this.props.onRefAssigned(ref, this.props.path);
            }
        }} id={keyForPath(this.props.path)}>
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

function keyForPath(path: Path) {
    return path.join('-');
}

function elementForPath(path: Path) {
    const key = keyForPath(path);
    const element = document.getElementById(key);

    return element;
}

export function scrollToPath(path: Path) {
    const element = elementForPath(path);
    if (element) {
        const { top } = element.getBoundingClientRect();
        window.scrollTo(0, top);
    }
}
