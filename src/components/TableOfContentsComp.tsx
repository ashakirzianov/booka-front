import * as React from 'react';

import { Comp, relative } from './comp-utils';
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
        {nums(0, props.level - 1).map(i => <Tab key={i.toString()} />)}
        <LinkButton link={linkForBook(props.locator)} style={{ margin: relative(0.1) }}>
            <Label text={props.title} margin={relative(0.1)} />
            <DottedLine />
            <Label text={props.percentage.toString()} margin={relative(0.1)} />
        </LinkButton>
    </Row>
);

export class TableOfContentsComp extends React.Component<TableOfContents> {
    public render() {
        const props = this.props;
        return <ScrollView>
            <Column style={{ margin: relative(2) }}>
                <TocHeader text={props.title} />
                {props.items.map(i => <TocItemComp key={rangeToString(i.locator.range)} {...i} />)}
            </Column>
        </ScrollView>;
    }
}
