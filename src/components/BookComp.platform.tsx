import * as React from 'react';

type Path = number[];
type ScrollableUnitProps = { 
    onScrollVisible: () => void,
    path: Path,
};
class ScrollableUnit extends React.Component<ScrollableUnitProps> {
    readonly ref: React.RefObject<HTMLDivElement>;
    constructor(props: ScrollableUnitProps) {
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
            this.props.onScrollVisible();
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
            return top <= 0 && top + height >= 0;
        }

        return false;
    }

    render() {
        return <div ref={this.ref} id={keyForPath(this.props.path)}>
            {this.props.children}
        </div>;
    }
}

export function scrollableUnit<T>(C: React.ComponentType<T>) {
    type ExtendedProps = T & ScrollableUnitProps;
    return (props: ExtendedProps) =>
        <ScrollableUnit
            onScrollVisible={props.onScrollVisible}
            path={props.path}
        ><C {...props}/></ScrollableUnit>;
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

export function didUpdateHook<T>(C: React.ComponentType<T>) {
    type Props = T & { didUpdate: () => void };
    return class WithOnDisplay extends React.Component<Props> {
        componentDidUpdate() {
            this.props.didUpdate();
        }

        render() {
            return <C {...this.props } />;
        }
    };
}
