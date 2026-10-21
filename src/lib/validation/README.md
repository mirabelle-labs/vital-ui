# Validation

Field rules and schema validation. Pure functions, SSR-safe. Entry point: `@mirabelle-labs/vital-ui/validation`.

A **rule** takes a value and returns an error message, or nothing when the value is valid. A **schema** maps field names to a rule or a list of rules; `validateWith(schema)` turns it into the `validate` option of `createForm`.

```ts
import {
	validateWith,
	required,
	email,
	minLength,
	port
} from '@mirabelle-labs/vital-ui/validation';

const validate = validateWith({
	email: [required(), email()],
	password: [required(), minLength(8)],
	port: port()
});
```

| Rule                                         | Passes when                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `required(message?)`                         | not empty (`isEmpty` treats `null`, `undefined`, whitespace-only strings and `[]` as empty) |
| `pattern(regexp, message?)`                  | matches                                                                                     |
| `email()`                                    | looks like an email address                                                                 |
| `minLength(n)` / `maxLength(n)`              | length bound                                                                                |
| `between(min, max)`                          | number within bounds                                                                        |
| `integer()`                                  | whole number                                                                                |
| `dns1123()`                                  | lowercase letters, digits and dashes (Kubernetes names)                                     |
| `port()`                                     | 1 to 65535                                                                                  |
| `imageRef()`                                 | `repository:tag`                                                                            |
| `oneOf(options)`                             | is one of the options                                                                       |
| `check((value, values) => boolean, message)` | your own test, as a rule; it also receives the whole form                                   |
| `compose(...rules)`                          | first failing rule wins                                                                     |

Every rule except `required` lets an empty value pass, so optional fields stay optional and rules can be stacked without guarding. Rules receive the value and the whole form values.

Tests live in `validation.test.ts`; examples on `/demo/helpers`.
