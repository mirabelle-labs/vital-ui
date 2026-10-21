import { cva } from 'class-variance-authority';

/** Site footer: brand block · link columns (compose <FooterColumn>s) · bottom bar. */
export const footerVariants = cva('bg-surface border-t border-line');
/** Same column as the bar above it and the content between them (`Container size="lg"`). */
export const footerInnerVariants = cva('max-w-container-6xl mx-auto px-lg sm:px-3xl py-4xl');
export const footerLayoutVariants = cva('flex flex-col lg:flex-row gap-10');
export const footerBrandVariants = cva('lg:w-72 shrink-0 flex flex-col gap-xs');
export const footerColumnsVariants = cva('flex-1 grid grid-cols-2 md:grid-cols-4 gap-3xl');
export const footerBottomVariants = cva('border-t border-line');
export const footerBottomInnerVariants = cva(
	'max-w-container-6xl mx-auto px-lg sm:px-3xl py-lg flex flex-col sm:flex-row items-center justify-between gap-xs text-xs text-fg-subtle'
);

export const footerColumnVariants = cva('flex flex-col gap-xs');
export const footerColumnTitleVariants = cva(
	'text-[11px] font-semibold uppercase tracking-[0.12em] text-fg-subtle'
);
/** Plain <a> children are styled automatically. */
export const footerColumnLinksVariants = cva(
	'flex flex-col gap-2.5 text-sm [&_a]:text-fg-muted [&_a:hover]:text-fg [&_a]:transition-colors [&_a]:no-underline [&_a]:rounded-2xs [&_a]:focus-ring [&_a]:w-fit'
);
