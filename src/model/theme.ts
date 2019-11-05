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
export type PaletteColor = keyof Palette['colors'];
export type HighlightsColor = keyof Palette['highlights'];
export type FontSizes = {
    smallest: FontSize,
    small: FontSize,
    normal: FontSize,
    large: FontSize,
    largest: FontSize,
    text: FontSize,
};
export type FontFamilies = {
    book: FontFamily,
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

export type HasTheme = {
    theme: Theme,
};

export function colors(theme: Theme): Palette['colors'] {
    return theme.palettes[theme.currentPalette].colors;
}

export function highlights(theme: Theme): Palette['highlights'] {
    return theme.palettes[theme.currentPalette].highlights;
}

export function fontSize(theme: Theme, size?: keyof FontSizes): number {
    return size === 'text'
        ? theme.fontSizes.text * theme.fontScale
        : theme.fontSizes[size || 'normal'];
}
