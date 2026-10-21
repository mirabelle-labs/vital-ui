import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Styles a block of long-form article HTML (headings, paragraphs, lists,
 * quotes, code, figures, links) with the Vital type rhythm — no per-element
 * classes needed.
 */
export const proseVariants = cva(
	[
		'text-fg-muted',
		// headings
		'[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-fg [&_h2]:mb-2xs',
		'[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-fg [&_h3]:mt-2xl [&_h3]:mb-xs',
		// body
		'[&_p]:text-[15px] [&_p]:leading-7 [&_p]:mb-md',
		'[&_strong]:font-semibold [&_strong]:text-fg [&_em]:italic',
		'[&_a]:text-link [&_a]:font-medium [&_a]:underline-offset-2 hover:[&_a]:underline',
		// lists
		'[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2xs [&_ul]:mb-lg [&_ul]:text-[15px]',
		'[&_li]:flex [&_li]:gap-2.5',
		"[&_li]:before:content-[''] [&_li]:before:mt-2xs [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-primary-500 [&_li]:before:shrink-0",
		// quote
		'[&_blockquote]:border-s-[3px] [&_blockquote]:border-primary-500 [&_blockquote]:ps-md [&_blockquote]:my-xl [&_blockquote]:text-lg [&_blockquote]:italic [&_blockquote]:text-fg',
		// code
		'[&_pre]:text-xs [&_pre]:font-mono [&_pre]:p-md [&_pre]:rounded-control [&_pre]:bg-night [&_pre]:text-gray-100 [&_pre]:overflow-x-auto [&_pre]:my-xl',
		'[&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em] [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-4xs [&_:not(pre)>code]:rounded-inline [&_:not(pre)>code]:border [&_:not(pre)>code]:border-line [&_:not(pre)>code]:bg-surface-2 [&_:not(pre)>code]:text-fg-muted',
		// figure / rule
		'[&_figure]:my-xl [&_figcaption]:text-xs [&_figcaption]:text-fg-subtle [&_figcaption]:text-center [&_figcaption]:mt-2xs',
		'[&_hr]:border-line [&_hr]:my-xl'
	],
	{
		variants: {
			/** Measure (max line length). */
			width: {
				narrow: 'max-w-container-xl',
				default: 'max-w-container-2xl',
				wide: 'max-w-container-4xl',
				full: 'max-w-none'
			}
		},
		defaultVariants: { width: 'default' }
	}
);

export type ProseVariants = VariantProps<typeof proseVariants>;
