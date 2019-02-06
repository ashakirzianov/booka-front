export type LibraryJson = {
    [key: string]: {
        title: string,
        author?: string,
    } | undefined;
};
export type BookJson = {
    book: "book",
    meta: {
        title: string,
        author?: string,
    },
    content: BookNode[],
};

type Paragraph = string;
type Chapter = {
    book: "chapter",
    level: number,
    title?: string,
    content: BookNode[],
};

type BookNode = Chapter | Paragraph;