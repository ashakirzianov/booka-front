import * as React from 'react';
import { Comp } from './comp-utils';
import { number } from 'prop-types';

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

        findScrollable<T>(f: (ch: Scrollable, idx: number) => T | undefined) {
            let currentIndex = 0;
            let result: T | undefined = undefined;
            React.Children.forEach(this.props.children, ch => {
                if (!result && isScrollable(ch)) {
                    result = f(ch, currentIndex);
                    currentIndex++;
                }
            });

            return result;
        }

        offsetForPath(path: Path) {
            if (path.length === 0) {
                return this.ownOffset();
            }

            const targetIndex = path[0];
            const remainingPath = path.slice(1);
            const offset = this.findScrollable((ch, idx) => {
                if (idx === targetIndex) {
                    return  ch.offsetForPath(remainingPath);
                } else {
                    return undefined;
                }
            });

            return offset;
        }

        pathForOffset(offset: Offset): Path | undefined {
            const own = this.ownOffset();
            if (own && own > offset) {
                return undefined;
            }

            const path = this.findScrollable((ch, idx) => {
                const tailPath = ch.pathForOffset(offset);
                if (tailPath) {
                    return [idx].concat(tailPath);
                } else {
                    return undefined;
                }
            })

            return path === undefined ? [] : path;
        }
    }
}
