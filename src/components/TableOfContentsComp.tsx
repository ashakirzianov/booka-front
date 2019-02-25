import * as React from 'react';

import { Comp } from './comp-utils';
import { Row, StyledText } from './Elements';
import { TableOfContents, TableOfContentsItem } from '../model/tableOfContent';
import { ScrollView } from 'react-native';
import { Column } from './Atoms';
import { rangeToString } from '../model';

const TocHeader: Comp<{ text: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <StyledText style={{ fontSize: 30 }}>{props.text}</StyledText>
    </Row>;

const TocItemComp: Comp<TableOfContentsItem> = (props =>
    <Row>
        <StyledText>{props.title}</StyledText>
    </Row>
);

export const TableOfContentsComp: Comp<TableOfContents> = (props =>
    <ScrollView>
        <Column>
            <TocHeader text={props.title} />
            {props.items.map(i => <TocItemComp key={rangeToString(i.locator.range)} {...i} />)}
        </Column>
    </ScrollView>
);
