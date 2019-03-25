import * as React from 'react';

import {
    Comp, Row, StyledText, Tab, LinkButton, relative, Label,
    Column, DottedLine, ScrollView,
} from '../blocks';
import { bookLocator, pathToString } from '../model';
import { TableOfContents, TableOfContentsItem } from '../model/tableOfContent';
import { nums } from '../utils';
import { linkForBook } from '../logic/routing';

const TocHeader: Comp<{ text: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <StyledText style={{ fontSize: 30 }}>{props.text}</StyledText>
    </Row>;

const TocItemComp: Comp<TableOfContentsItem & { tabs: number }> = (props =>
    <Row>
        {nums(0, props.tabs).map(i => <Tab key={i.toString()} />)}
        <LinkButton stretch
            link={linkForBook(bookLocator(props.id, props.path))}
            style={{ margin: relative(0.1) }}
        >
            <Label text={props.title} margin={relative(0.1)} />
            <DottedLine />
            <Label text={props.percentage.toString()} margin={relative(0.1)} />
        </LinkButton>
    </Row>
);

export class TableOfContentsComp extends React.Component<TableOfContents> {
    public render() {
        const props = this.props;
        const maxLevel = props.items.reduce((max, i) => Math.max(max, i.level), 0);
        return <ScrollView>
            <Column style={{ margin: relative(2) }}>
                <TocHeader text={props.title} />
                {props.items.map(i =>
                    <TocItemComp key={pathToString(i.path)} tabs={maxLevel - i.level} {...i} />)}
            </Column>
        </ScrollView>;
    }
}
