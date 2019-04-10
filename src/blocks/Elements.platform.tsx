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
    <div style={{
        flex: 1,
        // TODO: consider properly implementing dotted line
        // borderBottom: 'dotted 2px',
    }} />,
);

export const Separator = comp(() =>
    <hr style={{ width: '100%', marginTop: relative(1), marginBottom: relative(1) }} />,
);

export const LinkButton = hoverable(themed<Atoms.ActionLinkProps>(props =>
    <Atoms.ActionLink {...props}>
        <div style={{
            borderStyle: 'solid',
            borderColor: palette(props).accent,
            color: palette(props).accent,
            fontSize: props.theme.fontSize.normal,
            borderRadius: 10,
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

export const CapitalizeFirst = comp<{ text: string }>(props => {
    const text = props.text.trimStart();
    return <p>
        <span style={{
            float: 'left',
            fontSize: '400%',
            lineHeight: '80%',
        }}>
            {text[0]}
        </span>
        <span>
            {text.slice(1)}
        </span>
    </p>;
});

export const Article = comp(props =>
    <article>
        {props.children}
    </article>,
);
