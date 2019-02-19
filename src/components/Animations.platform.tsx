import * as React from 'react';

import posed, {
    PoseGroup,
} from 'react-pose';

const PopFromBottomDiv = posed.div({
    enter: {
        y: 0,
        opacity: 1,
        delay: 300,
    },
    exit: {
        y: 200,
        opacity: 0,
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
            { isVisible && <Animation key='animation'>{children}</Animation> }
          </PoseGroup>
        );
      }
}

function animateEntrance(A: AnimationChildren): React.ComponentType {
    return props => <EntranceAnimation Animation={A}>{props.children}</EntranceAnimation>;
}

export const PopFromBottom = animateEntrance(PopFromBottomDiv);
