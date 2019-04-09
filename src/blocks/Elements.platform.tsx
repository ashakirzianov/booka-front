import * as React from 'react';

import * as Atoms from './Atoms';
import { themed, comp, relative, hoverable, palette } from './comp-utils';
import { View, ViewStyle } from 'react-native';

export const Inline = comp(props =>
    <div style={{ display: 'inline' }}>{props.children}</div>,
);

export const NewLine = comp(props => <br />);

export const Tab = comp(props =>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>,
);

export const DottedLine = comp(props =>
    <div key='aaa' style={{
        flex: 1,
        borderBottom: 'dotted 0.2em',
    }} />,
);

export const Separator = comp(() =>
    <hr style={{ width: '100%', marginTop: relative(1), marginBottom: relative(1) }} />,
);

export const LinkButton = hoverable(themed<Atoms.ActionLinkProps>(props =>
    <Atoms.ActionLink {...props}>
        <div style={{
            border: 'solid',
            borderColor: palette(props).accent,
            color: palette(props).accent,
            fontSize: props.theme.fontSize.normal,
            borderRadius: props.theme.radius,
            padding: relative(0.3), // TODO: extract somewhere ?
            [':hover']: {
                borderColor: palette(props).highlight,
                color: palette(props).highlight,
            },
        }}>
            {props.children}
        </div>
    </Atoms.ActionLink>,
));

export const Clickable = comp<{ onClick: () => void }>(props =>
    <div onClick={props.onClick}>
        {props.children}
    </div>,
);

export type OverlayBoxProps = {
    style?: Pick<ViewStyle,
        'transform'
    > & {
        transitionDuration?: string,
    },
};
export const OverlayBox = themed<OverlayBoxProps>(props =>
    <View style={{
        alignSelf: 'center',
        backgroundColor: palette(props).secondary,
        width: '100%',
        maxWidth: '50em',
        maxHeight: '100%',
        margin: '0 auto',
        zIndex: 10,
        borderRadius: props.theme.radius,
        boxShadow: `0px 0px 10px ${palette(props).shadow}`,
        padding: relative(1),
        ...props.style as any,
    }}
    >
        {props.children}
    </View>,
);
