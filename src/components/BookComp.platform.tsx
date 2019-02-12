import * as React from 'react';

export function scrollableUnit<T>(C: React.ComponentType<T>) {
    type ExtendedProps = T & { onScrollVisible: (props: T) => void };
    return class ScrollableUnit extends React.Component<ExtendedProps> {
        readonly ref: React.RefObject<HTMLDivElement>;
        constructor(props: ExtendedProps) {
            super(props);
            this.ref = React.createRef();
        }

        componentDidMount() {
            window.addEventListener('scroll', this.handleScroll);
        }

        componentWillUnmount() {
            window.removeEventListener('scroll', this.handleScroll);
        }

        handleScroll = () => {
            if (this.isPartiallyVisible()) {
                this.props.onScrollVisible(this.props);
            }
        }

        boundingClientRect() {
            return this.ref && this.ref.current
                && this.ref.current.getBoundingClientRect
                && this.ref.current.getBoundingClientRect()
                ;
        }

        isPartiallyVisible() {
            const rect = this.boundingClientRect();
            if (rect) {
                const { top, height } = rect;
                return top < 0 && top + height >= 0;
            }

            return false;
        }

        render() {
            // TODO: investigate why 'as any'
            return <div ref={this.ref}>
                <C {...this.props as any} />
            </div>;
        }
    };
}
