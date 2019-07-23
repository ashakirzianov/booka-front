import * as React from 'react';
import {
    ParagraphNode, BookPath, BookRange, VolumeNode,
    ContentNode, subpathCouldBeInRange, isParagraph,
    isChapter, inBookRange, ChapterNode,
} from '../model';
import {
    Comp, Row, TextLine, refable, point,
} from '../blocks';
import { assertNever, last } from '../utils';
import { ParagraphComp } from './ParagraphComp';
import { RefPathHandler, pathToString } from './common';

export type Params = {
    refPathHandler: RefPathHandler,
    pageRange: BookRange,
    quoteRange?: BookRange,
};

export function buildBook(book: VolumeNode, params: Params) {
    const head = params.pageRange.start.length === 0
        ? [<BookTitle key={`bt`} text={book.meta.title} />]
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
        ? [<ParagraphComp
            key={`p-${pathToString(path)}`}
            p={paragraph}
            path={path}
            first={last(path) === 0}
            highlights={params.quoteRange && {
                quote: params.quoteRange,
            }}
            refPathHandler={params.refPathHandler}
        />]
        : [];
}

function buildChapter(chapter: ChapterNode, path: BookPath, params: Params) {
    const head = inBookRange(path, params.pageRange)
        ? [<ChapterHeader ref={ref => params.refPathHandler(ref, path)} key={`ch-${pathToString(path)}`} path={path} {...chapter} />]
        : [];
    return head
        .concat(buildNodes(chapter.nodes, path, params));
}

const ChapterTitle: Comp<{ text?: string }> = (props =>
    <Row style={{
        justifyContent: 'center',
        width: '100%',
    }}>
        <TextLine
            color='text'
            text={props.text && props.text.toLocaleUpperCase()}
            style={{
                letterSpacing: point(0.15),
                textAlign: 'center',
                margin: point(1),
            }}
        />
    </Row>
);

const PartTitle: Comp<{ text?: string }> = (props =>
    <Row style={{
        justifyContent: 'center',
        width: '100%',
    }}>
        <TextLine
            color='text'
            text={props.text}
            size='large'
            style={{
                fontWeight: 'bold',
                textAlign: 'center',
                margin: point(1),
            }}
        />
    </Row>
);

const SubpartTitle: Comp<{ text?: string }> = (props =>
    <Row style={{
        justifyContent: 'flex-start',
        width: '100%',
    }}>
        <TextLine
            color='text'
            text={props.text}
            style={{
                fontStyle: 'italic',
                margin: point(1),
            }}
        />
    </Row>
);

const BookTitle: Comp<{ text?: string }> = (props =>
    <Row style={{ justifyContent: 'center', width: '100%' }}>
        <TextLine
            color='text'
            text={props.text}
            size='largest'
            style={{
                fontWeight: 'bold',
                textAlign: 'center',
            }}
        />
    </Row>
);

const ChapterHeader = refable<ChapterNode & { path: BookPath }>(function ChapterHeaderC(props) {
    const TitleComp = props.level === 0 ? ChapterTitle
        : props.level > 0 ? PartTitle
            : SubpartTitle;
    return <>
        {
            props.title.map((line, idx) =>
                <TitleComp key={idx} text={line} />)
        }
    </>;
});
