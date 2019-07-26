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

export function WithPopover({ body, popoverPlacement, theme, children }: WithPopoverProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const hide = () => setIsOpen(false);

    return <Manager>
        <Reference>
            {({ ref }) =>
                <>
                    {!isOpen ? null :
                        <div style={{
                            position: 'fixed',
                            top: 0, bottom: 0, left: 0, right: 0,
                            zIndex: -10,
                        }}
                            onClick={hide}
                        />
                    }
                    <div ref={ref} style={{ display: 'flex' }}>
                        {children(toggle)}
                    </div>
                </>
            }
        </Reference>
        <FadeIn visible={isOpen}>
            <Popper
                modifiers={{
                    offset: {
                        enabled: true,
                        fn: data => {
                            // TODO: rethink this
                            data.offsets.popper.top += 10;
                            return data;
                        },
                    },
                }}
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
                            <OverlayBox theme={theme}>
                                {body}
                            </OverlayBox>
                        </div>
                }
            </Popper>
        </FadeIn>
    </Manager >;
}
