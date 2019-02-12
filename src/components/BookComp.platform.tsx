import * as React from 'react';
import { Comp } from './comp-utils';

type Offset = number;
type Path = Array<number>;
interface Scrollable {
    offsetForPath: (path: Path) => Offset | undefined,
    pathForOffset: (offset: Offset) => Path | undefined,
};

export function isScrollable(o: any): o is Scrollable {
    return typeof o.offsetForPath === 'function';
}

class WithOffset<T> extends React.Component<T> {
    readonly ref: React.RefObject<HTMLDivElement>;
    constructor(props: T, readonly Child: Comp<T>) {
        super(props);
        this.ref = React.createRef();
    }

    ownOffset(): Offset | undefined {
        return this.ref.current !== null
            ? this.ref.current.offsetTop
            : undefined
            ;
    }

    render() {
        return <div ref={this.ref}>
            <this.Child {...this.props} />
        </div>;
    }
};

export function scrollableChild<T>(C: Comp<T>) {
    return class ScrollableChild extends WithOffset<T> implements Scrollable {
        constructor(props: T) { super(props, C); }

        offsetForPath(path: Path) {
            return path.length === 0 ? this.ownOffset() : undefined;
        }

        pathForOffset(offset: Offset) {
            return undefined;
        }
    };
}

export function scrollableContainer<T>(C: Comp<T>) {
    return class ScrollableContainer extends WithOffset<T> implements Scrollable {
        constructor(props: T) { super(props, C); }

        offsetForPath(path: Path) {
            if (path.length === 0) {
                return this.ownOffset();
            }

            const targetIndex = path[0];
            const remainingPath = path.slice(1);
            let currentIndex = 0;
            let offset: Offset | undefined = undefined;
            React.Children.forEach(this.props.children, ch => {
                if (isScrollable(ch)) {
                    if (currentIndex === targetIndex) {
                        offset = ch.offsetForPath(remainingPath);
                    }
                    currentIndex++;
                }
            });
            return offset;
        }

        pathForOffset(offset: Offset): Path | undefined {
            const own = this.ownOffset();
            if (own && own > offset) {
                return undefined;
            }

            let currentIndex = 0;
            let path: Path | undefined = undefined;
            React.Children.forEach(this.props.children, ch => {
                if (isScrollable(ch)) {
                    if (!path) {
                        const tailPath = ch.pathForOffset(offset);
                        if (tailPath) {
                            path = [currentIndex].concat(tailPath);
                        }
                    }
                    currentIndex++;
                }
            });

            return path === undefined ? [] : path;
        }
    }
}
