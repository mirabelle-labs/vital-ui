import { it, expect } from 'vitest';
import { cn } from '$lib/utils/cn';
it('merges named tokens', () => {
	expect(cn('px-md px-0')).toBe('px-0');
	expect(cn('h-control-md h-8')).toBe('h-8');
	/* Every control step must be listed, not just the middle three: a token
	   tailwind-merge does not know is an unknown class, so the consumer's
	   override silently loses to whichever rule the stylesheet happens to
	   place last. */
	expect(cn('h-control-xs h-10')).toBe('h-10');
	expect(cn('h-control-xl h-12')).toBe('h-12');
	expect(cn('gap-2xs gap-4')).toBe('gap-4');
	expect(cn('text-md text-sm')).toBe('text-sm');
	expect(cn('rounded-lg rounded-2xs')).toBe('rounded-2xs');
	expect(cn('max-w-container-md max-w-container-lg')).toBe('max-w-container-lg');
	expect(cn('max-w-container-md max-w-[1400px]')).toBe('max-w-[1400px]');
});
