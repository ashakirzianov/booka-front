export type Library = {
    [key: string]: {
        title: string,
        author?: string,
    } | undefined;
};
export type Book = {
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