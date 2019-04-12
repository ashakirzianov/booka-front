import * as React from 'react';
import { Callback, themed, ReactContent, Comp, relative, palette } from './comp-utils';
import { ThemedText, PanelLink, OverlayBox } from './Elements';
import { View } from 'react-native';
import { FadeIn } from './Animations.platform';
import { Manager, Reference, Popper, PopperProps } from 'react-popper';
import { Refable } from './comp-utils.platform';
import { Transition } from 'react-transition-group';
import { defaults } from './defaults';

const headerHeight = relative(4);

type ModalBoxProps = {
    open: boolean,
    title?: string,
    toggle: Callback<void>,
};
export const Modal: Comp<ModalBoxProps> = (props =>
    <Transition in={props.open} timeout={300}>
        {state => state === 'exited' ? null :
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                position: 'fixed',
                top: 0, bottom: 0, left: 0, right: 0,
                backgroundColor: defaults.semiTransparent,
                zIndex: 10,
                transition: `${defaults.animationDuration}ms ease-in-out`,
                opacity: state === 'entered' ? 1 : 0.01,
            }}
                onClick={props.toggle}
            >
                <OverlayBox
                    style={{
                        transitionDuration: `${defaults.animationDuration}ms`,
                        transform: state === 'entered' ? [] : [{ translateY: '100%' as any }],
                    }}
                >
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: headerHeight,
                    }}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}>
                            <View style={{
                                position: 'absolute',
                                top: 0, left: 0, bottom: 0, right: 0,
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}>
                                <PanelLink onClick={props.toggle} icon='close' />
                            </View>
                            <View style={{
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}>
                                <ThemedText>{props.title}</ThemedText>
                            </View>
                            <View />
                        </View>
                    </View>
                    <div style={{
                        alignItems: 'stretch',
                        width: '100%',
                        overflowY: 'scroll',
                        maxHeight: '90%',
                    }}>
                        {props.children}
                    </div>
                </OverlayBox>

            </div>
        }
    </Transition>
);

export const TopBar = themed<{ open: boolean }>(props =>
    <FadeIn visible={props.open}>
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
    </FadeIn >
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
            <FadeIn visible={open}>
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
            </FadeIn>
        </Manager >;
    }
}
