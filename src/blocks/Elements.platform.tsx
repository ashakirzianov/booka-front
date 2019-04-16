import * as React from 'react';

import * as Atoms from './Atoms';
import { themed, Comp, relative, hoverable, colors } from './comp-utils';
import { View, ViewStyle } from 'react-native';

export const Tab: Comp = (props =>
    <span>&nbsp;&nbsp;</span>
);

export const NewLine: Comp = (props => <br />);

export const DottedLine: Comp = (props =>
    <div style={{
        flex: 1,
        // TODO: consider properly implementing dotted line
        // borderBottom: 'dotted 2px',
    }} />
);

export const Separator: Comp = (() =>
    <hr style={{ width: '100%', marginTop: relative(1), marginBottom: relative(1) }} />
);

export const LinkButton = hoverable(themed<Atoms.ActionLinkProps>(props =>
    <Atoms.ActionLink {...props}>
        <div style={{
            borderStyle: 'solid',
            borderColor: colors(props).accent,
            color: colors(props).accent,
            fontSize: props.theme.fontSize.normal,
            borderRadius: 10,
            padding: relative(0.3), // TODO: extract somewhere ?
            [':hover']: {
                borderColor: colors(props).highlight,
                color: colors(props).highlight,
            },
        }}>
            {props.children}
        </div>
    </Atoms.ActionLink>
));

export const Clickable: Comp<{ onClick: () => void }> = (props =>
    <div onClick={props.onClick}>
        {props.children}
    </div>
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
        backgroundColor: colors(props).secondary,
        width: '100%',
        maxWidth: '50em',
        maxHeight: '100%',
        margin: '0 auto',
        zIndex: 10,
        borderRadius: props.theme.radius,
        boxShadow: `0px 0px 10px ${colors(props).shadow}`,
        padding: relative(1),
        ...props.style as any,
    }}
    >
        {props.children}
    </View>
);

export const Article: Comp = (props =>
    <article>
        {props.children}
    </article>
);
