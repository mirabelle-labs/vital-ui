import { toneMap } from '$lib/data';
import type { DocType, InvoiceStatus, ProjectStatus, TicketPriority, TicketStatus } from './data';

/** Status → tone and status → label, decided once and shared by every view. */

export const projectTone = toneMap<ProjectStatus, 'success' | 'warning' | 'neutral' | 'danger'>({
	active: 'success',
	review: 'warning',
	done: 'neutral',
	paused: 'danger'
});

export const PROJECT_LABELS: Record<ProjectStatus, string> = {
	active: 'Active',
	review: 'In review',
	done: 'Done',
	paused: 'Paused'
};

/** Progress bars: paused work is a warning, finished work is green, the rest is brand. */
export const progressTone = toneMap<ProjectStatus, 'warning' | 'success' | 'primary'>({
	paused: 'warning',
	done: 'success',
	active: 'primary',
	review: 'primary'
});

export const invoiceTone = toneMap<InvoiceStatus, 'success' | 'warning' | 'danger' | 'neutral'>({
	paid: 'success',
	due: 'warning',
	overdue: 'danger',
	draft: 'neutral'
});

export const INVOICE_LABELS: Record<InvoiceStatus, string> = {
	paid: 'Paid',
	due: 'Due',
	overdue: 'Overdue',
	draft: 'Draft'
};

export const ticketTone = toneMap<TicketStatus, 'danger' | 'warning' | 'success'>({
	open: 'danger',
	pending: 'warning',
	resolved: 'success'
});

export const TICKET_LABELS: Record<TicketStatus, string> = {
	open: 'Open',
	pending: 'Pending',
	resolved: 'Resolved'
};

export const priorityTone = toneMap<TicketPriority, 'danger' | 'warning' | 'info' | 'neutral'>({
	urgent: 'danger',
	high: 'warning',
	normal: 'info',
	low: 'neutral'
});

type DocIcon = {
	icon: string;
	color: 'primary-soft' | 'success-soft' | 'info-soft' | 'danger-soft';
};

export const DOC_ICONS: Record<DocType, DocIcon> = {
	contract: { icon: 'fa-file-signature', color: 'primary-soft' },
	report: { icon: 'fa-chart-line', color: 'success-soft' },
	asset: { icon: 'fa-image', color: 'info-soft' },
	invoice: { icon: 'fa-file-invoice-dollar', color: 'danger-soft' }
};

export const DOC_LABELS: Record<DocType, string> = {
	contract: 'Contract',
	report: 'Report',
	asset: 'Asset',
	invoice: 'Invoice'
};
