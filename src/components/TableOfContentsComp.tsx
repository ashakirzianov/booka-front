import * as React from 'react';

import {
    Row, Tab, Column, point, TextLine,
} from '../blocks';
import {
    bookLocator, locationPath, BookId,
    TableOfContents, TableOfContentsItem,
} from '../model';
import { nums } from '../utils';
import { actionCreators } from '../core';
import { StretchTextButton } from './Connected';

type TocItemProps = TableOfContentsItem & {
    tabs: number,
    id: BookId,
};
function TocItemComp(props: TocItemProps) {
    return <Row>
        {nums(0, props.tabs).map(i => <Tab key={i.toString()} />)}
        <StretchTextButton
            action={actionCreators
                .navigateToBook(bookLocator(props.id, locationPath(props.path)))}
        >
            <TextLine key='title' text={props.title} family='menu' />
            <TextLine key='pn' text={props.pageNumber.toString()} family='menu' />
        </StretchTextButton>
    </Row>;
}

export function TableOfContentsComp(props: TableOfContents) {
    const { id, items } = props;
    const maxLevel = items.reduce((max, i) => Math.max(max, i.level), 0);
    return <Column margin={point(1)}>
        {items.map(i =>
            <TocItemComp
                key={i.path.join('-')}
                id={id}
                tabs={maxLevel - i.level}
                {...i}
            />
        )}
    </Column>;
}
