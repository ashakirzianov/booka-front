import * as React from 'react';
import { BookPath, BookRange, subpathCouldBeInRange } from 'booka-common';
import { inBookRange } from '../model';
import {
    Row, refable, point, Column, percent, Image,
} from '../blocks';
import { assertNever, last } from '../utils';
import { ParagraphComp } from './ParagraphComp';
import { RefPathHandler, pathToString } from './common';
import { TextLine } from './Connected';
import {
    VolumeNode, BookContentNode, isParagraph, isChapter,
    ParagraphNode, ChapterNode, isImage, ImageNode,
} from 'booka-common';

export type Params = {
    refPathHandler: RefPathHandler,
    pageRange: BookRange,
    quoteRange?: BookRange,
    omitDropCase?: boolean,
};

export type VolumeProps = {
    volume: VolumeNode,
    params: Params,
};
export function VolumeComp({ volume, params }: VolumeProps) {
    return <>
        {
            params.pageRange.start.length !== 0 ? null :
                <BookTitle key='bt' text={volume.meta.title} />
        }
        <ContentNodesComp
            nodes={volume.nodes}
            headPath={[]}
            params={params}
        />
    </>;
}

export type ContentNodesProps = {
    nodes: BookContentNode[],
    headPath: BookPath,
    params: Params,
};
export function ContentNodesComp({ nodes, headPath, params }: ContentNodesProps) {
    return <>
        {
            nodes.map((bn, i) =>
                <ContentNodeComp
                    key={`${i}`}
                    node={bn}
                    path={headPath.concat([i])}
                    params={params}
                />
            )
        }
    </>;
}

type ContentNodeProps = {
    node: BookContentNode,
    path: BookPath,
    params: Params,
};
function ContentNodeComp({ node, path, params }: ContentNodeProps) {
    if (!subpathCouldBeInRange(path, params.pageRange)) {
        return null;
    }

    if (isParagraph(node)) {
        return <ParagraphNodeComp
            ref={ref => params.refPathHandler(ref, path)}
            paragraph={node}
            path={path}
            params={params}
        />;
    } else if (isChapter(node)) {
        return <ChapterNodeComp
            chapter={node}
            path={path}
            params={params}
        />;
    } else if (isImage(node)) {
        return <ImageNodeComp image={node} />;
    } else {
        return assertNever(node, path.toString());
    }
}

type ParagraphNodeProps = {
    paragraph: ParagraphNode,
    path: BookPath,
    params: Params,
};
function ParagraphNodeCompC({ paragraph, path, params }: ParagraphNodeProps) {
    return !inBookRange(path, params.pageRange) ? null :
        <ParagraphComp
            key={`p-${pathToString(path)}`}
            p={paragraph}
            path={path}
            first={params.omitDropCase ? false : last(path) === 0}
            highlights={params.quoteRange && {
                quote: params.quoteRange,
            }}
            refPathHandler={params.refPathHandler}
        />;
}
const ParagraphNodeComp = refable(ParagraphNodeCompC);

type ChapterNodeProps = {
    chapter: ChapterNode,
    path: BookPath,
    params: Params,
};
function ChapterNodeComp({ chapter, path, params }: ChapterNodeProps) {
    return <>
        {
            !inBookRange(path, params.pageRange) ? null :
                <ChapterHeader
                    key={`ch-${pathToString(path)}`}
                    ref={ref => params.refPathHandler(ref, path)}
                    level={chapter.level}
                    title={chapter.title}
                />
        }
        <ContentNodesComp
            nodes={chapter.nodes}
            headPath={path}
            params={params}
        />
    </>;
}

type TitleProps = {
    text?: string,
};

function ChapterTitle(props: TitleProps) {
    return <Row centered fullWidth margin={point(1)}>
        <TextLine
            fontFamily='book'
            color='text'
            text={props.text && props.text.toLocaleUpperCase()}
            letterSpacing={point(0.15)}
        />
    </Row>;
}

function PartTitle(props: TitleProps) {
    return <Row centered fullWidth margin={point(1)}>
        <TextLine
            fontFamily='book'
            color='text'
            text={props.text}
            fontSize='large'
            bold
        />
    </Row>;
}

function SubpartTitle(props: TitleProps) {
    return <Row fullWidth margin={point(1)}>
        <TextLine
            fontFamily='book'
            color='text'
            text={props.text}
            italic
        />
    </Row>;
}

function BookTitle(props: TitleProps) {
    return <Row centered fullWidth margin={point(1)}>
        <TextLine
            fontFamily='book'
            color='text'
            text={props.text}
            fontSize='largest'
            bold
        />
    </Row>;
}

type ChapterHeaderProps = {
    level: number,
    title: string[],
};
function ChapterHeaderC({ level, title }: ChapterHeaderProps) {
    const TitleComp = level === 0 ? ChapterTitle
        : level > 0 ? PartTitle
            : SubpartTitle;
    return <Column
        centered
        stretched
        maxWidth={percent(100)}
    >
        {
            title.map((line, idx) =>
                <TitleComp key={idx} text={line} />)
        }
    </Column>;
}
const ChapterHeader = refable(ChapterHeaderC);

type ImageNodeProps = {
    image: ImageNode,
};
function ImageNodeComp({ image }: ImageNodeProps) {
    switch (image.node) {
        case 'image-url':
            return <Image url={image.url} />;
        case 'image-data':
            return null;
        default:
            return assertNever(image);
    }
}
