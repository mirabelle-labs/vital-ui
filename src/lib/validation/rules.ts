/**
 * Field rules for createForm. A rule receives the field value and the whole form, and returns
 * an error message — or `undefined` when the value is fine. Rules never fail on empty values
 * (except `required`), so optional fields stay optional.
 */

export type Rule<V = unknown, T = unknown> = (value: V, values?: T) => string | undefined;

export function isEmpty(value: unknown): boolean {
	if (value === undefined || value === null) {
		return true;
	}
	if (typeof value === 'string') {
		return value.trim() === '';
	}
	if (Array.isArray(value)) {
		return value.length === 0;
	}

	return false;
}

export function required(message = 'Required.'): Rule {
	return (value) => {
		if (isEmpty(value)) {
			return message;
		}

		return undefined;
	};
}

/** Any string matching `expression`. Empty values pass. */
export function pattern(expression: RegExp, message = 'Invalid format.'): Rule {
	return (value) => {
		if (isEmpty(value)) {
			return undefined;
		}
		if (typeof value === 'string' && expression.test(value)) {
			return undefined;
		}

		return message;
	};
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function email(message = 'Enter a valid email address.'): Rule {
	return pattern(EMAIL, message);
}

export function minLength(length: number, message = `At least ${length} characters.`): Rule {
	return (value) => {
		if (isEmpty(value)) {
			return undefined;
		}
		if (typeof value === 'string' && value.trim().length >= length) {
			return undefined;
		}

		return message;
	};
}

export function maxLength(length: number, message = `At most ${length} characters.`): Rule {
	return (value) => {
		if (typeof value === 'string' && value.length > length) {
			return message;
		}

		return undefined;
	};
}

/** Numeric range. Accepts numbers and numeric strings, so it works on text inputs. */
export function between(min: number, max: number, message = `${min} to ${max}.`): Rule {
	return (value) => {
		if (isEmpty(value)) {
			return undefined;
		}

		const n = typeof value === 'number' ? value : Number(value);

		if (Number.isFinite(n) && n >= min && n <= max) {
			return undefined;
		}

		return message;
	};
}

export function integer(message = 'Whole number.'): Rule {
	return (value) => {
		if (isEmpty(value)) {
			return undefined;
		}
		if (/^-?\d+$/.test(String(value))) {
			return undefined;
		}

		return message;
	};
}

/** RFC 1123 label: lowercase letters, digits and dashes, 63 chars max (Kubernetes names, subdomains). */
export function dns1123(message = 'Lowercase letters, digits and dashes.'): Rule {
	return pattern(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/, message);
}

/** TCP/UDP port, 1–65535. */
export function port(message = '1 to 65535.'): Rule {
	return (value) => {
		if (isEmpty(value)) {
			return undefined;
		}

		const n = Number(value);

		if (Number.isInteger(n) && n >= 1 && n <= 65535) {
			return undefined;
		}

		return message;
	};
}

/** Container image reference of the form "repository:tag". */
export function imageRef(message = 'Use repository:tag.'): Rule {
	return pattern(/^[\w./-]+:[\w.-]+$/, message);
}

export function oneOf<V>(options: readonly V[], message = 'Pick one of the options.'): Rule<V> {
	return (value) => {
		if (isEmpty(value) || options.includes(value)) {
			return undefined;
		}

		return message;
	};
}

/** Any predicate, for the rules that are specific to one form (password confirmation…). */
export function check<V, T = unknown>(
	predicate: (value: V, values: T) => boolean,
	message: string
): Rule<V, T> {
	return (value, values) => {
		// Inside a schema the form values are always passed; standalone calls get an empty object.
		if (predicate(value, (values ?? {}) as T)) {
			return undefined;
		}

		return message;
	};
}

/** Runs the rules in order; the first failure wins. */
export function compose<V, T = unknown>(...rules: Rule<V, T>[]): Rule<V, T> {
	return (value, values) => {
		for (const rule of rules) {
			const error = rule(value, values);

			if (error) {
				return error;
			}
		}

		return undefined;
	};
}
