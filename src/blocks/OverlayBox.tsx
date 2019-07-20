import * as React from 'react';
import { Props, percent, point } from './common';
import { Themeable, colors } from './connect';
import { Column } from './Layout';
import { defaults } from './defaults';

export type OverlayBoxProps = {
    animation?: {
        entered: boolean,
    },
};
export function OverlayBox(props: Props<Themeable<OverlayBoxProps>>) {
    return <Column style={{
        alignSelf: 'center',
        backgroundColor: colors(props).secondary,
        width: percent(100),
        maxWidth: point(50),
        maxHeight: percent(100),
        margin: '0 auto',
        borderRadius: props.theme.radius,
        padding: point(1),
        ...({
            boxShadow: `0px 0px 10px ${colors(props).shadow}`,
            zIndex: 10,
        } as {}),
        ...(props.animation && {
            transitionDuration: `${defaults.animationDuration}ms`,
            transform: props.animation.entered ? [] : [{ translateY: '100%' as any }],
        }),
    }}
    >
        <div onClick={e => e.stopPropagation()}>
            {props.children}
        </div>
    </Column>;
}
