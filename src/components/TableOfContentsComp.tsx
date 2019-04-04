import * as React from 'react';

import {
    comp, Row, Tab, relative,
    Column, DottedLine, ScrollView, StretchLink,
} from '../blocks';
import { bookLocator, pathToString, noForBl } from '../model';
import { TableOfContents, TableOfContentsItem } from '../model/tableOfContent';
import { nums } from '../utils';
import { actionCreators } from '../redux/actions';

const TocItemComp = comp<TableOfContentsItem & { tabs: number }>(props =>
    <Row>
        {nums(0, props.tabs).map(i => <Tab key={i.toString()} />)}
        <StretchLink action={actionCreators.navigate(noForBl(bookLocator(props.id, props.path)))}>
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
                {props.items.map(i =>
                    <TocItemComp key={pathToString(i.path)} tabs={maxLevel - i.level} {...i} />)}
            </Column>
        </ScrollView>;
    }
}
