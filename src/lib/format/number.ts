/**
 * Number formatting. Every function is pure, locale-aware through options and safe on the
 * server. `Intl` formatters are cached because building them is the expensive part.
 */

export type MoneyOptions = {
	/** ISO 4217 code, default USD. */
	currency?: string;
	/** BCP 47 locale, default en-US. */
	locale?: string;
	/** Drop the cents: "$349" instead of "$349.00". */
	whole?: boolean;
};

const formatterCache = new Map<string, Intl.NumberFormat>();

function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
	const cacheKey = `${locale}|${JSON.stringify(options)}`;
	const cached = formatterCache.get(cacheKey);

	if (cached) {
		return cached;
	}

	const formatter = new Intl.NumberFormat(locale, options);
	formatterCache.set(cacheKey, formatter);
	return formatter;
}

/** 349 → "$349.00" · `{ whole: true }` → "$349" · `{ currency: 'EUR', locale: 'fr-FR' }` → "349,00 €". */
export function money(amount: number, options: MoneyOptions = {}): string {
	const { currency = 'USD', locale = 'en-US', whole = false } = options;

	const formatOptions: Intl.NumberFormatOptions = { style: 'currency', currency };
	if (whole) {
		formatOptions.maximumFractionDigits = 0;
	}

	return numberFormat(locale, formatOptions).format(amount);
}

/** 12 400 → "12.4K", 1 900 000 → "1.9M". */
export function compact(value: number, locale = 'en-US'): string {
	return numberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export type PercentOptions = {
	/** Decimal places, default 0. */
	digits?: number;
	/** The value is already 0–100 rather than 0–1. */
	ofHundred?: boolean;
	locale?: string;
};

/** 0.421 → "42%" · 42.1 with `{ ofHundred: true }` → "42%". */
export function percent(value: number, options: PercentOptions = {}): string {
	const { digits = 0, ofHundred = false, locale = 'en-US' } = options;
	const ratio = ofHundred ? value / 100 : value;

	return numberFormat(locale, { style: 'percent', maximumFractionDigits: digits }).format(ratio);
}

const BYTE_UNITS = ['KB', 'MB', 'GB', 'TB', 'PB'];

/** 1 240 000 → "1.2 MB". Binary units; one decimal below 10, none above. */
export function bytes(size: number): string {
	if (size < 1024) {
		return `${size} B`;
	}

	let value = size / 1024;
	let unitIndex = 0;

	while (value >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
		value /= 1024;
		unitIndex += 1;
	}

	const decimals = value >= 10 ? 0 : 1;
	return `${value.toFixed(decimals)} ${BYTE_UNITS[unitIndex]}`;
}

/** "1" → "1 item", "3" → "3 items". Pass the plural form for irregulars. */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
	const word = count === 1 ? singular : pluralForm;
	return `${count} ${word}`;
}
