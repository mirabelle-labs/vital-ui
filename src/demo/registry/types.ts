export interface DemoComponent {
	/** URL segment, kebab-case. */
	slug: string;
	/** PascalCase export name; also the demo file name (`<name>.demo.svelte`). */
	name: string;
	description: string;
}

export interface DemoCategory {
	slug: string;
	label: string;
	/** Font Awesome glyph, e.g. "fa-font". */
	icon: string;
	description: string;
	components: DemoComponent[];
}

/** A component together with the category that lists it. */
export interface RegisteredComponent {
	category: DemoCategory;
	component: DemoComponent;
}
