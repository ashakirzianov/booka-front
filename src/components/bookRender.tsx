import * as React from 'react';
import {
    ParagraphNode, BookPath, BookRange, VolumeNode,
    ContentNode, subpathCouldBeInRange, isParagraph,
    isChapter, inBookRange, ChapterNode,
} from '../model';
import {
    Row, TextLine, refable, point,
} from '../blocks';
import { assertNever, last } from '../utils';
import { ParagraphComp } from './ParagraphComp';
import { RefPathHandler, pathToString } from './common';

export type Params = {
    refPathHandler: RefPathHandler,
    pageRange: BookRange,
    quoteRange?: BookRange,
    omitDropCase?: boolean,
};

export function buildBook(book: VolumeNode, params: Params) {
    const head = params.pageRange.start.length === 0
        ? [
            <BookTitle
                key={`bt`}
                text={book.meta.title}
            />,
        ]
        : [];

    return head
        .concat(buildNodes(book.nodes, [], params));
}

export function buildNodes(nodes: ContentNode[], headPath: BookPath, params: Params): JSX.Element[] {
    return nodes
        .map((bn, i) => buildNode(bn, headPath.concat([i]), params))
        .reduce((acc, arr) => acc.concat(arr), [])
        ;
}

function buildNode(node: ContentNode, path: BookPath, params: Params) {
    if (!subpathCouldBeInRange(path, params.pageRange)) {
        return [];
    }

    if (isParagraph(node)) {
        return buildParagraph(node, path, params);
    } else if (isChapter(node)) {
        return buildChapter(node, path, params);
    } else {
        return assertNever(node, path.toString());
    }
}

function buildParagraph(paragraph: ParagraphNode, path: BookPath, params: Params) {
    return inBookRange(path, params.pageRange)
        ? [
            <ParagraphComp
                key={`p-${pathToString(path)}`}
                p={paragraph}
                path={path}
                first={params.omitDropCase ? false : last(path) === 0}
                highlights={params.quoteRange && {
                    quote: params.quoteRange,
                }}
                refPathHandler={params.refPathHandler}
            />,
        ]
        : [];
}

function buildChapter(chapter: ChapterNode, path: BookPath, params: Params) {
    const head = inBookRange(path, params.pageRange)
        ? [
            <ChapterHeader
                key={`ch-${pathToString(path)}`}
                ref={ref => params.refPathHandler(ref, path)}
                level={chapter.level}
                title={chapter.title}
            />,
        ]
        : [];
    return head
        .concat(buildNodes(chapter.nodes, path, params));
}

type TitleProps = {
    text?: string,
};

function ChapterTitle(props: TitleProps) {
    return <Row centered fullWidth>
        <TextLine
            family='book'
            color='text'
            text={props.text && props.text.toLocaleUpperCase()}
            letterSpacing={point(0.15)}
            margin={point(1)}
            textAlign='center'
        />
    </Row>;
}

function PartTitle(props: TitleProps) {
    return <Row centered fullWidth>
        <TextLine
            family='book'
            color='text'
            text={props.text}
            size='large'
            bold
            textAlign='center'
            margin={point(1)}
        />
    </Row>;
}

function SubpartTitle(props: TitleProps) {
    return <Row fullWidth>
        <TextLine
            family='book'
            color='text'
            text={props.text}
            italic
            margin={point(1)}
        />
    </Row>;
}

function BookTitle(props: TitleProps) {
    return <Row centered fullWidth>
        <TextLine
            family='book'
            color='text'
            text={props.text}
            size='largest'
            bold
            textAlign='center'
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
    return <>
        {
            title.map((line, idx) =>
                <TitleComp key={idx} text={line} />)
        }
    </>;
}
const ChapterHeader = refable(ChapterHeaderC);
