import * as React from 'react';
import { Text, TextCallbacks } from './Atoms';
import { Comp } from './comp-utils';
import { TextProps } from './Atoms';
import { Tab, Link } from './Atoms.platform';

export const ActivityIndicator: Comp = props =>
    <Label text='Loading now...' />;

export const defaultStyle: TextProps['style'] = {
    fontFamily: 'Georgia',
    color: '#999999',
    fontSize: 26,
};

export const StyledText: Comp<TextProps, TextCallbacks> = props =>
    <Text
        {...props}
        style={{ ...defaultStyle, ...props.style }}
    >{props.children}</Text>;

export const Label: Comp<{ text: string }> = props =>
    <StyledText>&nbsp;&nbsp;&nbsp;&nbsp;{props.text}</StyledText>;

export const ParagraphText: Comp<{ text: string }> = props =>
    <StyledText style={{
        textAlign: 'justify',
        foo: 'foo', // TODO: why excessive property check doesn't work here ?
    }}><Tab />{props.text}</StyledText>;

export const LinkButton: Comp<{
    text: string,
    link: string,
}> = props =>
        <Link
            text={props.text}
            to={props.link}
            style={defaultStyle}
        />;

export {
    Column, Row, FullScreen as ScreenLayout, ScrollView,
} from './Atoms';

export class IncrementalLoad extends React.Component<{
    increment: number,
    timeout?: number,
}, {
    count: number,
}> {
    public state = { count: this.props.increment };

    public componentWillMount() {
        this.handleIncrement();
    }

    public handleIncrement() {
        const { children } = this.props;
        const childrenCount = Array.isArray(children) ? children.length : 0;
        if (this.state.count < childrenCount) {
            this.setState({
                count: this.state.count + (this.props.increment),
            });
            setTimeout(() => this.handleIncrement(), (this.props.timeout || 500));
        }
    }

    public render() {
        const { children } = this.props;
        if (Array.isArray(children) && children.length > this.state.count) {
            return children.slice(0, this.state.count);
        } else {
            return children;
        }
    }
}
