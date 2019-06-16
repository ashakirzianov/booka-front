import * as React from 'react';
import {
    BookPath, BookId, bookLocator, BookRange, ContentNode,
    VolumeNode, bookRange, locationPath, parentPath, titleForPath,
} from '../model';
import {
    Comp, Callback, Row, ThemedText, ScrollView,
    RefType, isPartiallyVisible, scrollToRef, LinkButton, Column, relative,
} from '../blocks';
import { actionCreators } from '../redux';
import {
    getSelectionRange, subscribe, unsubscribe, BookSelection,
} from './Reader.platform';
import { generateQuoteLink } from '../core';
import { buildNodes, buildBook, Params, parsePath, pathToString } from './bookRender';

type RefMap = { [k in string]?: RefType };
export type ReaderProps = {
    volume: VolumeNode,
    pathToNavigate: BookPath | null,
    updateBookPosition: Callback<BookPath>,
    range: BookRange,
    prevPath?: BookPath,
    nextPath?: BookPath,
    quoteRange: BookRange | undefined,
    id: BookId,
};
export class Reader extends React.Component<ReaderProps> {
    public refMap: RefMap = {};
    public selectedRange: BookSelection | undefined = undefined;

    public handleScroll = () => {
        const newCurrentPath = computeCurrentPath(this.refMap);
        if (newCurrentPath) {
            this.props.updateBookPosition(newCurrentPath);
        }
    }

    public handleSelection = () => {
        this.selectedRange = getSelectionRange();
    }

    public handleCopy = (e: ClipboardEvent) => {
        if (this.selectedRange && e.clipboardData) {
            e.preventDefault();
            const selectionText = composeSelection(this.selectedRange, this.props.id);
            e.clipboardData.setData('text/plain', selectionText);
        }
    }

    public scrollToCurrentPath = () => {
        const props = this.props;
        const refMap = this.refMap;
        if (props && props.pathToNavigate) {
            const refToNavigate =
                refMap[pathToString(props.pathToNavigate)]
                // TODO: find better solution
                // In case we navigate to character
                || refMap[pathToString(parentPath(props.pathToNavigate))]
                ;
            if (!scrollToRef(refToNavigate)) {
                setTimeout(this.scrollToCurrentPath.bind(this), 250);
            }
        }
    }

    public componentDidMount() {
        subscribe.scroll(this.handleScroll);
        subscribe.selection(this.handleSelection);
        subscribe.copy(this.handleCopy);
        this.scrollToCurrentPath();

    }

    public componentDidUpdate() {
        this.scrollToCurrentPath();
    }

    public componentWillUnmount() {
        unsubscribe.scroll(this.handleScroll);
        unsubscribe.selection(this.handleSelection);
        unsubscribe.copy(this.handleCopy);
    }

    public render() {
        const { range, prevPath, nextPath, id, volume } = this.props;
        const prevTitle = prevPath && titleForPath(volume, prevPath)[0];
        const nextTitle = nextPath && titleForPath(volume, nextPath)[0];
        const params: Params = {
            pageRange: range,
            refPathHandler: (ref, path) => {
                this.refMap = {
                    ...this.refMap,
                    [pathToString(path)]: ref,
                };
            },
            quoteRange: this.props.quoteRange,
        };
        return <ScrollView>
            <PathLink path={prevPath} id={id} text={prevTitle || 'Previous'} />
            <Column>
                {buildBook(volume, params)}
            </Column>
            <PathLink path={nextPath} id={id} text={nextTitle || 'Next'} />
        </ScrollView>;
    }
}

export const BookNodesComp: Comp<{ nodes: ContentNode[] }> = (props =>
    <ThemedText>
        {
            buildNodes(props.nodes, [], {
                refPathHandler: () => undefined,
                pageRange: bookRange(),
            })
        }
    </ThemedText>
);

type PathLinkProps = {
    path: BookPath | undefined,
    id: BookId,
    text: string,
};
const PathLink: Comp<PathLinkProps> = (props =>
    props.path === undefined ? null :
        <Row style={{
            justifyContent: 'center',
            margin: relative(1),
        }}>
            <LinkButton action={actionCreators
                .navigateToBook(bookLocator(props.id, locationPath(props.path)))}
            >
                {props.text}
            </LinkButton>
        </Row>
);

function composeSelection(selection: BookSelection, id: BookId) {
    return `${selection.text}\n${generateQuoteLink(id, selection.range)}`;
}

function computeCurrentPath(refMap: RefMap) {
    for (const [key, ref] of Object.entries(refMap)) {
        if (isPartiallyVisible(ref)) {
            const path = parsePath(key);
            if (path) {
                return path;
            }
        }
    }

    return undefined;
}
