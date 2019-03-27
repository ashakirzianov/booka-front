export type FontFamily = 'Georgia';
export type FontSize = number;
export type Color = string;

export type Theme = {
    fontScale: number,
    fontFamily: FontFamily,
    palette: {
        foreground: Color,
        background: Color,
        secondBack: Color,
        accent: Color,
        highlight: Color,
        shadow: Color,
    },
    fontSize: {
        normal: FontSize,
        large: FontSize,
        largest: FontSize,
    },
    radius: number,
};
