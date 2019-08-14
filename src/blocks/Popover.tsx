import * as React from 'react';

import { PopperProps, Manager, Reference, Popper } from 'react-popper';

import { platformValue, Callback } from '../utils';
import { OverlayBox } from './OverlayBox';
import { FadeIn } from './Animations';
import { Theme } from '../model';

export type PopoverBodyParams = {
    scheduleUpdate: Callback,
};
export type WithPopoverProps = {
    theme: Theme,
    body: React.ReactNode | ((params: PopoverBodyParams) => React.ReactNode),
    popoverPlacement: PopperProps['placement'],
    children: (onClick: Callback<void>) => React.ReactNode,
    open?: boolean,
};

export function WithPopover({ body, popoverPlacement, theme, children, open }: WithPopoverProps) {
    const [isOpen, setIsOpen] = React.useState(open || false);
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
                placement={popoverPlacement}
                positionFixed={platformValue({
                    firefox: true,
                    default: false,
                })}
            >
                {
                    ({ ref, style, placement, scheduleUpdate }) =>
                        <div ref={ref} style={{
                            ...style,
                        }} data-placement={placement}>
                            {/* TODO: add arrows */}
                            <OverlayBox theme={theme}>
                                {
                                    typeof body === 'function'
                                        ? body({ scheduleUpdate })
                                        : body
                                }
                            </OverlayBox>
                        </div>
                }
            </Popper>
        </FadeIn>
    </Manager >;
}
