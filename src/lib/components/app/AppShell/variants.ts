import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The console frame: a sticky sidebar, a sticky top bar and a scrolling main
 * region. Three pages were hand-writing this with a raw `z-30`, three different
 * gutters and their own decision about whether the content column has a gap —
 * which made a view written for one shell unusable in the other.
 */
export const appShellVariants = cva('flex min-h-svh bg-page');

/** Holds the sidebar at full height; hidden below `lg`, where a Drawer takes over. */
export const appShellSidebarVariants = cva('hidden lg:block sticky top-0 h-svh shrink-0');

export const appShellBodyVariants = cva('flex flex-1 flex-col min-w-0');

export const appShellHeaderVariants = cva(
	'sticky top-0 z-nav border-b border-line bg-surface/85 backdrop-blur-md'
);

export const appShellHeaderInnerVariants = cva(
	'flex items-center gap-xs h-16 px-md lg:px-xl min-w-0'
);

export const appShellMainVariants = cva('flex-1 min-w-0 p-md lg:p-xl');

/**
 * The content column inside `main`. It owns the measure AND the vertical rhythm,
 * so a view never has to know which shell it is mounted in.
 */
export const appShellContentVariants = cva('mx-auto w-full flex flex-col', {
	variants: {
		width: { lg: 'max-w-container-6xl', xl: 'max-w-[1400px]', full: 'max-w-none' },
		gap: { none: 'gap-0', md: 'gap-md', lg: 'gap-lg', xl: 'gap-xl' }
	},
	defaultVariants: { width: 'xl', gap: 'lg' }
});

export type AppShellContentVariants = VariantProps<typeof appShellContentVariants>;
