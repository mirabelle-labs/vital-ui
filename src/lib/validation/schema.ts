import { compose, type Rule } from './rules';

/** Errors keyed by field. Absent key = valid field. */
export type Errors<T> = Partial<Record<keyof T, string>>;

/** What createForm expects: values in, errors out. */
export type Validate<T> = (values: T) => Errors<T>;

/** One rule or a list of rules per field. */
export type Schema<T> = { [K in keyof T]?: Rule<T[K], T> | Rule<T[K], T>[] };

/**
 * Builds a `validate` function from per-field rules.
 *
 *   const validate = validateWith<Shipping>({
 *     email: [required(), email()],
 *     zip: required(),
 *     port: [required(), port()]
 *   });
 */
export function validateWith<T extends Record<string, unknown>>(schema: Schema<T>): Validate<T> {
	const fields = Object.keys(schema) as (keyof T)[];

	return (values) => {
		const errors: Errors<T> = {};

		for (const field of fields) {
			const rules = schema[field];

			if (!rules) {
				continue;
			}

			const list: Rule<T[typeof field], T>[] = Array.isArray(rules) ? rules : [rules];
			const error = compose(...list)(values[field], values);

			if (error) {
				errors[field] = error;
			}
		}

		return errors;
	};
}
