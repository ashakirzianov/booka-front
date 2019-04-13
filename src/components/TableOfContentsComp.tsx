import * as React from 'react';

import {
    Comp, Row, Tab, relative,
    Column, DottedLine, ScrollView, StretchLink,
} from '../blocks';
import { bookLocator, parsePath, locationPath } from '../model';
import { TableOfContents, TableOfContentsItem } from '../model';
import { nums } from '../utils';
import { actionCreators } from '../redux';

type TocItemProps = TableOfContentsItem & {
    tabs: number,
};
const TocItemComp: Comp<TocItemProps> = (props =>
    <Row>
        {nums(0, props.tabs).map(i => <Tab key={i.toString()} />)}
        <StretchLink action={actionCreators
            .navigateToBook(bookLocator(props.id, locationPath(props.path)))}
        >
            {props.title}
            <DottedLine />
            {props.percentage.toString()}
        </StretchLink>
    </Row>
);

export class TableOfContentsComp extends React.Component<TableOfContents> {
    public render() {
        const props = this.props;
        const maxLevel = props.items.reduce((max, i) => Math.max(max, i.level), 0);
        return <ScrollView>
            <Column style={{ margin: relative(2) }}>
                {props.items.map(i =>
                    <TocItemComp key={parsePath(i.path)} tabs={maxLevel - i.level} {...i} />)}
            </Column>
        </ScrollView>;
    }
}
