/**
 * Registry of the real-world pages under /demo/pages.
 * Drives the gallery, the demo sidebar/palette entries and the return pill.
 */
export type PageLink = { label: string; href: string };

export type PageEntry = {
	slug: string;
	title: string;
	tagline: string;
	description: string;
	/** Font Awesome glyph. */
	icon: string;
	/** Primary route. */
	href: string;
	/** Extra entry points (multi-route families). */
	links?: PageLink[];
	/** Main components exercised, shown as tags in the gallery. */
	uses: string[];
};

export const PAGES: PageEntry[] = [
	{
		slug: 'saas',
		title: 'Orbit — SaaS landing',
		tagline: 'B2B product analytics',
		description:
			'Classic marketing page: sticky navbar, hero with a live dashboard mock, features, deep-dives, pricing toggle, FAQ and footer.',
		icon: 'fa-rocket',
		href: '/demo/pages/saas',
		uses: ['Navbar', 'Section', 'Stat', 'AreaChart', 'CodeWindow', 'Accordion', 'Footer']
	},
	{
		slug: 'shop',
		title: 'Aurel Store — shop',
		tagline: 'Listing · product · checkout',
		description:
			'Complete e-commerce flow with filters, pagination, product gallery and tabs, cart drawer and a four-step checkout with OTP verification.',
		icon: 'fa-bag-shopping',
		href: '/demo/pages/shop',
		links: [
			{ label: 'Listing', href: '/demo/pages/shop' },
			{ label: 'Product', href: '/demo/pages/shop/product/aurel-one' },
			{ label: 'Checkout', href: '/demo/pages/shop/checkout' }
		],
		uses: ['Slider', 'Pagination', 'QuantityInput', 'Stepper', 'InputOTP', 'Drawer', 'Table']
	},
	{
		slug: 'extranet',
		title: 'Acme — client portal',
		tagline: 'Agency ↔ client extranet',
		description:
			'App shell with sidebar views: overview dashboard, projects, invoices table, support tickets thread and documents with upload and delete flows.',
		icon: 'fa-building-user',
		href: '/demo/pages/extranet',
		uses: ['Sidebar', 'UserMenu', 'Stat', 'BarChart', 'Toolbar', 'Timeline', 'AlertDialog']
	},
	{
		slug: 'k8s',
		title: 'Kubernetes console',
		tagline: 'Cluster admin with node sidebar',
		description:
			'Fleet console: nodes with live status in the sidebar, Lens-style node detail (gauges, pods, conditions, YAML), apps you can scale, restart and roll out, services and ingress you can expose and edit, cluster events.',
		icon: 'fa-dharmachakra',
		href: '/demo/pages/k8s',
		uses: [
			'SidebarItem',
			'ProgressRing',
			'Tabs',
			'Drawer',
			'QuantityInput',
			'Combobox',
			'CommandPalette',
			'AlertDialog'
		]
	}
];

export function findPage(pathname: string): PageEntry | undefined {
	return PAGES.find((p) => pathname === p.href || pathname.startsWith(`${p.href}/`));
}
