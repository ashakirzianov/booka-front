import * as React from 'react';

import { Comp, comp, VoidCallback, relative } from './comp-utils';
import { Row, TopPanel, Column, ReactContent } from './Atoms';
import { Label, LinkButton } from './Elements';
import { AnimatedVisibility, FadeIn } from './Animations.platform';
import { BookId } from '../model';
import { linkForToc, linkForLib } from '../logic/routing';

const Header = comp<{
    title?: string,
    right?: ReactContent,
    visible: boolean,
}>(props =>
    <TopPanel>
        <AnimatedVisibility visible={props.visible}>
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
        </AnimatedVisibility>
    </TopPanel>,
);

export const BackButton = comp(props =>
    <LinkButton text='< Lib' link={linkForLib()} />,
);

export const OpenTocButton: Comp<{ bi: BookId }> = (props =>
    <LinkButton text='ToC' link={linkForToc(props.bi)} />
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
        <FadeIn>
            <Row style={{ marginTop: relative(5) }}>{props.children}</Row>
        </FadeIn>
    </Column>
    );
