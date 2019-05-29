import * as React from 'react';

import {
    connectState, Comp, Row, FullScreenActivityIndicator,
    Column, TopBar, relative, BottomBar, Label,
} from '../blocks';
import { AppScreen, pageForPath } from '../model';
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

    const currentPage = props.bl.location.location === 'path'
        ? pageForPath(props.book.volume, props.bl.location.path)
        : 1;
    if (props.bl.location.location === 'path') {
        console.log(pageForPath(props.book.volume, props.bl.location.path));
    }
    return <>
        <EmptyLine />
        <BottomBar open={props.controlsVisible}>
            <Row>
                <Label text={currentPage.toString()} />
            </Row>
        </BottomBar>
    </>;
});
