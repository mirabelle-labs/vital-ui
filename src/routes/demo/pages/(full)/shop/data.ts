export type Category = 'headphones' | 'earbuds' | 'speakers' | 'accessories';

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
	{ value: 'headphones', label: 'Headphones', icon: 'fa-headphones' },
	{ value: 'earbuds', label: 'Earbuds', icon: 'fa-ear-listen' },
	{ value: 'speakers', label: 'Speakers', icon: 'fa-volume-high' },
	{ value: 'accessories', label: 'Accessories', icon: 'fa-plug' }
];

export type ProductColor = { name: string; swatch: string };

export type Product = {
	slug: string;
	name: string;
	category: Category;
	price: number;
	compareAt?: number;
	rating: number;
	reviews: number;
	colors: ProductColor[];
	badge?: 'new' | 'sale' | 'bestseller';
	img: string;
	gallery: string[];
	short: string;
	description: string;
	specs: { term: string; value: string }[];
	stock: number;
};

const GRAPHITE = { name: 'Graphite', swatch: 'bg-gray-700' };
const BONE = { name: 'Bone', swatch: 'bg-orange-50' };
const OXBLOOD = { name: 'Oxblood', swatch: 'bg-danger-900' };
const BLACK = { name: 'Black', swatch: 'bg-gray-950' };
const SAND = { name: 'Sand', swatch: 'bg-warning-100' };
const OLIVE = { name: 'Olive', swatch: 'bg-success-800' };

