export type FontFamily = 'Georgia';
export type FontSize = number;
export type Color = string;

export type Palette = {
    foreground: Color,
    background: Color,
    secondBack: Color,
    accent: Color,
    highlight: Color,
    shadow: Color,
};
export type FontSizes = {
    normal: FontSize,
    large: FontSize,
    largest: FontSize,
};
export type Theme = {
    fontScale: number,
    fontFamily: FontFamily,
    palette: Palette,
    fontSize: FontSizes,
    radius: number,
};
