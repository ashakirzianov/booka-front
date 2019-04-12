import * as React from 'react';

import { Transition } from 'react-transition-group';
import { Comp } from './comp-utils';
import { defaults } from './defaults';

export type FadeInProps = {
    visible: boolean,
};
export const FadeIn: Comp<FadeInProps> = (props =>
    <Animated
        in={props.visible}
        start={{ opacity: 0.01 }}
        end={{ opacity: 1 }}
    >
        {props.children}
    </Animated>);

export class FadeOnMount extends React.Component<{}, { in: boolean }> {
    public state = { in: false };

    public componentDidMount() {
        this.fadeIn();
    }

    public fadeIn() {
        if (!this.state.in) {
            this.setState({ in: true });
        }
    }

    public render() {
        return <FadeIn visible={this.state.in}>
            {this.props.children}
        </FadeIn>;
    }
}

export const PopUp: Comp<{ in: boolean }> = (props =>
    <Animated
        in={props.in}
        start={{ transform: 'translate(0%, 100%)', opacity: 0.01 }}
        end={{ transform: 'translate(0%, 0%)', opacity: 1 }}
    >
        {props.children}
    </Animated>
);

export type AnimationStyles = {
    opacity?: number,
    transform?: string,
};
export type AnimatedProps = {
    in: boolean,
    duration?: number,
    start: AnimationStyles,
    end: AnimationStyles,
};
export const Animated: Comp<AnimatedProps> = (props => {
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
});