const unsplash = (id: string, w = 1000) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const PRODUCTS: Product[] = [
	{
		slug: 'aurel-one',
		name: 'Aurel One',
		category: 'headphones',
		price: 349,
		rating: 4.9,
		reviews: 1214,
		colors: [GRAPHITE, BONE, OXBLOOD],
		badge: 'new',
		img: unsplash('1546435770-a3e426bf472b'),
		gallery: [
			unsplash('1546435770-a3e426bf472b'),
			unsplash('1484704849700-f032a568e944'),
			unsplash('1583394838336-acd977736f90'),
			unsplash('1524678606370-a47ad25cb82a')
		],
		short: 'Closed-back flagship. 40 h battery, hybrid ANC, beryllium drivers.',
		description:
			'<p>Aurel One is the closed-back headphone we spent five years on. Beryllium-coated 32 mm drivers hit a mastering-grade target curve within 1 dB, and the six-microphone hybrid noise cancelling removes engine rumble and office hiss without the vacuum pressure of older systems.</p><p>Every part you touch is aluminium or full-grain leather. Ear pads, headband and cables are user-replaceable, and we service drivers and batteries for at least ten years.</p><ul><li>40 hours with ANC, 60 without, 10-minute charge for 5 hours</li><li>USB-C lossless at 24-bit / 96 kHz, 3.5 mm analogue with the battery flat</li><li>LDAC, aptX Lossless, AAC</li></ul>',
		specs: [
			{ term: 'Driver', value: '32 mm beryllium-coated' },
			{ term: 'Frequency response', value: '3 Hz to 45 kHz' },
			{ term: 'Noise cancelling', value: 'Hybrid, 6 microphones, -45 dB' },
			{ term: 'Battery', value: '40 h (ANC on) / 60 h (off)' },
			{ term: 'Codecs', value: 'LDAC, aptX Lossless, AAC, SBC' },
			{ term: 'Weight', value: '251 g' },
			{ term: 'In the box', value: 'Case, USB-C cable, 3.5 mm cable, flight adapter' }
		],
		stock: 38
	},
	{
		slug: 'aurel-open',
		name: 'Aurel Open',
		category: 'headphones',
		price: 429,
		rating: 4.8,
		reviews: 412,
		colors: [GRAPHITE, BONE],
		img: unsplash('1524678606370-a47ad25cb82a'),
		gallery: [unsplash('1524678606370-a47ad25cb82a'), unsplash('1487215078519-e21cc028cb29')],
		short: 'Open-back reference for mixing rooms. Wired only, no compromises.',
		description:
			'<p>The open-back sibling of Aurel One. Same drivers, no ANC, no battery: a wired reference for people who work in quiet rooms and want the stage to disappear.</p>',
		specs: [
			{ term: 'Driver', value: '32 mm beryllium-coated' },
			{ term: 'Impedance', value: '48 Ω' },
			{ term: 'Cable', value: '3 m balanced, detachable' },
			{ term: 'Weight', value: '238 g' }
		],
		stock: 12
	},
	{
		slug: 'aurel-lite',
		name: 'Aurel Lite',
		category: 'headphones',
		price: 199,
		compareAt: 249,
		rating: 4.6,
		reviews: 2381,
		colors: [BLACK, SAND, OLIVE],
		badge: 'sale',
		img: unsplash('1505740420928-5e560c06d30e'),
		gallery: [unsplash('1505740420928-5e560c06d30e'), unsplash('1583394838336-acd977736f90')],
		short: 'On-ear, foldable, 30 h. The everyday pair.',
		description:
			'<p>Aurel Lite folds flat, weighs 178 g and runs thirty hours. Same tuning philosophy, lighter materials, and a price that makes it the pair you leave in your bag.</p>',
		specs: [
			{ term: 'Driver', value: '30 mm titanium' },
			{ term: 'Battery', value: '30 h' },
			{ term: 'Weight', value: '178 g' },
			{ term: 'Folding', value: 'Flat and inward' }
		],
		stock: 140
	},
	{
		slug: 'aurel-studio-pro',
		name: 'Aurel Studio Pro',
		category: 'headphones',
		price: 599,
		rating: 4.9,
		reviews: 96,
		colors: [BLACK],
		badge: 'bestseller',
		img: unsplash('1484704849700-f032a568e944'),
		gallery: [unsplash('1484704849700-f032a568e944')],
		short: 'Planar magnetic, hand-matched pairs, individual measurement sheet.',
		description:
			'<p>Planar magnetic drivers hand-matched to within 0.5 dB, each pair shipped with its own measurement plot. Built for studios; enjoyed by people who like to know.</p>',
		specs: [
			{ term: 'Driver', value: '90 mm planar magnetic' },
			{ term: 'Impedance', value: '32 Ω' },
			{ term: 'Weight', value: '412 g' }
		],
		stock: 3
	},
	{
		slug: 'aurel-buds',
		name: 'Aurel Buds',
		category: 'earbuds',
		price: 179,
		rating: 4.7,
		reviews: 3104,
		colors: [BLACK, BONE],
		badge: 'bestseller',
		img: unsplash('1608156639585-b3a032ef9689'),
		gallery: [unsplash('1608156639585-b3a032ef9689'), unsplash('1590658268037-6bf12165a8df')],
		short: 'True wireless with ANC, 8 h per charge, 32 h with the case.',
		description:
			'<p>Small, sealed and honest. Aurel Buds bring the house tuning to a true-wireless form with adaptive ANC, a wireless charging case and six sizes of tips in the box.</p>',
		specs: [
			{ term: 'Driver', value: '10 mm dynamic' },
			{ term: 'Battery', value: '8 h + 24 h case' },
			{ term: 'Water resistance', value: 'IPX5' },
			{ term: 'Charging', value: 'USB-C, Qi wireless' }
		],
		stock: 260
	},
	{
		slug: 'aurel-buds-sport',
		name: 'Aurel Buds Sport',
		category: 'earbuds',
		price: 149,
		compareAt: 169,
		rating: 4.5,
		reviews: 878,
		colors: [BLACK, OLIVE],
		badge: 'sale',
		img: unsplash('1590658268037-6bf12165a8df'),
		gallery: [unsplash('1590658268037-6bf12165a8df')],
		short: 'Hooked fit, IPX7, transparency mode for the road.',
		description:
			'<p>The same drivers as Aurel Buds with a silicone hook and IPX7 sealing. Transparency mode is on by default so you hear the bike behind you.</p>',
		specs: [
			{ term: 'Battery', value: '9 h + 27 h case' },
			{ term: 'Water resistance', value: 'IPX7' }
		],
		stock: 0
	},
	{
		slug: 'aurel-wired-iem',
		name: 'Aurel Wired IEM',
		category: 'earbuds',
		price: 249,
		rating: 4.8,
		reviews: 214,
		colors: [GRAPHITE],
		badge: 'new',
		img: unsplash('1572536147248-ac59a8abfa4b'),
		gallery: [unsplash('1572536147248-ac59a8abfa4b')],
		short: 'Two balanced armatures and one dynamic driver, MMCX cable.',
		description:
			'<p>Hybrid in-ear monitor with a detachable MMCX cable. Tuned to the same curve as Aurel One, with the isolation of a custom shell.</p>',
		specs: [
			{ term: 'Drivers', value: '2 BA + 1 DD' },
			{ term: 'Cable', value: 'MMCX, 1.2 m' }
		],
		stock: 24
	},
	{
		slug: 'aurel-room',
		name: 'Aurel Room',
		category: 'speakers',
		price: 899,
		rating: 4.8,
		reviews: 133,
		colors: [BONE, GRAPHITE],
		img: unsplash('1545454675-3531b543be5d'),
		gallery: [unsplash('1545454675-3531b543be5d'), unsplash('1558089687-f282ffcbc126')],
		short: 'Stereo pair, active, room-corrected. Wi-Fi, AirPlay, optical.',
		description:
			'<p>An active stereo pair with DSP room correction you run once from the app. Streams over Wi-Fi, takes a turntable on the back, and disappears into a bookshelf.</p>',
		specs: [
			{ term: 'Drivers', value: '25 mm tweeter, 130 mm woofer' },
			{ term: 'Power', value: '2 × 100 W' },
			{ term: 'Inputs', value: 'Wi-Fi, AirPlay 2, optical, RCA (phono)' }
		],
		stock: 9
	},
	{
		slug: 'aurel-go',
		name: 'Aurel Go',
		category: 'speakers',
		price: 129,
		rating: 4.4,
		reviews: 1920,
		colors: [BLACK, SAND, OLIVE],
		img: unsplash('1608043152269-423dbba4e7e1'),
		gallery: [unsplash('1608043152269-423dbba4e7e1')],
		short: 'Pocket speaker, 18 h, IP67, pairs in stereo.',
		description:
			'<p>A pocket speaker that does not sound like one. Eighteen hours, IP67, and a stereo pairing mode for two.</p>',
		specs: [
			{ term: 'Battery', value: '18 h' },
			{ term: 'Water resistance', value: 'IP67' }
		],
		stock: 310
	},
	{
		slug: 'aurel-dac',
		name: 'Aurel DAC',
		category: 'accessories',
		price: 89,
		rating: 4.7,
		reviews: 640,
		colors: [GRAPHITE],
		img: unsplash('1558089687-f282ffcbc126'),
		gallery: [unsplash('1558089687-f282ffcbc126')],
		short: 'USB-C to 3.5 mm dongle, 32-bit / 384 kHz, 2 Vrms.',
		description:
			'<p>A dongle DAC that drives Aurel Open properly from a phone. 32-bit / 384 kHz, MQA-free, no app.</p>',
		specs: [
			{ term: 'Output', value: '2 Vrms, 3.5 mm' },
			{ term: 'Resolution', value: '32-bit / 384 kHz' }
		],
		stock: 88
	},
	{
		slug: 'aurel-case',
		name: 'Aurel Travel Case',
		category: 'accessories',
		price: 49,
		rating: 4.6,
		reviews: 402,
		colors: [GRAPHITE, BONE],
		img: unsplash('1589003077984-894e133dabab'),
		gallery: [unsplash('1589003077984-894e133dabab')],
		short: 'Hard shell for Aurel One and Lite, cable pocket, hand strap.',
		description:
			'<p>A hard shell that fits Aurel One and Aurel Lite, with a cable pocket and a leather strap.</p>',
		specs: [{ term: 'Fits', value: 'Aurel One, Aurel Lite' }],
		stock: 200
	},
	{
		slug: 'aurel-pads',
		name: 'Replacement Ear Pads',
		category: 'accessories',
		price: 39,
		rating: 4.8,
		reviews: 1110,
		colors: [GRAPHITE, BONE, OXBLOOD],
		img: unsplash('1598331668826-20cecc596b86'),
		gallery: [unsplash('1598331668826-20cecc596b86')],
		short: 'Leather and memory foam, for Aurel One and Open. Tool-free.',
		description:
			'<p>Full-grain leather over slow-rebound memory foam. Twist to remove, twist to fit.</p>',
		specs: [{ term: 'Fits', value: 'Aurel One, Aurel Open' }],
		stock: 500
	}
];

