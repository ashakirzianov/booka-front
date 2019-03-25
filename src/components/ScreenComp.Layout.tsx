import * as React from 'react';
import {
    comp, ReactContent, TopPanel, AnimatedVisibility, Row,
    relative, Label, Comp, VoidCallback, Column,
} from '../blocks';

export const Header = comp<{
    title?: string,
    right?: ReactContent,
    visible: boolean,
}>(props =>
    <TopPanel>
        <AnimatedVisibility visible={props.visible}>
            {
                props.visible ?
                    <Row style={{
                        width: '100%', height: relative(5),
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: relative(1),
                        backgroundColor: 'black',
                    }}>
                        {/* Left */}
                        <Row>{props.children}</Row>
                        {/* Center */}
                        <Row><Label text={props.title || ''} /></Row>
                        {/* Right */}
                        <Row>{props.right}</Row>
                    </Row>
                    : null
            }
        </AnimatedVisibility>
    </TopPanel>,
);

export const ScreenLayout: Comp<{
    headerVisible: boolean,
    headerTitle?: string,
    header?: ReactContent,
    onContentClick?: VoidCallback,
}> = (props =>
    <Column style={{ width: '100%', alignItems: 'center' }}>
        <Header title={props.headerTitle} visible={props.headerVisible}>
            {props.header || null}
        </Header>
        <Row style={{ margin: relative(3) }} />
        {props.children}
    </Column>
    );
