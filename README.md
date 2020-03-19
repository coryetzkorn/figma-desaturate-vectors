# Desaturate Vectors

This Figma plugin converts any vector object from color to grayscale.

Typically, desaturating a _bitmap_ image only requires a single command in most image editing software. This plugin makes vector desaturation just as simple – only one step!

## Usage

1. Select any number of vector objects.
Frames and groups are OK too 😀
2. Run `Desaturate Vectors` from plugins menu.

The plugin will find all find all vector objects within your selection and desaturate them, effectively making them black-and-white.

## Support
This plugin works on most objects including:
+ Any vector shape
+ Lines
+ Text

And it can even handle edge cases such as:
+ Objects with multiple strokes or fills
+ Gradient fills

Note that it _does not_ work on bitmap images.

For those, you can use Figma's built-in `saturation` slider, located in the image fill panel:

## Algorthim
To convert most accuratelt, colors to account for their luminosity.

## Context

When texts with SF fonts are rendered on iOS, their variant and tracking (letter spacing) are adjusted based on their point size and the user's accessibility settings. In Figma, the tracking must be manually applied to get a more accurate representation. Hence, **Fix San Francisco** is here to automate this process for you ♥
