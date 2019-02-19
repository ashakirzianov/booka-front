import * as React from 'react';

import posed, {
    PoseGroup,
} from 'react-pose';
import { Comp } from './comp-utils';

const PopFromBottomDiv = posed.div({
    enter: {
        y: 0,
        delay: 300,
    },
    exit: {
        y: -200,
    }
});

type AnimationChildren = React.ComponentType<any>;
class EntranceAnimation extends React.Component<{
    Animation: AnimationChildren,
}> {
    state = { isVisible: false };

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isVisible: true,
            });
        }, 0);
    }

    render() {
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

export const PopFromBottom = animateEntrance(PopFromBottomDiv);

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
        {props.children}
    </VisibilityDiv>
);
