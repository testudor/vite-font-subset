# Vite Plugin for Generating Font Subsets

Ever wanted to use a custom font just for one word such as a brand name, but didn't want to bloat your bundle size? *This plugin makes it easy!* 

Just specify which characters you need when importing a font and it automatically generates a font subset and modifies the corresponding CSS `@font-face` rule on-the-fly.

## Example Usage

First, add the plugin to your `vite.config.ts`. This will write the generated fonts to `./src/.font-subsets`:

```ts
import { defineConfig } from 'vite';
import { fontSubsetGenerator } from '@testudor/vite-plugin-font-subset';

export default defineConfig({
  plugins: [
    fontSubsetGenerator(),
  ]
});
```
Alternatively, specify a custom path. Just make sure it is accessible by your framework in both dev and prod mode:
```ts
import { defineConfig } from 'vite';
import { fontSubsetGenerator } from '@testudor/vite-plugin-font-subset';

export default defineConfig({
  plugins: [
    fontSubsetGenerator({targetBasePath: './src/my-custom-path'}),
  ]
});
```
Import your font as usual, but add a `?subset=...` query parameter to specify the characters you need:

```html
<script lang="ts">
	import '@fontsource/chakra-petch/latin-700?subset=TESTUDOR'
</script>
```

The default `@font-face` rule will be modified to point to the generated subset file:

*Before:*
```css
/* chakra-petch-latin-700-normal */
@font-face {
  font-family: 'Chakra Petch';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: 
    url(./files/chakra-petch-latin-700-normal.woff2) format('woff2'), 
    url(./files/chakra-petch-latin-700-normal.woff) format('woff');
}
```

*After:*
```css
/* chakra-petch-latin-700-normal */
@font-face {
  font-family: 'Chakra Petch';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: 
    url(${CWD}/src/.font-subsets/subset_f34507bd_chakra-petch-latin-700-normal.woff2) format('woff2'), 
    url(${CWD}/src/.font-subsets/subset_f34507bd_chakra-petch-latin-700-normal.woff) format('woff');
}
```