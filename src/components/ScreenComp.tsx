import * as React from 'react';

import {
    connectState, Comp, Row, FullScreenActivityIndicator,
    Column, TopBar, relative, BottomBar, PlainText, ThemedText,
} from '../blocks';
import { AppScreen, Pagination } from '../model';
import { assertNever } from '../utils';
import { BookScreenComp, BookScreenHeader } from './BookScreenComp';
import { LibraryScreenComp, LibraryScreenHeader } from './LibraryScreenComp';

export const ScreenComp = connectState('controlsVisible', 'loading')<AppScreen>(props =>
    <Column style={{ width: '100%', alignItems: 'center' }}>
        {props.loading ? <FullScreenActivityIndicator /> : null}
        <Header {...props} />
        <Content {...props} />
        <Footer {...props} />
    </Column>
);

const Content: Comp<AppScreen> = (props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
            : assertNever(props)
);

const EmptyLine: Comp = props => <Row style={{ margin: relative(1.2) }} />;

type BarProps = AppScreen & {
    controlsVisible: boolean,
};
const Header: Comp<BarProps> = (props =>
    <>
        <TopBar open={props.controlsVisible}>
            <Row>
                {
                    props.screen === 'library' ? <LibraryScreenHeader />
                        : props.screen === 'book' ? <BookScreenHeader {...props} />
                            : assertNever(props)
                }
            </Row>
        </TopBar>
        <EmptyLine />
    </>
);

const Footer: Comp<BarProps> = (props => {
    if (props.screen !== 'book') {
        return null;
    }

    const pagination = new Pagination(props.book.volume);
    const total = pagination.totalPages();
    let currentPage = 1;
    let left = 0;
    if (props.bl.location.location === 'path') {
        const path = props.bl.location.path;
        currentPage = pagination.pageForPath(path);
        left = pagination.lastPageOfChapter(path) - currentPage;
    }
    return <>
        <EmptyLine />
        <BottomBar open={props.controlsVisible}>

            <ThemedText
                size='smallest'
                fixedSize={true}
                family='menu'
                color='accent'
            >
                <Row style={{
                    justifyContent: 'space-between',
                }}>
                    <Column />
                    <Column>
                        <PlainText>{`${currentPage} of ${total}`}</PlainText>
                    </Column>
                    <Column>
                        <PlainText>{`${left} left`}</PlainText>
                    </Column>
                </Row>
            </ThemedText>
        </BottomBar>
    </>;
});
