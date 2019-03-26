export type FontFamily = 'Georgia';
export type FontSize = number;
export type Color = string;

export type Theme = {
    fontFamily: FontFamily,
    color: {
        foreground: Color,
        background: Color,
        secondBack: Color,
        accent: Color,
        highlight: Color,
    },
    fontSize: {
        normal: FontSize,
        large: FontSize,
        largest: FontSize,
    },
    radius: number,
};
