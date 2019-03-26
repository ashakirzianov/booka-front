import * as React from 'react';
import {
    Label,
} from './Elements';
import { FullScreen, Row, Column } from './Atoms';

export const ElementsStore: React.SFC = props => (
    <FullScreen color='green'>
        <Row>
            <Column>
                <Label text='R 1 C 1' />
                <Label text='R 2 C 1' />
                <Label text='R 3 C 1' />
            </Column>
            <Column>
                <Label text='R 1 C 2' />
                <Label text='R 2 C 2' />
                <Label text='R 3 C 2' />
            </Column>
        </Row>
        <Column style={{ alignItems: 'center' }}>
            <Row>
                <Label text='R 1 C 1' />
                <Label text='R 1 C 2' />
                <Label text='R 1 C 3' />
            </Row>
            <Row>
                <Label text='R 2 C 1' />
                <Label text='R 2 C 2' />
                <Label text='R 2 C 3' />
            </Row>
        </Column>
    </FullScreen>
);
