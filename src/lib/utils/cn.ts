import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Named spacing scale from `src/lib/tokens/scale.css` (used by p/m/gap/w/h/size/inset…). */
const SPACING_TOKENS = [
	'4xs',
	'3xs',
	'2xs',
	'xs',
	'sm',
	'md',
	'lg',
	'xl',
	'2xl',
	'3xl',
	'4xl',
	'control-xs',
	'control-sm',
	'control-md',
	'control-lg',
	'control-xl'
];

/** `--container-*` sizes exposed through the custom `max-w-container-*` utility. */
const CONTAINER_TOKENS = [
	'3xs',
	'2xs',
	'xs',
	'sm',
	'md',
	'lg',
	'xl',
	'2xl',
	'3xl',
	'4xl',
	'5xl',
	'6xl',
	'7xl'
];

/**
 * tailwind-merge only knows Tailwind's default scale. Teach it the design
 * system's named tokens so `px-md px-0` → `px-0` and consumer `class`
 * overrides beat CVA classes.
 */
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			spacing: SPACING_TOKENS,
			text: ['2xs', 'md'],
			radius: ['2xs']
		},
		classGroups: {
			'max-w': [{ 'max-w-container': CONTAINER_TOKENS }]
		}
	}
});

/**
 * Merge Tailwind classes safely: clsx resolves conditionals, tailwind-merge
 * dedupes conflicting utilities (e.g. `px-2 px-4` → `px-4`).
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
