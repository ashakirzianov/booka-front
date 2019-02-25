import * as React from 'react';

import { Comp } from './comp-utils';
import { Row, StyledText, LinkButton } from './Elements';
import { TableOfContents, TableOfContentsItem } from '../model/tableOfContent';
import { ScrollView } from 'react-native';
import { Column } from './Atoms';
import { rangeToString } from '../model';
import { navigateToBl } from '../logic';
import { nums } from '../utils';
import { Tab } from './Atoms.platform';

const TocHeader: Comp<{ text: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <StyledText style={{ fontSize: 30 }}>{props.text}</StyledText>
    </Row>;

const TocItemComp: Comp<TableOfContentsItem> = (props =>
    <Row>
        {nums(0, props.level).map(i => <Tab key={i.toString()} />)}
        <LinkButton text={props.title} onClick={() => navigateToBl(props.locator)} />
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
