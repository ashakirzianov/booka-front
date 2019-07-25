import * as React from 'react';

import {
    Row, Tab, Column, point,
} from '../blocks';
import {
    bookLocator, locationPath, BookId,
    TableOfContents, TableOfContentsItem,
} from '../model';
import { nums } from '../utils';
import { actionCreators } from '../core';
import { StretchTextButton, TextLine } from './Connected';

type TocItemProps = {
    tabs: number,
    id: BookId,
    item: TableOfContentsItem,
};
function TocItemComp({ item, tabs, id }: TocItemProps) {
    return <Row>
        {nums(0, tabs).map(i => <Tab key={i.toString()} />)}
        <StretchTextButton
            action={actionCreators
                .navigateToBook(bookLocator(id, locationPath(item.path)))}
        >
            <TextLine key='title' text={item.title} />
            <TextLine key='pn' text={item.pageNumber.toString()} />
        </StretchTextButton>
    </Row>;
}

export type TableOfContentsProps = {
    toc: TableOfContents,
};
export function TableOfContentsComp({ toc }: TableOfContentsProps) {
    const { id, items } = toc;
    const maxLevel = items.reduce((max, i) => Math.max(max, i.level), 0);
    return <Column margin={point(1)}>
        {items.map(i =>
            <TocItemComp
                key={i.path.join('-')}
                id={id}
                tabs={maxLevel - i.level}
                item={i}
            />
        )}
    </Column>;
}
