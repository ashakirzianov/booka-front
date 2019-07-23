import * as React from 'react';
import {
    BookPath, BookId, bookLocator, BookRange, ContentNode,
    VolumeNode, bookRange, locationPath, parentPath, titleForPath,
} from '../model';
import {
    Comp, Callback, Row, RefType,
    isPartiallyVisible, scrollToRef, Column, point,
    Scroll, Clickable, EmptyLine,
} from '../blocks';
import { actionCreators, generateQuoteLink } from '../core';
import {
    getSelectionRange, subscribe, unsubscribe,
} from './Reader.platform';
import { BookSelection } from './Reader.common';
import { buildNodes, buildBook, Params } from './bookRender';
import { pathToString, parsePath } from './common';
import { BorderButton } from './Connected';

type RefMap = { [k in string]?: RefType };
export type ReaderProps = {
    volume: VolumeNode,
    pathToNavigate: BookPath | null,
    updateBookPosition: Callback<BookPath>,
    toggleControls: Callback<void>,
    range: BookRange,
    prevPath?: BookPath,
    nextPath?: BookPath,
    quoteRange: BookRange | undefined,
    id: BookId,
};
export class Reader extends React.Component<ReaderProps> {
    public refMap: RefMap = {};
    public selectedRange: BookSelection | undefined = undefined;

    public handleScroll = async () => {
        const newCurrentPath = await computeCurrentPath(this.refMap);
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
                this.refMap[pathToString(path)] = ref;
            },
            quoteRange: this.props.quoteRange,
        };
        return <Scroll
            onScroll={this.handleScroll}
        >
            <Row maxWidth={point(50)} fullWidth aligned centered>
                <Column fullWidth padding={point(1)} aligned centered>
                    <EmptyLine />
                    <PathLink path={prevPath} id={id} text={prevTitle || 'Previous'} />
                    <Clickable onClick={this.props.toggleControls}>
                        <Column centered>
                            {buildBook(volume, params)}
                        </Column>
                    </Clickable>
                    <PathLink path={nextPath} id={id} text={nextTitle || 'Next'} />
                    <EmptyLine />
                </Column>
            </Row>
        </Scroll>;
    }
}

export const BookNodesComp: Comp<{ nodes: ContentNode[] }> = (props =>
    <>
        {
            buildNodes(props.nodes, [], {
                refPathHandler: () => undefined,
                pageRange: bookRange(),
            })
        }
    </>
);

type PathLinkProps = {
    path: BookPath | undefined,
    id: BookId,
    text: string,
};
const PathLink: Comp<PathLinkProps> = (props =>
    props.path === undefined ? null :
        <Row centered margin={point(1)}>
            <BorderButton
                action={actionCreators
                    .navigateToBook(bookLocator(props.id, locationPath(props.path)))}
                text={props.text}
            />
        </Row>
);

function composeSelection(selection: BookSelection, id: BookId) {
    return `${selection.text}\n${generateQuoteLink(id, selection.range)}`;
}

async function computeCurrentPath(refMap: RefMap) {
    for (const [key, ref] of Object.entries(refMap)) {
        const isVisible = await isPartiallyVisible(ref);
        if (isVisible) {
            const path = parsePath(key);
            if (path) {
                return path;
            }
        }
    }

    return undefined;
}
