import * as React from 'react';

import { comp, VoidCallback } from './comp-utils';
import { Text } from './ThemedAtoms';
import * as Atoms from './Atoms';
import { View } from 'react-native';
import { Link } from './Atoms';

// TODO: do we really need this ?
export const Label = comp<{ text: string, margin?: string }>(props =>
    <Text style={{ margin: props.margin }} size='normal'>
        {props.text}
    </Text>,
);

export const ActivityIndicator = comp(props =>
    <Label text='Loading now...' />,
);

export const PanelLink = comp<{
    to: string,
    text: string,
}>(props =>
    <Atoms.Link to={props.to}>
        <Text>{props.text}</Text>
    </Atoms.Link>,
);

export const PanelButton = comp<{
    text: string,
    onClick: VoidCallback,
}>(props =>
    <Atoms.Button onClick={props.onClick}>
        <Text>{props.text}</Text>
    </Atoms.Button>,
);

export const StretchLink = comp<{ to: string }>(props =>
    <View style={{ flex: 1 }}>
        <Link to={props.to}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '0.3em',
            }}>
                {props.children}
            </div>
        </Link>
    </View>,
);
