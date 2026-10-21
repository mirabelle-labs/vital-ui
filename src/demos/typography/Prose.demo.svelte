<script lang="ts">
	import { Prose } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'width',
			type: 'select',
			options: ['narrow', 'default', 'wide', 'full'],
			default: 'default'
		}
	]);
</script>

<Playground name="Prose" {controls} canvasClass="items-start justify-start">
	{#snippet preview(v)}
		<Prose width={v.width}>
			<h2>Designing with tokens</h2>
			<p>
				A design token is a <strong>named decision</strong>: a spacing step, a radius, a color.
				Components reference tokens instead of raw values, so <em>one change</em> flows through the whole
				library.
			</p>
			<h3>Why it matters</h3>
			<ul>
				<li>Consistency without policing every pull request.</li>
				<li>Theming becomes a matter of swapping a CSS file.</li>
				<li>Dark mode is a variant, not a rewrite.</li>
			</ul>
			<blockquote>Ship the system, not the screen.</blockquote>
			<p>
				Inline code such as <code>bg-surface-2</code> maps straight to a token, and larger samples sit
				in a block:
			</p>
			<pre>{`@theme {
  --spacing-control-md: 40px;
}`}</pre>
			<figure>
				<hr />
				<figcaption>A rule, then a caption.</figcaption>
			</figure>
			<p>Links keep their <a href="/demo">semantic tint</a> inside prose.</p>
		</Prose>
	{/snippet}
</Playground>
