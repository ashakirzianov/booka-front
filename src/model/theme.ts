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
    palette: Palette,
    fontScale: number,
    fontFamily: FontFamily,
    fontSize: FontSizes,
    radius: number,
};

export type Palettes = {
    light: Palette,
    sepia: Palette,
    dark: Palette,
};
export type PaletteName = keyof Palettes;

export const palettes: Palettes = {
    light: {
        foreground: '#000',
        background: '#fff',
        secondBack: '#eee',
        accent: '#777',
        highlight: '#aaf',
        shadow: '#000',
    },
    sepia: {
        foreground: '#5f3e24',
        background: '#f9f3e9',
        secondBack: '#e6e0d6',
        accent: '#987',
        highlight: '#321',
        shadow: '#000',
    },
    dark: {
        foreground: '#999',
        background: '#000',
        secondBack: '#222',
        accent: '#ddd',
        highlight: '#fff',
        shadow: '#555',
    },
};
export const defaultPaletteName: PaletteName = 'light';

export const defaultTheme: Theme = {
    palette: palettes[defaultPaletteName],
    fontFamily: 'Georgia',
    fontSize: {
        normal: 26,
        large: 30,
        largest: 36,
    },
    fontScale: 1,
    radius: 9,
};
