/**
 * What the build derives from a demo file and the browser prints from.
 *
 * The same shapes serve both sides. The plugin builds them with `R` standing for the source of
 * an expression (`ReadSource`); once they are compiled into the demo, `R` is a function that
 * reads the current panel values (`Read`). Nothing here is written by hand in a demo.
 */

/** The values the props panel holds, keyed by control name. */
export type PanelValues = Readonly<Record<string, unknown>>;

/** An expression of the preview, compiled into the demo so it can see everything the file declares. */
export type Read = (values: PanelValues) => unknown;

/**
 * A piece of printed code that may hold the panel's current values.
 *
 * `uses` lists the names of the demo file the code leans on, so the script printed above it
 * keeps only what it needs.
 */
export interface Code<R> {
	parts: CodePart<R>[];
	uses: string[];
}

export type CodePart<R> =
	| string
	/** The current value of a control, written as a literal. `access` turns `[v.key]` into `.key`. */
	| { lit: R; access?: boolean }
	/** Whichever branch the panel currently selects, as `a ? b : c` would at runtime. */
	| { pick: R; yes: Code<R>; no: Code<R> };

/** One attribute of a tag. Without `read` it is printed as `code` says; with it, by its value. */
export interface Attr<R> {
	name?: string;
	read?: R;
	/** The control the attribute passes through unchanged (`size={v.size}` → `size`). */
	prop?: string;
	code: Code<R>;
}

export interface Section<R> {
	head: Code<R>;
	body: Item<R>[];
}

export type Item<R> =
	/** Inline text, already normalised. */
	| { kind: 'text'; text: string; uses: string[] }
	/** An `{expression}` in text position that reads the panel. */
	| { kind: 'value'; read?: R; code: Code<R> }
	/** Markup already laid out (relative indentation only), because nothing in it changes. */
	| { kind: 'block'; text: string; uses: string[] }
	/** A line of its own: `{@const …}`, `{@render …}`. */
	| { kind: 'line'; code: Code<R> }
	| {
			kind: 'tag';
			name: string;
			attrs: Attr<R>[];
			children: Item<R>[];
			uses: string[];
			/** May be written `<Name />` when it ends up empty. */
			selfClosing: boolean;
	  }
	/** `{#if}`/`{#each}`/`{#snippet}`…: heads and bodies, then one closing tag. */
	| {
			kind: 'section';
			sections: Section<R>[];
			close: string;
			omitIfEmpty: boolean;
			/** A snippet declared in the markup: printed only while something printed refers to it. */
			declares?: string;
	  }
	/** An `{#if}` chain whose tests read the panel: only the selected branch is printed. */
	| { kind: 'cond'; branches: { test: R | null; body: Item<R>[] }[] };

export type ReadSource = { readonly code: string };

/** One binding of a demo's `<script>`, ready to be printed again. */
export interface ImportEntry {
	local: string;
	imported: string;
	from: string;
	kind: 'named' | 'default' | 'namespace';
	typeOnly: boolean;
}

export interface DeclarationEntry {
	names: string[];
	text: string;
	uses: string[];
}

export interface SnippetEntry {
	name: string;
	text: string;
	uses: string[];
}

/** Everything a demo file declares that printed markup may lean on. */
export interface ScopeTable {
	imports: ImportEntry[];
	declarations: DeclarationEntry[];
	snippets: SnippetEntry[];
}

/** The `template` the plugin hands to `<Playground>`. */
export interface PreviewTemplate {
	nodes: Item<Read>[];
	scope: ScopeTable;
}
