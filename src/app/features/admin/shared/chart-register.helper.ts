import { Chart, registerables } from 'chart.js';

let chartRegistered = false;

/**
 * Registers Chart.js components only once per application load.
 * Call this in admin components that use charts (rooms, players).
 */
export function registerCharts(): void {
    if (!chartRegistered) {
        Chart.register(...registerables);
        chartRegistered = true;
    }
}
