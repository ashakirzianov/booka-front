import * as React from 'react';

import { Transition } from 'react-transition-group';
import { Props, defaults } from './common';

export type FadeInProps = {
    visible: boolean,
};
export function FadeIn(props: Props<FadeInProps>) {
    return <Animated
        in={props.visible}
        start={{ opacity: 0.01 }}
        end={{ opacity: 1 }}
    >
        {props.children}
    </Animated>;
}

type AnimationStyles = {
    opacity?: number,
    transform?: string,
};
type AnimatedProps = {
    in: boolean,
    duration?: number,
    start: AnimationStyles,
    end: AnimationStyles,
};
function Animated(props: Props<AnimatedProps>) {
    const duration = props.duration || defaults.animationDuration;
    return <Transition in={props.in} timeout={duration}>
        {state =>
            state === 'exited' ? null :
                <div style={{
                    transition: `${duration}ms ease-in-out`,
                    zIndex: 10, // NOTE: fix the glitch when fade in over the top bar
                    ...(state === 'entered' ? props.end : props.start),
                }}>
                    {props.children}
                </div>
        }
    </Transition>;
}
