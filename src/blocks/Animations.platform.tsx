import * as React from 'react';

import { Transition } from 'react-transition-group';
import { comp } from './comp-utils';

export type AnimatedVisibilityProps = {
    visible: boolean,
    duration?: number,
};
export const FadeIn = comp<AnimatedVisibilityProps>(props => {
    const duration = props.duration || 300;
    return <Transition in={props.visible} timeout={duration}>
        {state =>
            state === 'exited' ? null :
                <div style={{
                    transition: `opacity ${duration}ms ease-in-out`,
                    opacity: state === 'entered' ? 1 : 0.01,
                    zIndex: 10, // NOTE: fix the glitch when fade in over the top bar
                }}>
                    {props.children}
                </div>
        }
    </Transition>;
});
