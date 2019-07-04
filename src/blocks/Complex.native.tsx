import * as React from 'react';

import { themed, Comp, Props, colors, point } from './common';
import { ActionableProps, ActionButton } from './Elements';
import { View, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import {
    ModalProps, WithPopoverProps, BarProps,
    OverlayBoxProps, ClickableProps,
} from './Complex.common';
import { FadeIn } from './Animations.native';

export { Layer } from './Complex.common';

// TODO: implement components below

export function Modal(props: Props<ModalProps>) {
    return <View>
        {props.children}
    </View>;
}

const headerHeight = point(7);
function bar(top: boolean) {
    return themed<BarProps>(props =>
        <FadeIn visible={props.open}>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: headerHeight,
                position: 'absolute',
                top: top ? 0 : undefined,
                bottom: !top ? 0 : undefined,
                left: 0,
                zIndex: 5,
                // boxShadow: `0px 0px 2px ${colors(props).shadow}`,
                backgroundColor: colors(props).secondary,
            }}>
                <SafeAreaView>
                    {props.children}
                </SafeAreaView>
            </View >
        </FadeIn>
    );
}

export const TopBar = bar(true);
export const BottomBar = bar(false);

type WithPopoverState = {
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
        const { children } = this.props;
        return <View>
            {children(this.toggleVisibility.bind(this))}
        </View>;
    }
}

export const Tab: Comp = (props =>
    null
);

export const NewLine: Comp = (props => null);
export const DottedLine: Comp = (props =>
    <View />
);
export const Separator: Comp = (() =>
    <View />
);

export const LinkButton = themed<ActionableProps>(props =>
    <ActionButton {...props}>
        <View style={{
            borderStyle: 'solid',
            borderColor: colors(props).accent,
            color: colors(props).accent,
            fontSize: props.theme.fontSizes.normal,
            borderRadius: 10,
            padding: point(0.3), // TODO: extract somewhere ?
        }}>
            {props.children}
        </View>
    </ActionButton>
);

export const Clickable: Comp<ClickableProps> = (props =>
    <TouchableWithoutFeedback
        onPress={props.onClick}
    >
        <View>
            {props.children}
        </View>
    </TouchableWithoutFeedback>
);

export const OverlayBox = themed<OverlayBoxProps>(props =>
    <View>{props.children}</View>
);
