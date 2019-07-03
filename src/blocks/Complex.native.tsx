import * as React from 'react';

import { themed, Comp, Props, colors } from './common';
import { ActionableProps } from './Elements';
import { View, SafeAreaView } from 'react-native';
import {
    ModalProps, WithPopoverProps, BarProps,
    OverlayBoxProps, ClickableProps,
} from './Complex.common';

export { Layer } from './Complex.common';

// TODO: implement components below

export function Modal(props: Props<ModalProps>) {
    return <View>
        {props.children}
    </View>;
}

const headerHeight = 80;
function bar(top: boolean) {
    return themed<BarProps>(props =>
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
    <View>{props.children}</View>
);

export const Clickable: Comp<ClickableProps> = (props =>
    <View
        onTouchEnd={props.onClick}
    >
        {props.children}
    </View>
);

export const OverlayBox = themed<OverlayBoxProps>(props =>
    <View>{props.children}</View>
);
