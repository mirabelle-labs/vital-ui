import { createCollection } from '$lib/state';
import { nowIso } from '$lib/format';
import { createSequence } from '$lib/data';
import {
	CLIENT,
	DOCUMENTS,
	INVOICES,
	TEAM,
	TICKETS,
	type Doc,
	type DocType,
	type Invoice,
	type Ticket,
	type TicketPriority,
	type TicketStatus
} from './data';

export type NewTicket = {
	subject: string;
	category: string;
	priority: TicketPriority;
	text: string;
};

const tickets = createCollection(TICKETS, { key: 'id' });
const documents = createCollection(DOCUMENTS, { key: 'id' });
const invoices = createCollection(INVOICES, { key: 'number' });

const ticketIds = createSequence('T-', 2390);
const documentIds = createSequence('D-', 20);

const me = { name: CLIENT.contact, avatar: CLIENT.avatar };

const ASSET_EXTENSIONS = /\.(png|jpe?g|gif|svg|zip|fig)$/i;

function isUnpaid(invoice: Invoice): boolean {
	return invoice.status === 'due' || invoice.status === 'overdue';
}

function documentTypeFor(fileName: string): DocType {
	if (ASSET_EXTENSIONS.test(fileName)) {
		return 'asset';
	}

	return 'report';
}

/** Mutable portal state shared by the views. */
export const portal = {
	get tickets() {
		return tickets.items;
	},
	get documents() {
		return documents.items;
	},
	get invoices() {
		return invoices.items;
	},

	get openTickets() {
		return tickets.count((ticket) => ticket.status !== 'resolved');
	},

	get unpaidInvoices() {
		return invoices.count(isUnpaid);
	},

	get outstanding() {
		return invoices.sum('amount', isUnpaid);
	},

	addTicket(input: NewTicket): Ticket {
		const ticket: Ticket = {
			id: ticketIds.next(),
			subject: input.subject,
			status: 'open',
			priority: input.priority,
			category: input.category,
			updated: nowIso(),
			assignee: TEAM[0],
			messages: [{ author: me, at: nowIso(), text: input.text }]
		};

		tickets.add(ticket, { prepend: true });
		return ticket;
	},

	reply(id: string, text: string) {
		tickets.update(id, (ticket) => {
			ticket.messages.push({ author: me, at: nowIso(), text });

			// A reply on a resolved ticket reopens it.
			return {
				updated: nowIso(),
				status: ticket.status === 'resolved' ? 'open' : ticket.status
			};
		});
	},

	setTicketStatus(id: string, status: TicketStatus) {
		tickets.update(id, { status });
	},

	addDocuments(files: File[]) {
		const added: Doc[] = files.map((file) => ({
			id: documentIds.next(),
			name: file.name,
			type: documentTypeFor(file.name),
			size: file.size,
			updated: nowIso(),
			owner: me
		}));

		documents.add(added, { prepend: true });
	},

	removeDocument(id: string) {
		documents.remove(id);
	},

	payInvoice(number: string) {
		invoices.update(number, { status: 'paid' });
	}
};
