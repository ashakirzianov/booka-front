import * as React from 'react';

import {
    comp, Row, ThemedText, Tab, relative,
    Column, DottedLine, ScrollView, StretchLink,
} from '../blocks';
import { bookLocator, pathToString } from '../model';
import { TableOfContents, TableOfContentsItem } from '../model/tableOfContent';
import { nums } from '../utils';
import { linkForBook } from '../logic/routing';

const TocHeader = comp<{ text: string }>(props =>
    <Row style={{ justifyContent: 'center' }}>
        <ThemedText size='large'>{props.text}</ThemedText>
    </Row>,
);

const TocItemComp = comp<TableOfContentsItem & { tabs: number }>(props =>
    <Row>
        {nums(0, props.tabs).map(i => <Tab key={i.toString()} />)}
        <StretchLink to={linkForBook(bookLocator(props.id, props.path))}>
            {props.title}
            <DottedLine />
            {props.percentage.toString()}
        </StretchLink>
    </Row>,
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
