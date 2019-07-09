import * as React from 'react';

import {
    Comp, Row, Tab,
    Column, DottedLine, StretchLink, ThemedText, point,
} from '../blocks';
import {
    bookLocator, locationPath, BookId,
    TableOfContents, TableOfContentsItem,
} from '../model';
import { nums } from '../utils';
import { actionCreators } from '../core';

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
            <ThemedText>{props.title}</ThemedText>
            <DottedLine />
            <ThemedText>{props.pageNumber.toString()}
            </ThemedText>
        </StretchLink>
    </Row>
);

export const TableOfContentsComp: Comp<TableOfContents> = (props => {
    const { id, items } = props;
    const maxLevel = items.reduce((max, i) => Math.max(max, i.level), 0);
    return <Column style={{ margin: point(2) }}>
        {items.map(i =>
            <TocItemComp
                key={i.path.join('-')}
                id={id}
                tabs={maxLevel - i.level}
                {...i}
            />
        )}
    </Column>;
});
