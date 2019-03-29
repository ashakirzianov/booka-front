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

export const whitePalette: Palette = {
    foreground: '#000',
    background: '#fff',
    secondBack: '#eee',
    accent: '#777',
    highlight: '#aaf',
    shadow: '#000',
};

export const sepiaPalette: Palette = {
    foreground: '#5f3e24',
    background: '#f9f3e9',
    secondBack: '#e6e0d6',
    accent: '#987',
    highlight: '#321',
    shadow: '#000',
};

export const darkPalette: Palette = {
    foreground: '#999',
    background: '#000',
    secondBack: '#222',
    accent: '#ddd',
    highlight: '#fff',
    shadow: '#222',
};

const defaultPalette = whitePalette;

export const defaultTheme: Theme = {
    fontFamily: 'Georgia',
    palette: defaultPalette,
    fontSize: {
        normal: 26,
        large: 30,
        largest: 36,
    },
    fontScale: 1,
    radius: 9,
};
