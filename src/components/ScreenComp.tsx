import * as React from 'react';

import {
    connectState, Comp, Row, FullScreenActivityIndicator,
    Column, TopBar, relative, BottomBar,
} from '../blocks';
import { AppScreen } from '../model';
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
    return props.screen !== 'book' ? null :
        <>
            <EmptyLine />
            <BottomBar open={props.controlsVisible}>
                <Row />
            </BottomBar>
        </>;
});
