import * as React from 'react';

import { PopperProps, Manager, Reference, Popper } from 'react-popper';

import { platformValue } from '../utils';
import { OverlayBox } from './OverlayBox';
import { ReactContent, Callback } from './common';
import { Themeable, themed } from './connect';
import { FadeIn } from './Animations';

export type WithPopoverProps = {
    body: ReactContent,
    popoverPlacement: PopperProps['placement'],
    children: (onClick: Callback<void>) => ReactContent,
};

type WithPopoverState = {
    open: boolean,
};
class WithPopoverC extends React.Component<Themeable<WithPopoverProps>, WithPopoverState> {
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
export const WithPopover = themed(WithPopoverC);
