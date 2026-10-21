import type { DemoCategory, DemoComponent } from './types';
import { toSlug } from './slug';

const c = (name: string, description: string, slug = toSlug(name)): DemoComponent => ({
	slug,
	name,
	description
});

export const categories: DemoCategory[] = [
	{
		slug: 'typography',
		label: 'Typography',
		icon: 'fa-font',
		description: 'Text, headings, links, code and long-form prose.',
		components: [
			c('Text', 'Polymorphic text element with size, weight, color, alignment and truncation.'),
			c('Heading', 'Semantic h1–h6 with a visual size decoupled from the level.'),
			c(
				'Link',
				'Inline anchor with default, muted and standalone styles; auto-detects external URLs.'
			),
			c('Code', 'Inline code or a block with a language label.'),
			c('Prose', 'Article rhythm for raw HTML or rendered Markdown.')
		]
	},
	{
		slug: 'layout',
		label: 'Layout',
		icon: 'fa-table-columns',
		description: 'Containers, stacks, grids, page bands and the app shell.',
		components: [
			c('Container', 'Centered max-width wrapper with optional horizontal padding.'),
			c('FlexCol', 'Vertical flex on the spacing scale, with alignment, growth and rules.'),
			c('FlexRow', 'Horizontal flex with gap, alignment, justification, wrapping and growth.'),
			c('ScrollArea', 'Scroll container with themed scrollbars and edge fades.'),
			c('Grid', 'Responsive grid: per-breakpoint columns, or auto-fit from a minimum width.'),
			c('Section', 'Page band with tone, padding, seam border and an optional container.'),
			c('Divider', 'Rule between blocks or between items in a row; optionally labelled.'),
			c('SectionHeader', 'Eyebrow, title, description and trailing actions for a section.'),
			c('PageHeader', 'Breadcrumb, back, title, meta and actions at the top of a view.'),
			c('Split', 'Main column plus a sticky aside, without hand-written col-spans.'),
			c('Spacer', 'Pushes what follows to the end of a flex row or column.')
		]
	},
	{
		slug: 'button',
		label: 'Buttons',
		icon: 'fa-hand-pointer',
		description: 'Actions, icon buttons, groups and decorative tiles.',
		components: [
			c('Button', 'Primary action with nine variants, five sizes, loading and block modes.'),
			c('IconButton', 'Square or round icon-only button.'),
			c('ButtonGroup', 'Attaches buttons into one segmented control.'),
			c('SplitButton', 'Main action attached to a dropdown caret.'),
			c('ActiveButton', 'Toggle button for filters, sorts and view switches.'),
			c('IconBlock', 'Decorative icon tile for feature cards and list rows.')
		]
	},
	{
		slug: 'badge',
		label: 'Badges',
		icon: 'fa-certificate',
		description: 'Status labels and removable tags.',
		components: [
			c('Badge', 'Subtle or solid label with six colors and an optional status dot.'),
			c('Tag', 'Rounded pill, optionally removable.')
		]
	},
	{
		slug: 'feedback',
		label: 'Feedback',
		icon: 'fa-bell',
		description: 'Alerts, progress, loading states and status indicators.',
		components: [
			c('Alert', 'Inline message with icon, title, body and dismiss.'),
			c('Banner', 'Full-width page-level message bar.'),
			c('Callout', 'Left-accented note block.'),
			c(
				'Result',
				'What a container shows instead of content: empty, no match, nothing selected, error, done.'
			),
			c('Dot', 'Tiny status dot, optionally pulsing or ringed.'),
			c('LatencyIndicator', 'Signal-strength bars for connection quality.'),
			c('Progress', 'Horizontal progress bar.'),
			c('ProgressRing', 'Circular progress with a centered label.'),
			c('Skeleton', 'Pulsing placeholders: shapes, text, cards, lists and tables.'),
			c('Spinner', 'Rotating loading indicator.'),
			c('StatusPill', 'Bordered pill with a status dot.')
		]
	},
	{
		slug: 'form',
		label: 'Form',
		icon: 'fa-pen-to-square',
		description: 'Inputs, selection controls and rich pickers.',
		components: [
			c('Input', 'Text input with sizes, invalid state and a leading icon.'),
			c('Textarea', 'Multi-line text input.'),
			c('Checkbox', 'Labelled checkbox.'),
			c('Switch', 'Labelled toggle switch.'),
			c('Field', 'Label + control + help/error wrapper that hands the id to its child.'),
			c('RadioGroup', 'Single-choice radio list.'),
			c('Select', 'Custom single select composed from options.'),
			c('GroupChips', 'Segmented pill bar for a single choice.'),
			c('Toggle', 'Pressed/unpressed button and toggle groups.'),
			c('ChipsInput', 'Free-text tags: Enter adds, Backspace removes.'),
			c('InputFile', 'Drop zone and click-to-browse file picker.'),
			c('Datepicker', 'Month calendar for picking a day.'),
			c('QuantityInput', '"- 10 +" stepper.'),
			c('Rating', 'Stars, readable or clickable, with halves and keyboard support.'),
			c('Slider', 'One or more thumbs on a track, with locked thumbs and bubbles.'),
			c('InputOTP', 'One-time-code cells with auto-advance and paste.'),
			c('Combobox', 'Searchable single select.'),
			c('MultiSelect', 'Chips + searchable checkbox list.'),
			c('SearchInput', 'Search field with clear, loading and shortcut hint.'),
			c('TransferList', 'Dual-panel list to move items between two sets.')
		]
	},
	{
		slug: 'surface',
		label: 'Surface',
		icon: 'fa-square',
		description: 'Cards composed from header, bars, body and footer.',
		components: [
			c('Card', 'Bordered surface with optional header, body padding and footer bar.'),
			c('CardBar', 'Control row attached to the top or the bottom of a Card.')
		]
	},
	{
		slug: 'media',
		label: 'Media',
		icon: 'fa-user',
		description: 'Avatars, groups and anchored badges.',
		components: [
			c('Image', 'Picture with a reserved ratio, a skeleton and a fallback.'),
			c('Avatar', 'Image or initials with sizes, shapes, a presence dot, and stacked groups.'),
			c('OverlayBadge', 'Anchors a status dot or count to a corner of any child.')
		]
	},
	{
		slug: 'data',
		label: 'Data',
		icon: 'fa-table',
		description: 'Tables, KPI tiles, lists and timelines.',
		components: [
			c('DataTable', 'Table with sorting, selection, loading and empty states.'),
			c('List', 'Rows with a leading slot, title, description, meta and actions.'),
			c('Table', 'Table primitives: rows, header cells, cells and a bordered container.'),
			c('Stat', 'KPI tile with delta and footer slot.'),
			c('Sparkline', 'Tiny inline line chart.'),
			c('DescriptionList', 'Key/value rows.'),
			c('Timeline', 'Vertical activity feed.'),
			c('SortableList', 'Drag-to-reorder list with keyboard support.')
		]
	},
	{
		slug: 'charts',
		label: 'Charts',
		icon: 'fa-chart-simple',
		description: 'Dependency-free SVG charts.',
		components: [
			c('BarChart', 'Vertical bars with a highlighted maximum.'),
			c('AreaChart', 'Time-series line with gradient fill.'),
			c('DonutChart', 'Donut with center label and legend.'),
			c('BarList', 'Ranked horizontal bars.')
		]
	},
	{
		slug: 'nav',
		label: 'Navigation',
		icon: 'fa-compass',
		description: 'Tabs, accordions, steppers, breadcrumbs and pagination.',
		components: [
			c('Tabs', 'Tab list + panels driven by a bound value.'),
			c('Accordion', 'Single-open disclosure list.'),
			c('Collapsible', 'Standalone disclosure with a stateful trigger.'),
			c('Stepper', 'Horizontal progress through numbered steps.'),
			c('Breadcrumb', 'Hierarchical path with a current page.'),
			c('Pagination', 'Page buttons with siblings and ellipses.')
		]
	},
	{
		slug: 'overlay',
		label: 'Overlay',
		icon: 'fa-layer-group',
		description: 'Tooltips, popovers, dialogs, drawers, menus, toasts and the command palette.',
		components: [
			c('Tooltip', 'Hover label with four placements.'),
			c('Popover', 'Click-toggled floating panel.'),
			c('HoverCard', 'Hover-triggered preview card with delays.'),
			c('Dialog', 'Modal with title, body and footer.'),
			c('AlertDialog', 'Confirmation modal with cancel/confirm.'),
			c('Drawer', 'Side sheet sliding from an edge.'),
			c('Menu', 'Dropdown menu with items and separators.'),
			c('Toaster', 'Toast stack driven by the `toast()` helper.'),
			c('CommandPalette', '⌘K palette with filtered groups and items.')
		]
	},
	{
		slug: 'app',
		label: 'App shell',
		icon: 'fa-window-maximize',
		description: 'The console frame, sidebar, navbar, user menu and footer.',
		components: [
			c('AppShell', 'Console frame: sticky sidebar, sticky top bar, scrolling main.'),
			c('Sidebar', 'App sidebar with sections and rows.'),
			c('UserMenu', 'Avatar + name trigger opening a menu.'),
			c('Navbar', 'Top bar with brand, links and actions.'),
			c('Footer', 'Site footer with brand, link columns and bottom bar.')
		]
	},
	{
		slug: 'editorial',
		label: 'Editorial',
		icon: 'fa-newspaper',
		description: 'Kickers, highlights, handwritten notes and code blocks.',
		components: [
			c('Eyebrow', 'Small uppercase kicker above a heading.'),
			c('Mark', 'Marker-stroke highlight behind inline text.'),
			c('HandNote', 'Handwritten margin annotation.'),
			c('CodeBlock', 'Syntax-highlighted source with a swappable highlighter.'),
			c('CodeWindow', 'Dark editor chrome around a code block.'),
			c('CopyCommand', 'Monospace command with a copy button.')
		]
	},
	{
		slug: 'misc',
		label: 'Misc',
		icon: 'fa-shapes',
		description: 'Icons, keyboard hints, toolbars and primitives.',
		components: [
			c('Icon', 'Font Awesome glyph in a square footprint.'),
			c('Kbd', 'Keyboard key cap.'),
			c('Toolbar', 'Control bar with buttons, groups and separators.'),
			c('Polymorphic', 'Renders any tag via the "as" prop.'),
			c('VariantProvider', 'Propagates variant/size/color defaults to descendants.')
		]
	}
];
