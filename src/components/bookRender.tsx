import * as React from 'react';
import {
    ParagraphNode, BookPath, BookRange, BookContent,
    BookNode, subpathCouldBeInRange, isParagraph,
    isChapter, inRange, ChapterNode,
} from '../model';
import {
    RefType, Comp, Row, ThemedText, relative, refable,
} from '../blocks';
import { assertNever, last } from '../utils';
import { ParagraphComp } from './ParagraphComp';

export type RefPathHandler = (ref: RefType, path: BookPath) => void;
export type Params = {
    refPathHandler: RefPathHandler,
    pageRange: BookRange,
    quoteRange?: BookRange,
};

export function buildBook(book: BookContent, params: Params) {
    const head = params.pageRange.start.length === 0
        ? [<BookTitle key={`bt`} text={book.meta.title} />]
        : [];

    return head
        .concat(buildNodes(book.nodes, [], params));
}

export function buildNodes(nodes: BookNode[], headPath: BookPath, params: Params): JSX.Element[] {
    return nodes
        .map((bn, i) => buildNode(bn, headPath.concat([i]), params))
        .reduce((acc, arr) => acc.concat(arr))
        ;
}

function buildNode(node: BookNode, path: BookPath, params: Params) {
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
    return inRange(path, params.pageRange)
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
    const head = inRange(path, params.pageRange)
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
        <ThemedText style={{
            letterSpacing: relative(0.15),
            textAlign: 'center',
            margin: relative(1),
        }}>
            {props.text && props.text.toLocaleUpperCase()}
        </ThemedText>
    </Row>
);

const PartTitle: Comp<{ text?: string }> = (props =>
    <Row style={{
        justifyContent: 'center',
        width: '100%',
    }}>
        <ThemedText size='large' style={{
            fontWeight: 'bold',
            textAlign: 'center',
            margin: relative(1),
        }}>
            {props.text}
        </ThemedText>
    </Row>
);

const SubpartTitle: Comp<{ text?: string }> = (props =>
    <Row style={{ justifyContent: 'flex-start' }}>
        <ThemedText style={{
            fontStyle: 'italic',
            margin: relative(1),
        }}>
            {props.text}
        </ThemedText>
    </Row>
);

const BookTitle: Comp<{ text?: string }> = (props =>
    <Row style={{ justifyContent: 'center', width: '100%' }}>
        <ThemedText size='largest' style={{
            fontWeight: 'bold',
            textAlign: 'center',
        }}>
            {props.text}
        </ThemedText>
    </Row>
);

const ChapterHeader = refable<ChapterNode & { path: BookPath }>(props =>
    props.level === 0 ? <ChapterTitle text={props.title} />
        : props.level > 0 ? <PartTitle text={props.title} />
            : <SubpartTitle text={props.title} />,
    'ChapterHeader'
);

export function pathToString(path: BookPath): string {
    return `${path.join('-')}`;
}

export function parsePath(pathString: string): BookPath | undefined {
    const path = pathString
        .split('-')
        .map(pc => parseInt(pc, 10))
        ;
    return path.some(p => isNaN(p))
        ? undefined
        : path;
}