export function findProduct(slug: string): Product | undefined {
	return PRODUCTS.find((p) => p.slug === slug);
}

export const SORT_OPTIONS = [
	{ value: 'featured', label: 'Featured' },
	{ value: 'price-asc', label: 'Price: low to high' },
	{ value: 'price-desc', label: 'Price: high to low' },
	{ value: 'rating', label: 'Top rated' },
	{ value: 'newest', label: 'Newest' }
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export type Review = {
	name: string;
	avatar: string;
	rating: number;
	date: string;
	title: string;
	text: string;
};

export const REVIEWS: Review[] = [
	{
		name: 'Lena Fischer',
		avatar: 'https://i.pravatar.cc/150?img=5',
		rating: 5,
		date: '2026-08-21',
		title: 'Closed-backs I trust',
		text: 'The low end is honest and the isolation lets me work on a train. Battery is absurd.'
	},
	{
		name: 'Marcus Bell',
		avatar: 'https://i.pravatar.cc/150?img=14',
		rating: 5,
		date: '2026-08-09',
		title: 'Forty hours is real',
		text: 'Charged them twice in a month of daily commutes. ANC is subtle, which I prefer.'
	},
	{
		name: 'Sofia Ricci',
		avatar: 'https://i.pravatar.cc/150?img=25',
		rating: 4,
		date: '2026-07-30',
		title: 'Heavy-ish, worth it',
		text: 'You notice the weight for ten minutes. Then you notice the sound for the rest of the day.'
	},
	{
		name: 'Daniel Okoro',
		avatar: 'https://i.pravatar.cc/150?img=53',
		rating: 5,
		date: '2026-07-12',
		title: 'Transparency mode is uncanny',
		text: 'I forget they are on and start talking to people. Leather already looks better than day one.'
	}
];

export const RATING_BREAKDOWN = [
	{ stars: 5, pct: 84 },
	{ stars: 4, pct: 11 },
	{ stars: 3, pct: 3 },
	{ stars: 2, pct: 1 },
	{ stars: 1, pct: 1 }
];

export type ShippingMethod = { id: string; name: string; eta: string; price: number };

export const SHIPPING_METHODS: ShippingMethod[] = [
	{ id: 'standard', name: 'Standard', eta: '4 to 6 business days', price: 0 },
	{ id: 'express', name: 'Express', eta: '2 business days', price: 14 },
	{ id: 'overnight', name: 'Overnight', eta: 'Next business day, before noon', price: 29 }
];

export const COUNTRIES = [
	{ value: 'US', label: 'United States' },
	{ value: 'CA', label: 'Canada' },
	{ value: 'GB', label: 'United Kingdom' },
	{ value: 'DE', label: 'Germany' },
	{ value: 'FR', label: 'France' },
	{ value: 'PT', label: 'Portugal' },
	{ value: 'JP', label: 'Japan' }
];

export const PROMO_CODES: Record<string, number> = { SAVE10: 0.1, LAUNCH20: 0.2 };

export const FREE_SHIPPING_THRESHOLD = 150;
export const TAX_RATE = 0.08;
