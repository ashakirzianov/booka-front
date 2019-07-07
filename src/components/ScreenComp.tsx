import * as React from 'react';

import {
    connectState, Comp, Row, FullScreenActivityIndicator,
    Column, TopBar, BottomBar, point, SafeAreaView, Scroll,
} from '../blocks';
import { AppScreen } from '../model';
import { assertNever } from '../utils';
import { BookScreenComp, BookScreenHeader, BookScreenFooter } from './BookScreenComp';
import { LibraryScreenComp, LibraryScreenHeader } from './LibraryScreenComp';

export const ScreenComp = connectState('controlsVisible', 'loading')<AppScreen>(props =>
    <Column style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
    }}>
        {props.loading ? <FullScreenActivityIndicator /> : null}
        <Header {...props} />
        <Footer {...props} />
        <Scroll>
            <EmptyLine />
            <Content {...props} />
            <EmptyLine />
        </Scroll>
    </Column>
);

const Content: Comp<AppScreen> = (props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
            : assertNever(props)
);

function EmptyLine() {
    return <SafeAreaView>
        <Row style={{ height: point(3.5) }} />
    </SafeAreaView>;
}

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

export const Footer: Comp<BarProps> = (props => {
    if (props.screen !== 'book') {
        return null;
    }

    return <BottomBar open={props.controlsVisible}>
        <BookScreenFooter {...props} />
    </BottomBar>;
});
