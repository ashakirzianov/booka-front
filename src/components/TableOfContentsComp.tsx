import * as React from 'react';
import { TableOfContents, TableOfContentsItem } from 'booka-common';

import {
    Row, Tab, Column, point,
} from '../atoms';
import {
    bookLocator, locationPath, BookId, Pagination,
} from '../model';
import { nums } from '../utils';
import { actionCreators } from '../core';
import { StretchTextButton, TextLine } from './Connected';

type TocItemProps = {
    tabs: number,
    id: BookId,
    item: TableOfContentsItem,
    page: number,
};
function TocItemComp({ item, tabs, id, page }: TocItemProps) {
    return <Row>
        {nums(0, tabs).map(i => <Tab key={i.toString()} />)}
        <StretchTextButton
            action={actionCreators
                .navigateToBook(bookLocator(id, locationPath(item.path)))}
        >
            <TextLine key='title' text={item.title[0]} />
            <TextLine key='pn' text={page.toString()} />
        </StretchTextButton>
    </Row>;
}

export type TableOfContentsProps = {
    toc: TableOfContents,
    id: BookId,
    pagination: Pagination,
};
export function TableOfContentsComp({ toc, id, pagination }: TableOfContentsProps) {
    const maxLevel = toc.items.reduce((max, i) => Math.max(max, i.level), 0);
    return <Column margin={point(1)}>
        {toc.items.map(i =>
            <TocItemComp
                key={i.path.join('-')}
                id={id}
                tabs={maxLevel - i.level}
                item={i}
                page={pagination.pageForPath(i.path)}
            />
        )}
    </Column>;
}
