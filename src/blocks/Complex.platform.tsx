import * as React from 'react';
import { Callback, themed, ReactContent, comp, relative, palette } from './comp-utils';
import { Text, PanelLink, OverlayBox } from './Elements';
import { View } from 'react-native';
import { AnimatedVisibility } from './Animations.platform';
import { Manager, Reference, Popper, PopperProps } from 'react-popper';
import { Refable } from './comp-utils.platform';

const headerHeight = relative(4);

type ModalBoxProps = {
    open: boolean,
    title?: string,
    toggle: Callback<any>,
};
export const Modal = comp<ModalBoxProps>(props =>
    <AnimatedVisibility visible={props.open}>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            position: 'fixed',
            top: 0, bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 10,
        }}
            onClick={props.toggle}
        >
            <OverlayBox>
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: headerHeight,
                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                    }}>
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}>
                            <PanelLink action={props.toggle} icon='close' />
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}>
                            <Text>{props.title}</Text>
                        </View>
                        <View />
                    </View>
                </View>
                <View style={{
                    overflowY: 'scroll',
                    maxHeight: '90%',
                }}>
                    {props.children}
                </View>
            </OverlayBox>
        </div>
    </AnimatedVisibility>,
);

export const TopBar = themed<{ open: boolean }>(props =>
    <AnimatedVisibility visible={props.open}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            height: headerHeight,
            position: 'fixed',
            top: 0, left: 0,
            zIndex: 5,
            boxShadow: `0px 0px 2px ${palette(props).shadow}`,
            backgroundColor: palette(props).secondary,
        }}>
            {props.children}
        </div >
    </AnimatedVisibility >,
);

export type WithPopoverProps = {
    body: ReactContent,
    placement: PopperProps['placement'],
    children: (onClick: Callback<void>) => ReactContent,
};
export type WithPopoverState = {
    open: boolean,
};
export class WithPopover extends React.Component<WithPopoverProps, WithPopoverState> {
    public state = { open: false };

    public toggleVisibility = () => {
        this.setState({ open: !this.state.open });
    }

    public hide = () => this.setState({ open: false });

    public render() {
        const props = this.props;
        const { open } = this.state;
        return <Manager>
            <Reference>
                {({ ref }) =>
                    <>
                        {!open ? null :
                            <div style={{
                                position: 'fixed',
                                top: 0, bottom: 0, left: 0, right: 0,
                                zIndex: -10,
                            }}
                                onClick={this.hide}
                            />
                        }
                        <Refable ref={ref}>
                            {props.children(this.toggleVisibility)}
                        </Refable>
                    </>
                }
            </Reference>
            <AnimatedVisibility visible={open}>
                <Popper placement={props.placement}>
                    {
                        ({ ref, style, placement }) =>
                            <div ref={ref} style={{
                                ...style,
                            }} data-placement={placement}>
                                {/* TODO: add arrows */}
                                <OverlayBox>
                                    {props.body}
                                </OverlayBox>
                            </div>
                    }
                </Popper>
            </AnimatedVisibility>
        </Manager >;
    }
}
