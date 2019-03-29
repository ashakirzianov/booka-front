import * as React from 'react';
import {
    comp, ReactContent, TopBar, Row,
    relative, VoidCallback, Column, themed,
} from '../blocks';

export const Header = themed<{
    visible: boolean,
}>(props =>
    <TopBar open={props.visible}>
        {props.children}
    </TopBar>,
);

type ScreenLayoutProps = {
    headerVisible: boolean,
    header?: ReactContent,
    onContentClick?: VoidCallback,
};
export const ScreenLayout = comp<ScreenLayoutProps>(props =>
    <Column style={{ width: '100%', alignItems: 'center' }}>
        <Header visible={props.headerVisible}>
            {props.header || null}
        </Header>
        <Row style={{ margin: relative(3) }} />
        {props.children}
    </Column>,
);
