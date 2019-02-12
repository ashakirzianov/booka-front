import * as React from 'react';
import { Comp } from './comp-utils';

type Offset = number;
type Path = Array<number>;
interface Scrollable {
    ownOffset: () => Offset,
    offsetForPath?: (path: Path) => Offset,
    pathForOffset?: (offset: Offset) => Path,
};

export function isScrollable(o: any): o is Scrollable {
    return typeof o.offsetForPath === 'function';
}

export function scrollableChild<T>(C: Comp<T>) {
    return class ScrollableChild extends React.Component<T> implements Scrollable {
        readonly ref: React.RefObject<HTMLDivElement>;
        constructor(props: any) {
            super(props);
            this.ref = React.createRef();
        }
    
        ownOffset(): Offset {
            return this.ref.current !== null
                ? this.ref.current.offsetTop
                : -1 // TODO: be careful!
                ;
        }
    
        public render() {
            return <div ref={this.ref}>
                <C {...this.props} />
            </div>;
        }
    };
}
