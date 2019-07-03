import * as React from 'react';
import { themed, Comp, percent, colors, Props, point } from './common';
import { ThemedText, PanelButton, ActionableProps, ActionLink } from './Elements';
import { View } from 'react-native';
import { FadeIn } from './Animations';
import { Manager, Reference, Popper } from 'react-popper';
import { Refable } from './utils';
import { Transition } from 'react-transition-group';
import { defaults } from './defaults';
import { platformValue } from '../utils';
import {
    ModalProps, WithPopoverProps, BarProps,
    OverlayBoxProps, ClickableProps,
} from './Complex.common';

export { Layer } from './Complex.common';

export function Modal(props: Props<ModalProps>) {
    return <Transition in={props.open} timeout={300}>
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
                                <PanelButton onClick={props.toggle} icon='close' />
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
    </Transition>;
}

const headerHeight = point(3);

function bar(top: boolean) {
    return themed<BarProps>(props =>
        <FadeIn visible={props.open}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: headerHeight,
                position: 'fixed',
                top: top ? 0 : undefined,
                bottom: !top ? 0 : undefined,
                left: 0,
                zIndex: 5,
                boxShadow: `0px 0px 2px ${colors(props).shadow}`,
                backgroundColor: colors(props).secondary,
            }}>
                {props.children}
            </div >
        </FadeIn >
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
        const { body, popoverPlacement, children } = this.props;
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
                                onClick={this.hide.bind(this)}
                            />
                        }
                        <Refable ref={ref}>
                            {children(this.toggleVisibility.bind(this))}
                        </Refable>
                    </>
                }
            </Reference>
            <FadeIn visible={open}>
                <Popper
                    placement={popoverPlacement}
                    positionFixed={platformValue({
                        firefox: true,
                        default: false,
                    })}
                >
                    {
                        ({ ref, style, placement }) =>
                            <div ref={ref} style={{
                                ...style,
                            }} data-placement={placement}>
                                {/* TODO: add arrows */}
                                <OverlayBox>
                                    {body}
                                </OverlayBox>
                            </div>
                    }
                </Popper>
            </FadeIn>
        </Manager >;
    }
}

export const Tab: Comp = (props =>
    <span>&nbsp;&nbsp;</span>
);

export const NewLine: Comp = (props => <br />);

export const DottedLine: Comp = (props =>
    <div style={{
        flex: 1,
        // TODO: consider properly implementing dotted line
        // borderBottom: 'dotted 2px',
    }} />
);

export const Separator: Comp = (() =>
    <hr style={{
        width: percent(100),
        marginTop: point(1),
        marginBottom: point(1),
    }} />
);

export const LinkButton = themed<ActionableProps>(props =>
    <ActionLink {...props}>
        <div style={{
            borderStyle: 'solid',
            borderColor: colors(props).accent,
            color: colors(props).accent,
            fontSize: props.theme.fontSizes.normal,
            borderRadius: 10,
            padding: point(0.3), // TODO: extract somewhere ?
            ':hover': {
                borderColor: colors(props).highlight,
                color: colors(props).highlight,
            },
        }}>
            {props.children}
        </div>
    </ActionLink>
);

export const Clickable: Comp<ClickableProps> = (props =>
    <div onClick={props.onClick}>
        {props.children}
    </div>
);

export const OverlayBox = themed<OverlayBoxProps>(props =>
    <View style={{
        alignSelf: 'center',
        backgroundColor: colors(props).secondary,
        width: percent(100),
        maxWidth: point(50),
        maxHeight: percent(100),
        margin: '0 auto',
        zIndex: 10,
        borderRadius: props.theme.radius,
        boxShadow: `0px 0px 10px ${colors(props).shadow}`,
        padding: point(1),
        ...props.style as any,
    }}
    >
        <div onClick={e => e.stopPropagation()}>
            {props.children}
        </div>
    </View>
);
