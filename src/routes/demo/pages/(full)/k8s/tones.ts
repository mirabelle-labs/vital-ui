import { thresholdTone, toneMap } from '$lib/data';
import type { AppStatus, SidebarStatus } from './cluster.svelte';
import type { K8sEvent, PodPhase, ServiceType } from './data';

/** Status → tone, decided once and shared by the sidebar, the tables and the drawers. */

export const appTone = toneMap<AppStatus, 'success' | 'warning' | 'danger' | 'neutral'>({
	Healthy: 'success',
	Progressing: 'warning',
	Degraded: 'danger',
	Paused: 'neutral'
});

/** Readiness bars and rings: only Degraded and Progressing stand out. */
export const readinessTone = toneMap<AppStatus, 'danger' | 'warning' | 'success'>({
	Degraded: 'danger',
	Progressing: 'warning',
	Healthy: 'success',
	Paused: 'success'
});

export const phaseTone = toneMap<PodPhase, 'success' | 'warning' | 'danger' | 'neutral'>({
	Running: 'success',
	Pending: 'warning',
	Failed: 'danger',
	Succeeded: 'neutral'
});

export const nodeTone = toneMap<SidebarStatus, 'success' | 'warning' | 'danger'>({
	online: 'success',
	degraded: 'warning',
	offline: 'danger'
});

export const serviceTypeTone = toneMap<ServiceType, 'primary' | 'info' | 'neutral'>({
	LoadBalancer: 'primary',
	NodePort: 'info',
	ClusterIP: 'neutral'
});

export const SERVICE_TYPE_SHORT: Record<ServiceType, string> = {
	LoadBalancer: 'LB',
	NodePort: 'NP',
	ClusterIP: 'svc'
};

export const eventTone = toneMap<K8sEvent['type'], 'warning' | 'neutral'>({
	Warning: 'warning',
	Normal: 'neutral'
});

const USAGE_THRESHOLDS = { warning: 70, danger: 85 };

/** CPU, memory or pod pressure of a node or a pod, in percent. */
export function usageTone(pct: number): 'primary' | 'warning' | 'danger' {
	return thresholdTone(pct, USAGE_THRESHOLDS);
}
