import * as React from 'react';

import Popover from 'react-native-popover-view';

import { themed, Comp, Props, colors, point, percent } from './common';
import { ActionButton, PlainText, ThemedText, PanelButton } from './Elements';
import { View, SafeAreaView, TouchableWithoutFeedback, Modal as NativeModal, TouchableHighlight } from 'react-native';
import {
    ModalProps, WithPopoverProps, BarProps,
    OverlayBoxProps, ClickableProps, LinkButtonProps,
} from './Complex.common';
import { FadeIn } from './Animations.native';
import { Column, Row } from './Atoms.common';

export { Layer } from './Complex.common';

export function Modal({ open, title, toggle, children }: Props<ModalProps>) {
    return <NativeModal
        visible={open}
        animationType='slide'
        onRequestClose={toggle}
    >
        <SafeAreaView>
            <Column style={{
                width: percent(100),
            }}>
                <Row style={{
                    justifyContent: 'center',
                    height: percent(5),
                }}>
                    <Column style={{
                        justifyContent: 'center',
                        position: 'absolute',
                        left: 0,
                    }}>
                        <PanelButton
                            onClick={toggle}
                            icon='close'
                        />
                    </Column>
                    <Column style={{ justifyContent: 'center' }}>
                        <ThemedText size='normal'>{title}</ThemedText>
                    </Column>
                </Row>
                <Row style={{
                    height: percent(95),
                }}>{children}</Row>
            </Column>
        </SafeAreaView>
    </NativeModal>;
}

const viewOffset = 3.5;
export const headerHeight = 3.5;
function bar(top: boolean) {
    return themed<BarProps>(props =>
        <FadeIn visible={props.open}>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: point(headerHeight + viewOffset),
                position: 'absolute',
                top: top ? 0 : undefined,
                bottom: !top ? 0 : undefined,
                left: 0,
                zIndex: 5,
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

export const Tab: Comp = (props =>
    null
);

export const NewLine: Comp = (props => null);
export const DottedLine: Comp = (props =>
    <View style={{ alignSelf: 'stretch', alignContent: 'stretch', flex: 1 }} />
);
export const Separator: Comp = (() =>
    <View />
);

export const LinkButton = themed<LinkButtonProps>(props =>
    <ActionButton {...props}>
        <View style={{
            borderWidth: 2,
            borderStyle: 'solid',
            borderRadius: 10,
            borderColor: colors(props).accent,
            padding: point(1),
        }}>
            <PlainText style={{
                fontSize: props.theme.fontSizes.normal,
                color: colors(props).accent,
            }}>
                {props.text}
            </PlainText>
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
