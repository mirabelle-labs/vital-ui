import { ReadCode } from './context';

const PLACEHOLDER = /"@@read:(\d+)@@"/g;

/**
 * A value as the JavaScript expression that rebuilds it. Plain data goes through JSON; every
 * `ReadCode` in it becomes `(param) => (expression)`, compiled with the demo so the expression
 * sees whatever the file declares.
 */
export function toExpression(value: unknown, param: string | null): string {
	const reads: ReadCode[] = [];
	const json = JSON.stringify(value, (_key, entry: unknown) => {
		if (entry instanceof ReadCode) {
			reads.push(entry);

			return `@@read:${reads.length - 1}@@`;
		}

		return entry;
	});

	return json.replace(PLACEHOLDER, (_match, index: string) => {
		const read = reads[Number(index)];

		return `(${param ?? '_'}) => (${read?.code ?? 'undefined'})`;
	});
}
