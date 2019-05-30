import * as React from 'react';

import {
    connectState, Comp, Row, FullScreenActivityIndicator,
    Column, TopBar, relative, BottomBar, ThemedText, Link,
} from '../blocks';
import { AppScreen, Pagination } from '../model';
import { assertNever } from '../utils';
import { BookScreenComp, BookScreenHeader } from './BookScreenComp';
import { LibraryScreenComp, LibraryScreenHeader } from './LibraryScreenComp';
import { actionCreators } from '../redux';

export const ScreenComp = connectState('controlsVisible', 'loading')<AppScreen>(props =>
    <Column style={{ width: '100%', alignItems: 'center' }}>
        {props.loading ? <FullScreenActivityIndicator /> : null}
        <Header {...props} />
        <Footer {...props} />
        <EmptyLine />
        <Content {...props} />
        <EmptyLine />
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
    <TopBar open={props.controlsVisible}>
        <Row>
            {
                props.screen === 'library' ? <LibraryScreenHeader />
                    : props.screen === 'book' ? <BookScreenHeader {...props} />
                        : assertNever(props)
            }
        </Row>
    </TopBar>
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
    return <BottomBar open={props.controlsVisible}>
        <Row style={{
            justifyContent: 'space-between',
        }}>
            <Column />
            <Column>
                <Link action={actionCreators.toggleToc()}>
                    <ThemedText
                        size='smallest'
                        fixedSize={true}
                        family='menu'
                        color='accent'
                        style={{
                            fontWeight: 'bold',
                        }}
                    >
                        {`${currentPage} of ${total}`}
                    </ThemedText>
                </Link>
            </Column>
            <Column>
                <Link>
                    <ThemedText
                        size='smallest'
                        fixedSize={true}
                        family='menu'
                        color='accent'
                    >
                        {`${left} left`}
                    </ThemedText>
                </Link>
            </Column>
        </Row>
    </BottomBar>;
});
