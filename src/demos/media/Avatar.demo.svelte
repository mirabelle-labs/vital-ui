<script lang="ts">
	// The overflow chip matches the avatar size of its group.
	function overflowChipSize(size: 'sm' | 'md' | 'lg'): string {
		if (size === 'sm') {
			return 'size-3xl';
		}
		if (size === 'md') {
			return 'size-10';
		}

		return 'size-4xl';
	}
	import { Avatar, AvatarGroup, FlexRow } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
		{ name: 'shape', type: 'select', options: ['circle', 'square'], default: 'circle' },
		{
			name: 'status',
			type: 'select',
			options: ['none', 'online', 'away', 'busy', 'offline'],
			default: 'none'
		},
		{ name: 'initials', type: 'text', default: 'AM' },
		{ name: 'image', type: 'boolean', default: false, label: 'Use image' }
	]);

	const IMG = 'https://api.dicebear.com/9.x/notionists/svg?seed=vital';
</script>

<Playground name="Avatar" {controls}>
	{#snippet preview(v)}
		<Avatar
			src={v.image ? IMG : undefined}
			alt="Ada"
			initials={v.initials}
			size={v.size}
			shape={v.shape}
			status={v.status === 'none' ? undefined : v.status}
		/>
	{/snippet}

	<DemoSection title="Sizes">
		<FlexRow gap="md" align="end">
			{#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}<Avatar
					initials={size.toUpperCase()}
					{size}
				/>{/each}
		</FlexRow>
	</DemoSection>

	<DemoSection
		title="AvatarGroup"
		description="Overlaps children; add an overflow chip as the last child."
	>
		<FlexRow gap="3xl" wrap>
			{#each ['sm', 'md', 'lg'] as const as size (size)}
				<AvatarGroup {size}>
					<Avatar initials="AM" {size} />
					<Avatar initials="JW" {size} />
					<Avatar initials="KP" {size} />
					<span
						class="inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200 text-[11px] font-semibold {overflowChipSize(
							size
						)}">+5</span
					>
				</AvatarGroup>
			{/each}
		</FlexRow>
	</DemoSection>
</Playground>
