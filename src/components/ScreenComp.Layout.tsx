import * as React from 'react';

import { Comp, comp, VoidCallback, relative } from './comp-utils';
import { Row, TopPanel, Column, ClickResponder, ReactContent } from './Atoms';
import { Label, LinkButton } from './Elements';
import { PopFromBottom, AnimatedVisibility } from './Animations.platform';
import { BookId } from '../model';
import { linkForToc, linkForLib } from '../logic/routing';

export const BookScreenLayout: Comp<{ showControls: boolean, onContentClick: VoidCallback, bi: BookId }> = (props =>
    <ScreenLayout
        header={
            <Header visible={props.showControls}>
                <BackButton />
                <OpenTocButton bi={props.bi} />
            </Header>}
        onContentClick={() => props.onContentClick()}
    >
        <Row style={{
            alignItems: 'center',
            maxWidth: relative(50),
            margin: relative(2), marginTop: relative(5),
        }}
        >
            {props.children}
        </Row>
    </ScreenLayout>
);

export const LibraryScreenLayout: Comp = (props =>
    <ScreenLayout
        header={<Header title='Library' visible />}
    >
        <Row style={{ marginTop: relative(5) }}>{props.children}</Row>
    </ScreenLayout>
);

export const TocScreenLayout: Comp = (props =>
    <ScreenLayout
        header={
            <Header title='Table of Contents' visible>
                <BackButton />
            </Header>
        }
    >
        <Row style={{ marginTop: relative(5) }}>{props.children}</Row>
    </ScreenLayout>
);

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

const BackButton = comp(props =>
    <LinkButton text='< Lib' link={linkForLib()} />,
);

const OpenTocButton: Comp<{ bi: BookId }> = (props =>
    <LinkButton text='ToC' link={linkForToc(props.bi)} />
);

const ScreenLayout: Comp<{
    header?: ReactContent,
    onContentClick?: VoidCallback,
}> = (props =>
    <Column style={{ width: '100%', alignItems: 'center' }}>
        {props.header || null}
        <ClickResponder onClick={props.onContentClick}>
            <PopFromBottom>
                {props.children}
            </PopFromBottom>
        </ClickResponder>
    </Column>
    );
