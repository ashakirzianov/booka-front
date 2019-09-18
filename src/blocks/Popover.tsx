import * as React from 'react';
import { PopperProps, Manager, Reference, Popper } from 'react-popper';
import { Callback } from 'booka-common';

import { platformValue } from '../utils';
import { OverlayBox } from './OverlayBox';
import { FadeIn } from './Animations';
import { Theme } from '../model';

export type PopoverBodyParams = {
    scheduleUpdate: Callback<void>,
};
export type WithPopoverProps = {
    theme: Theme,
    children: React.ReactNode,
    body: React.ReactNode | ((params: PopoverBodyParams) => React.ReactNode),
    popoverPlacement: PopperProps['placement'],
    open?: boolean,
};

export function WithPopover({ body, popoverPlacement, theme, children, open }: WithPopoverProps) {
    const [isOpen, setIsOpen] = React.useState(open || false);
    let isInBody = false;

    return <Manager>
        <Reference>
            {({ ref }) =>
                <>
                    <div
                        ref={ref}
                        style={{ display: 'flex' }}
                        onMouseEnter={() => {
                            setIsOpen(true);
                        }}
                        onMouseLeave={() => {
                            setTimeout(() => {
                                if (!isInBody) {
                                    setIsOpen(false);
                                }
                            });
                        }}
                    >
                        {children}
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
                        }}
                            data-placement={placement}
                            onMouseOver={() => {
                                isInBody = true;
                            }}
                            onMouseLeave={() => {
                                isInBody = false;
                                setIsOpen(false);
                            }}
                        >
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
