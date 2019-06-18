import * as React from 'react';
import { themed, colors, Comp } from './comp-utils';
import { View, ActivityIndicator as NativeActivityIndicator } from 'react-native';
import { platformValue } from '../utils';
import { defaults } from './defaults';

export {
    BottomBar, TopBar, Modal, WithPopover,
    Clickable, Separator, LinkButton, Tab, DottedLine,
} from './Complex.platform';

export const Layer = themed(props =>
    <View style={{
        position: 'absolute',
        minHeight: '100%',
        minWidth: '100%',
        width: platformValue({ mobile: '100%' }),
        height: platformValue({ mobile: '100%' }),
        backgroundColor: colors(props).primary,
    }}>
        {props.children}
    </View>
);

export const ActivityIndicator = themed(props =>
    <NativeActivityIndicator
        size='large'
        color={colors(props).primary}
    />
);

export const FullScreenActivityIndicator: Comp = (props =>
    <View style={{
        position: 'fixed' as any,
        top: 0, left: 0,
        minHeight: '100%',
        minWidth: '100%',
        width: '100%',
        height: '100%',
        backgroundColor: defaults.semiTransparent,
        justifyContent: 'center',
        zIndex: 10,
    }}>
        <ActivityIndicator />
    </View>
);

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
