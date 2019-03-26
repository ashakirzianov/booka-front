import * as React from 'react';

export class IncrementalLoad extends React.Component<{
    increment?: number,
    initial?: number,
    timeout?: number,
    skip?: number,
}, {
    count: number,
}> {
    public state = this.initialState();
    public initialState() {
        return {
            count: this.props.initial !== undefined ? this.props.initial : this.props.increment || 10,
        };
    }

    public componentDidMount() {
        this.setState(this.initialState());
        this.handleIncrement();
    }

    public handleIncrement() {
        const { children, increment, timeout } = this.props;
        const { count } = this.state;
        const childrenCount = Array.isArray(children) ? children.length : 0;
        if (count < childrenCount) {
            this.setState({
                count: count + (increment || 10),
            });
            setTimeout(() => this.handleIncrement(), (timeout || 500));
        }
    }

    public render() {
        const { children, skip } = this.props;
        const { count } = this.state;
        if (Array.isArray(children) && children.length > count) {
            const start = skip && skip > count ? skip - count : 0;
            const end = (skip || 0) + count;
            return children.slice(start, end);
        } else {
            return children;
        }
    }
}
