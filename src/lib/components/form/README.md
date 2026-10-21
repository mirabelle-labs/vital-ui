# Form

Inputs, selection controls and rich pickers. 20 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                             | What it is                                                           | Parts                            |
| ---------------------------------- | -------------------------------------------------------------------- | -------------------------------- |
| [`Input`](./Input)                 | Text input with sizes, invalid state and a leading icon.             | —                                |
| [`Textarea`](./Textarea)           | Multi-line text input.                                               | —                                |
| [`Checkbox`](./Checkbox)           | Labelled checkbox.                                                   | —                                |
| [`Switch`](./Switch)               | Labelled toggle switch.                                              | —                                |
| [`Field`](./Field)                 | Label + control + help/error wrapper that hands the id to its child. | —                                |
| [`RadioGroup`](./RadioGroup)       | Single-choice radio list.                                            | —                                |
| [`Select`](./Select)               | Custom single select composed from options.                          | `SelectOption`                   |
| [`GroupChips`](./GroupChips)       | Segmented pill bar for a single choice.                              | `GroupChip`                      |
| [`Toggle`](./Toggle)               | Pressed/unpressed button and toggle groups.                          | `ToggleGroup`, `ToggleGroupItem` |
| [`ChipsInput`](./ChipsInput)       | Free-text tags: Enter adds, Backspace removes.                       | —                                |
| [`InputFile`](./InputFile)         | Drop zone and click-to-browse file picker.                           | —                                |
| [`Datepicker`](./Datepicker)       | Month calendar for picking a day.                                    | —                                |
| [`QuantityInput`](./QuantityInput) | "- 10 +" stepper.                                                    | —                                |
| [`Rating`](./Rating)               | Stars, readable or clickable, with halves and keyboard support.      | —                                |
| [`Slider`](./Slider)               | One or more thumbs on a track, with locked thumbs and bubbles.       | —                                |
| [`InputOTP`](./InputOTP)           | One-time-code cells with auto-advance and paste.                     | —                                |
| [`Combobox`](./Combobox)           | Searchable single select.                                            | —                                |
| [`MultiSelect`](./MultiSelect)     | Chips + searchable checkbox list.                                    | —                                |
| [`SearchInput`](./SearchInput)     | Search field with clear, loading and shortcut hint.                  | —                                |
| [`TransferList`](./TransferList)   | Dual-panel list to move items between two sets.                      | —                                |

## Layout of a family

```
Form/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/form/<family>` (props panel, generated markup) and a demo in `src/demos/form/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
