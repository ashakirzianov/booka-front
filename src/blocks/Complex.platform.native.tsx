import * as React from 'react';
import { Callback, themed, ReactContent, Comp, relative, colors } from './comp-utils';
import { View } from 'react-native';
import { FadeIn } from './Animations.platform';
import { PopperProps } from 'react-popper';

const headerHeight = relative(3);

// TODO: implement
type ModalBoxProps = {
    open: boolean,
    title?: string,
    toggle: Callback<void>,
};
export const Modal: Comp<ModalBoxProps> = (props =>
    <View>{props.children}</View>
);

// TODO: implement
function bar(top: boolean) {
    return themed<{ open: boolean }>(props =>
        props.open
            ? <View>{props.children}</View>
            : null
    );
}

export const TopBar = bar(true);
export const BottomBar = bar(false);

export type WithPopoverProps = {
    body: ReactContent,
    placement: PopperProps['placement'],
    children: (onClick: Callback<void>) => ReactContent,
};

// TODO: implement
export type WithPopoverState = {
    open: boolean,
};
export class WithPopover extends React.Component<WithPopoverProps, WithPopoverState> {
    public state = { open: false };

    public toggleVisibility() {
        this.setState({ open: !this.state.open });
    }

    public hide() {
        this.setState({ open: false });
    }

    public render() {
        const props = this.props;
        return <View>
            {props.children}
        </View>;
    }
}
