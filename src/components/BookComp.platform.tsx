import * as React from 'react';

type Offset = number;
// type Path = Array<number>;

export function scrollableUnit<T>(C: React.ComponentType<T>) {
    return class ScrollableUnit<T> extends React.Component<T> {
        readonly ref: React.RefObject<HTMLDivElement>;
        constructor(props: T) {
            super(props);
            this.ref = React.createRef();
        }
    
        ownOffset(): Offset | undefined {
            return this.ref.current !== null
                ? this.ref.current.offsetTop
                : undefined
                ;
        }

        componentDidMount() {
            window.addEventListener('scroll', this.handleScroll);
        }

        componentWillUnmount() {
            window.removeEventListener('scroll', this.handleScroll);
        }

        handleScroll = () => {
            const offset = windowOffset();
            const own = this.ownOffset();
            console.log("Offsets", offset, own); 
        }
    
        render() {
            // TODO: investigate why 'as any'
            return <div ref={this.ref}>
                <C {...this.props as any} />
            </div>;
        }
    };
}

function windowOffset(): Offset | undefined {
    return window.pageYOffset || document.documentElement.scrollTop || undefined;
}
