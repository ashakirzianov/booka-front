import * as React from 'react';
import {
    Label, ParagraphText, Row, Column, ScreenLayout, LinkButton,
} from './Elements';
import { showAlert } from './Atoms';

export const ElementsStore: React.SFC = props => (
    <ScreenLayout color='green'>
        <ParagraphText text='Paragraph' />
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
        <Column align='center'>
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
        <LinkButton text='Link' onClick={() => showAlert('Clicked!')}/>
    </ScreenLayout>
);
