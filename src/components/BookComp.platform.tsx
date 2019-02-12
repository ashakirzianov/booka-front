import * as React from 'react';

type Offset = number;
type Path = Array<number>;
interface Scrollable {
    offsetForPath: (path: Path) => Offset | undefined,
    pathForOffset: (offset: Offset) => Path | undefined,
};

function isScrollable(o: any): o is Scrollable {
    return typeof o.offsetForPath === 'function';
}

class ScrollableBase<T> extends React.Component<T> {
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

    public childrenPathForOffset(offset: Offset): Path | undefined {
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

class ScrollableWithOffset<T> extends ScrollableBase<T> {
    readonly ref: React.RefObject<HTMLDivElement>;
    constructor(props: T, readonly Child: React.ComponentType<T>) {
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

export function scrollableChild<T>(C: React.ComponentType<T>) {
    return class ScrollableChild extends ScrollableWithOffset<T> implements Scrollable {
        constructor(props: T) { super(props, C); }

        offsetForPath(path: Path) {
            return path.length === 0 ? this.ownOffset() : undefined;
        }

        pathForOffset(offset: Offset): Path | undefined {
            const own = this.ownOffset();
            if (own && own > offset) {
                return undefined;
            } else {
                return [];
            }
        }
    };
}

export function scrollableContainer<T>(C: React.ComponentType<T>) {
    return class ScrollableContainer extends ScrollableWithOffset<T> implements Scrollable {
        constructor(props: T) { super(props, C); }

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

            return this.childrenPathForOffset(offset);
        }
    }
}

export type ScrollableRootHandler = (path: Path) => void;
export function scrollableRoot<T>(Child: React.ComponentType<T>) {
    type BaseProps = T & { onScroll: ScrollableRootHandler };
    return class ScrollableRoot extends ScrollableBase<BaseProps> {
        constructor(props: BaseProps) {
            super(props);
            this.handleScroll = this.handleScroll.bind(this);
        }
        componentDidMount() {
            window.addEventListener('scroll', this.handleScroll);
        }

        componentWillUnmount() {
            window.removeEventListener('scroll', this.handleScroll);
        }

        handleScroll = () => {
            const offset = windowOffset();
            if (offset !== undefined) {
                const path = this.childrenPathForOffset(offset);
                if (path) {
                    this.props.onScroll(path);
                }
            }   
        }

        render() {
            return <Child {...this.props} />;
        }
    };
}

function windowOffset(): Offset | undefined {
    return window.pageYOffset || document.documentElement.scrollTop || undefined;
}
