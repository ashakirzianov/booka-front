import { combineFs, trimEnd, trimStart } from './misc';

describe('Utils', () => {
    it('combineFs last-to-first order', () => {
        expect(combineFs<number>(
            x => x * x,
            x => x + x,
        )(5)).toBe(100);
    });

    it('trim', () => {
        expect(trimStart('   hey ', ' hy')).toBe('ey ');
        expect(trimEnd('   hey ', ' hy')).toBe('   he');
    });
});
