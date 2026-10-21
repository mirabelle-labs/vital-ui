/** What the walker knows about the place it is reading. */
export interface Context {
	source: string;
	/** The preview snippet's parameter, which carries the panel values; `null` outside a preview. */
	param: string | null;
	/** Names the template binds around the node: `{#each}` contexts, snippet parameters, `{@const}`. */
	locals: ReadonlySet<string>;
	/**
	 * The snippets among `locals`. Unlike the rest they are printed code that stands or falls with
	 * a reference to them, so a use of one counts.
	 */
	snippets: ReadonlySet<string>;
}

export function withLocals(
	context: Context,
	names: readonly string[],
	snippets: readonly string[] = []
): Context {
	if (names.length === 0 && snippets.length === 0) {
		return context;
	}

	return {
		...context,
		locals: new Set([...context.locals, ...names, ...snippets]),
		snippets: new Set([...context.snippets, ...snippets])
	};
}

/** An expression of the preview, still as source text: the plugin turns it into a function. */
export class ReadCode {
	readonly code: string;

	constructor(code: string) {
		this.code = code;
	}
}
