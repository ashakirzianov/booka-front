import * as React from 'react';

import { Comp } from './comp-utils';
import { Row, StyledText, LinkButton, Label } from './Elements';
import { TableOfContents, TableOfContentsItem } from '../model/tableOfContent';
import { ScrollView } from 'react-native';
import { Column, DottedLine } from './Atoms';
import { rangeToString } from '../model';
import { nums } from '../utils';
import { Tab } from './Atoms.platform';
import { linkForBook } from '../logic/routing';

const TocHeader: Comp<{ text: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <StyledText style={{ fontSize: 30 }}>{props.text}</StyledText>
    </Row>;

const TocItemComp: Comp<TableOfContentsItem> = (props =>
    <Row>
        {nums(0, props.level).map(i => <Tab key={i.toString()} />)}
        <LinkButton link={linkForBook(props.locator)} >
            <Label text={props.title} />
            <DottedLine />
            <Label text={props.percentage.toString()} />
        </LinkButton>
    </Row>
);

export class TableOfContentsComp extends React.Component<TableOfContents> {
    public render() {
        const props = this.props;
        return <ScrollView>
            <Column>
                <TocHeader text={props.title} />
                {props.items.map(i => <TocItemComp key={rangeToString(i.locator.range)} {...i} />)}
            </Column>
        </ScrollView>;
    }
}
