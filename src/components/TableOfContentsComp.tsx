import * as React from 'react';

import {
    Comp, Row, Tab, relative,
    Column, DottedLine, ScrollView, StretchLink,
} from '../blocks';
import { bookLocator, locationPath, BookId } from '../model';
import { TableOfContents, TableOfContentsItem } from '../model';
import { nums } from '../utils';
import { actionCreators } from '../redux';

type TocItemProps = TableOfContentsItem & {
    tabs: number,
    id: BookId,
};
const TocItemComp: Comp<TocItemProps> = (props =>
    <Row>
        {nums(0, props.tabs).map(i => <Tab key={i.toString()} />)}
        <StretchLink action={actionCreators
            .navigateToBook(bookLocator(props.id, locationPath(props.path)))}
        >
            {props.title}
            <DottedLine />
            {props.pageNumber.toString()}
        </StretchLink>
    </Row>
);

export const TableOfContentsComp: Comp<TableOfContents> = (props => {
    const { id, items } = props;
    const maxLevel = items.reduce((max, i) => Math.max(max, i.level), 0);
    return <ScrollView>
        <Column style={{ margin: relative(2) }}>
            {items.map(i =>
                <TocItemComp
                    key={i.path.join('-')}
                    id={id}
                    tabs={maxLevel - i.level}
                    {...i}
                />
            )}
        </Column>
    </ScrollView>;
});
