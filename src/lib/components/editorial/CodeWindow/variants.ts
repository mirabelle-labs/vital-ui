import { cva } from 'class-variance-authority';

/** Dark editor chrome (traffic lights + filename) wrapping a code block. */
export const codeWindowVariants = cva(
	'rounded-surface border border-white/10 bg-night overflow-hidden shadow-raised'
);
export const codeWindowBarVariants = cva(
	'flex items-center gap-2xs px-md h-control-md border-b border-white/10'
);
export const codeWindowLightVariants = cva('size-2.5 rounded-full', {
	variants: {
		light: { close: 'bg-window-close', minimize: 'bg-window-minimize', zoom: 'bg-window-zoom' }
	},
	defaultVariants: { light: 'close' }
});
export const codeWindowFilenameVariants = cva('ms-2xs text-xs text-white/45 font-mono');
export const codeWindowLangVariants = cva('ms-auto text-[11px] text-white/30 font-mono');
/** Styles the `<pre>` a parent may pass as children; a nested CodeBlock already carries its own. */
export const codeWindowBodyVariants = cva(
	'[&>pre]:p-lg [&>pre]:text-xs [&>pre]:font-mono [&>pre]:leading-6 [&>pre]:overflow-x-auto [&>pre]:scrollbar-dark [&>pre]:text-code-plain'
);
