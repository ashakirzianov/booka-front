type Offset = number;
type Path = Array<number>;
type Scrollable = {
    ownOffset: () => Offset,
    offsetForPath: (path: Path) => Offset,
    pathForOffset?: (offset: Offset) => Path,
};

export function isScrollable(o: any): o is Scrollable {
    return typeof o.offsetForPath === 'function';
}
