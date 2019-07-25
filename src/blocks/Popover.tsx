import * as React from 'react';

import { PopperProps, Manager, Reference, Popper } from 'react-popper';

import { platformValue, Callback } from '../utils';
import { OverlayBox } from './OverlayBox';
import { FadeIn } from './Animations';
import { Theme } from '../model';

export type WithPopoverProps = {
    theme: Theme,
    body: React.ReactNode,
    popoverPlacement: PopperProps['placement'],
    children: (onClick: Callback<void>) => React.ReactNode,
};

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
                        <div ref={ref} style={{ display: 'flex' }}>
                            {children(this.toggleVisibility.bind(this))}
                        </div>
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
                                <OverlayBox theme={this.props.theme}>
                                    {body}
                                </OverlayBox>
                            </div>
                    }
                </Popper>
            </FadeIn>
        </Manager >;
    }
}
