import * as React from 'react';

import Popover from 'react-native-popover-view';

import { View, TouchableHighlight } from 'react-native';
import { WithPopoverProps } from './Popover';

type WithPopoverState = {
    open: boolean,
};
export class WithPopover extends React.Component<WithPopoverProps, WithPopoverState> {
    public state = { open: false };
    private button: any = undefined;

    public toggleVisibility() {
        this.setState({ open: !this.state.open });
    }

    public hide() {
        this.setState({ open: false });
    }

    public render() {
        const { open } = this.state;
        const { children, body } = this.props;
        return <View>
            <TouchableHighlight ref={ref => this.button = ref}>
                {children(this.toggleVisibility.bind(this))}
            </TouchableHighlight>
            <Popover
                isVisible={open}
                fromView={this.button}
                placement='bottom'
                onRequestClose={this.toggleVisibility.bind(this)}
            >
                {body}
            </Popover>
        </View>;
    }
}
