import type { ExpressionSpecification } from 'maplibre-gl';

export type StatusColor = 'green' | 'orange' | 'red' | 'neutral';

export const RATIO_CONFIG = {
    thresholds: {
        high: 0.8,
        medium: 0.3,
    },
    mapColors: {
        green: '#22c55e',
        orange: '#f97316',
        red: '#ef4444',
        neutral: '#94a3b8',
    },
} as const;

export function getRatioColor(safe: number, total: number): StatusColor {
    if (total === 0) {
        return 'neutral';
    }

    const ratio = safe / total;

    if (ratio >= RATIO_CONFIG.thresholds.high) {
        return 'green';
    } else if (ratio >= RATIO_CONFIG.thresholds.medium) {
        return 'orange';
    } else {
        return 'red';
    }
}

export function buildRatioColorExpression(
    safePropName: string,
    totalPropName: string,
): ExpressionSpecification {
    return [
        'case',
        ['==', ['get', totalPropName], 0],
        RATIO_CONFIG.mapColors.neutral,

        [
            '>=',
            ['/', ['get', safePropName], ['get', totalPropName]],
            RATIO_CONFIG.thresholds.high,
        ],
        RATIO_CONFIG.mapColors.green,

        [
            '>=',
            ['/', ['get', safePropName], ['get', totalPropName]],
            RATIO_CONFIG.thresholds.medium,
        ],
        RATIO_CONFIG.mapColors.orange,

        RATIO_CONFIG.mapColors.red,
    ];
}
