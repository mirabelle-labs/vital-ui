import { cva, type VariantProps } from 'class-variance-authority';

export const stepperVariants = cva('flex items-center');

export const stepVariants = cva('flex items-center', {
	variants: {
		last: { true: '', false: 'flex-1' }
	},
	defaultVariants: { last: false }
});

export const stepCircleVariants = cva(
	'size-3xl rounded-full flex items-center justify-center text-sm font-semibold',
	{
		variants: {
			state: {
				done: 'bg-primary-600 text-white',
				active: 'bg-primary-600 text-white ring-4 ring-primary-500/20',
				todo: 'bg-surface border-2 border-line text-fg-subtle'
			}
		},
		defaultVariants: { state: 'todo' }
	}
);

export const stepLabelVariants = cva('text-[11px] font-medium', {
	variants: {
		state: { done: 'text-fg', active: 'text-fg', todo: 'text-fg-subtle' }
	},
	defaultVariants: { state: 'todo' }
});

export const stepConnectorVariants = cva('flex-1 h-0.5 mx-3xs -mt-lg', {
	variants: {
		done: { true: 'bg-primary-600', false: 'bg-line' }
	},
	defaultVariants: { done: false }
});

export type StepState = NonNullable<VariantProps<typeof stepCircleVariants>['state']>;
