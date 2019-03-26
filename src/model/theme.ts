export type FontFamily = 'Georgia';
export type FontSize = number;
export type Color = string;

export type Theme = {
    fontFamily: FontFamily,
    foregroundColor: Color,
    backgroundColor: Color,
    fontSize: {
        normal: FontSize,
        large: FontSize,
        largest: FontSize,
    },
};
