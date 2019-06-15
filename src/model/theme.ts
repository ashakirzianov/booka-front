export type FontFamily = 'Georgia' | 'San Francisco' | 'Helvetica';
export type FontSize = number;
export type Color = string;

export type Palette = {
    colors: {
        text: Color,
        primary: Color,
        secondary: Color,
        accent: Color,
        highlight: Color,
        shadow: Color,
    },
    highlights: {
        quote: Color,
    },
};
export type FontSizes = {
    smallest: FontSize,
    small: FontSize,
    normal: FontSize,
    large: FontSize,
    largest: FontSize,
};
export type FontFamilies = {
    main: FontFamily,
    menu: FontFamily,
};

export type Palettes = {
    light: Palette,
    sepia: Palette,
    dark: Palette,
};
export type PaletteName = keyof Palettes;

export type Theme = {
    palettes: Palettes,
    currentPalette: PaletteName,
    fontScale: number,
    fontFamilies: FontFamilies,
    fontSizes: FontSizes,
    radius: number,
};
