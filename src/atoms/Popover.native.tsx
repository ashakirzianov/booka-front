import * as React from 'react';
import { View, TouchableHighlight } from 'react-native';
import Popover from 'react-native-popover-view';

import { WithPopoverProps } from './Popover';

export function WithPopover({ children, body }: WithPopoverProps) {
    const [open, setOpen] = React.useState(false);
    function toggle() {
        setOpen(!open);
    }

    const button = React.useRef(null);

    return <View>
        <TouchableHighlight ref={button}>
            {children}
        </TouchableHighlight>
        <Popover
            isVisible={open}
            fromView={button.current}
            placement='bottom'
            onRequestClose={toggle}
        >
            {body}
        </Popover>
    </View>;
}
