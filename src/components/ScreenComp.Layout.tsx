import * as React from 'react';
import {
    comp, ReactContent, TopBar, Row,
    relative, Label, VoidCallback, Column, themed,
} from '../blocks';

export const Header = themed<{
    title?: string,
    right?: ReactContent,
    visible: boolean,
}>(props =>
    <TopBar open={props.visible}>
        <Row style={{
            width: '100%', height: relative(5),
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: relative(1),
            backgroundColor: props.theme.color.secondBack,
        }}>
            {/* Left */}
            <Row>{props.children}</Row>
            {/* Center */}
            <Row><Label text={props.title || ''} /></Row>
            {/* Right */}
            <Row>{props.right}</Row>
        </Row>

    </TopBar>,
);

type ScreenLayoutProps = {
    headerVisible: boolean,
    headerTitle?: string,
    header?: ReactContent,
    onContentClick?: VoidCallback,
};
export const ScreenLayout = comp<ScreenLayoutProps>(props =>
    <Column style={{ width: '100%', alignItems: 'center' }}>
        <Header title={props.headerTitle} visible={props.headerVisible}>
            {props.header || null}
        </Header>
        <Row style={{ margin: relative(3) }} />
        {props.children}
    </Column>,
);
