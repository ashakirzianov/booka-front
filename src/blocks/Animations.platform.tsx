import * as React from 'react';

import posed, {
    PoseGroup,
} from 'react-pose';
import { Comp } from './comp-utils';

export const PopFromBottom = animateEntrance(posed.div({
    enter: {
        y: 0,
        delay: 300,
    },
    exit: {
        y: -200,
    },
}));

export const FadeIn = animateEntrance(posed.div({
    enter: {
        opacity: 1,
    },
    exit: {
        opacity: 0,
    },
}));

type AnimationChildren = React.ComponentType<any>;
class EntranceAnimation extends React.Component<{
    Animation: AnimationChildren,
}> {
    public state = { isVisible: false };

    public componentDidMount() {
        setTimeout(() => {
            this.setState({
                isVisible: true,
            });
        }, 0);
    }

    public render() {
        const { isVisible } = this.state;
        const { children, Animation } = this.props;

        return (
            <PoseGroup>
                {isVisible && <Animation key='animation'>{children}</Animation>}
            </PoseGroup>
        );
    }
}

function animateEntrance(A: AnimationChildren): React.ComponentType {
    return props => <EntranceAnimation Animation={A}>{props.children}</EntranceAnimation>;
}

const VisibilityDiv = posed.div({
    visible: {
        opacity: 1,
        transition: {
            duration: 400,
        },
    },
    hidden: {
        opacity: 0,
        transition: {
            duration: 400,
        },
    },
});

export const AnimatedVisibility: Comp<{ visible: boolean }> = (props =>
    <VisibilityDiv pose={props.visible ? 'visible' : 'hidden'}>
        {props.visible ? props.children : null}
    </VisibilityDiv>
);
