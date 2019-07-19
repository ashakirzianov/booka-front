import * as React from 'react';

import {
    Row, Tab, Column, DottedLine,
    TextLine, point, View, ActionButton, ThemedContainer,
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
function TocItemComp(props: TocItemProps) {
    return <Row>
        {nums(0, props.tabs).map(i => <Tab key={i.toString()} />)}
        <View style={{ flex: 1 }}>
            <ActionButton action={actionCreators
                .navigateToBook(bookLocator(props.id, locationPath(props.path)))} style={{
                    alignSelf: 'stretch',
                }}>
                <ThemedContainer style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}
                    hoverColor='highlight'
                    color='text'
                >
                    <TextLine
                        text={props.title}
                    />
                    <DottedLine />
                    <TextLine text={props.pageNumber.toString()} />
                </ThemedContainer>
            </ActionButton>
        </View>
    </Row>;
}

export function TableOfContentsComp(props: TableOfContents) {
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
}
