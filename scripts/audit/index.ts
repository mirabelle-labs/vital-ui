/**
 * Cross-checks every `variants.ts` against its siblings and prints only the outliers.
 * Static (no component is run) and free of any model: `pnpm audit:variants`.
 *
 *   --strict    exit 1 when a finding is not in the baseline (for CI)
 *   --baseline  add today's new findings to the baseline with a TODO reason to replace by hand
 *   --all       show the baseline too
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { allChecks, type Finding } from './checks.ts';
import { readCvas } from './parseVariants.ts';

const ROOT = process.cwd();
const BASELINE = 'scripts/audit/baseline.json';
const args = new Set(process.argv.slice(2));

function palettes(): Set<string> {
	const css = readFileSync(`${ROOT}/src/lib/tokens/palette.css`, 'utf8');

	return new Set([...css.matchAll(/--color-([a-z]+)-\d+/g)].map((match) => match[1] ?? ''));
}

/** Reviewed exceptions: finding id → why it is intentional. */
function baseline(): Record<string, string> {
	return existsSync(`${ROOT}/${BASELINE}`)
		? (JSON.parse(readFileSync(`${ROOT}/${BASELINE}`, 'utf8')) as Record<string, string>)
		: {};
}

function print(findings: Finding[]): void {
	const byCheck = Map.groupBy(findings, (finding) => finding.check);

	for (const [check, items] of byCheck) {
		console.log(`\n${check} (${items.length})`);
		for (const item of items) {
			console.log(`  ${item.where}  ${item.message}`);
		}
	}
}

const cvas = readCvas(ROOT);
const findings = allChecks(cvas, palettes());

if (args.has('--baseline')) {
	const known = baseline();
	const added = findings.filter((finding) => !(finding.id in known));

	for (const finding of added) {
		known[finding.id] = 'TODO: say why this is intentional';
	}
	writeFileSync(`${ROOT}/${BASELINE}`, `${JSON.stringify(known, null, '\t')}\n`);
	console.log(`Baseline: ${added.length} added to ${BASELINE}.`);
} else {
	const known = baseline();
	const fresh = findings.filter((finding) => !(finding.id in known));

	print(args.has('--all') ? findings : fresh);
	console.log(
		`\n${cvas.length} cva() read · ${fresh.length} new · ${findings.length - fresh.length} in baseline`
	);
	if (args.has('--strict') && fresh.length > 0) {
		process.exitCode = 1;
	}
}
