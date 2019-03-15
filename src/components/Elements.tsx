import * as React from 'react';
import * as Atoms from './Atoms';
import { Comp, Callback } from './comp-utils';

export {
    Column, Row, FullScreen, ScrollView, ModalBox,
} from './Atoms';

export const ActivityIndicator: Comp = props =>
    <Label text='Loading now...' />;

export const defaultStyle: Atoms.TextProps['style'] = {
    fontFamily: 'Georgia',
    color: '#999999',
    fontSize: 26,
};

export const StyledText: Comp<Atoms.TextProps, Atoms.TextCallbacks> = props =>
    <Atoms.Text
        {...props}
        style={{ ...defaultStyle, ...props.style }}
    >{props.children}</Atoms.Text>;

export const Label: Comp<{ text: string }> = props =>
    <StyledText>&nbsp;&nbsp;&nbsp;&nbsp;{props.text}</StyledText>;

export const ParagraphText: Comp<{ text: string }> = props =>
    <StyledText style={{
        textAlign: 'justify',
        foo: 'foo', // TODO: why excessive property check doesn't work here ?
    }}><Atoms.Tab />{props.text}</StyledText>;

export const LinkButton: Comp<{
    text?: string,
    link: string,
}> = props =>
        <Atoms.Link
            text={props.text}
            to={props.link}
            style={defaultStyle}
        >{props.children}</Atoms.Link>;

export const ActionButton: Comp<{
    text: string,
    onClick: Callback<void>,
}> = props =>
        <Atoms.ActionButton
            text={props.text}
            onClick={props.onClick}
            style={defaultStyle}
        />;

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
