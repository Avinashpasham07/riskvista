const { generateLinearForecast } = require('../services/forecastEngine');

describe('Forecast Engine Tests (Phase 9)', () => {

    it('should accurately project cash burn over 6 months linearly', () => {
        // Start: 100k cash
        // Net Income: -10k / month (Rev 0, Exp 10k)
        // Expected Base Cash progression: 90k, 80k, 70k, 60k, 50k, 40k
        const forecast = generateLinearForecast(0, 0, 1000000, 10000000, 6);

        expect(forecast).toHaveLength(6);

        // Month 1
        expect(forecast[0].projectedCashBaseCents).toBe(9000000);

        // Month 6
        expect(forecast[5].projectedCashBaseCents).toBe(4000000);
    });

    it('should accurately apply 10% modifiers to best and worst cases', () => {
        // Start: 100k cash
        // Baseline: Rev 10k, Exp 20k -> Net -10k
        // Best Case: Rev 11k, Exp 18k -> Net -7k
        // Worst Case: Rev 9k, Exp 22k -> Net -13k

        const forecast = generateLinearForecast(1000000, 0, 2000000, 10000000, 1);

        // Month 1
        expect(forecast[0].projectedCashBaseCents).toBe(9000000); // 100k - 10k
        expect(forecast[0].projectedCashBestCents).toBe(9300000); // 100k - 7k
        expect(forecast[0].projectedCashWorstCents).toBe(8700000); // 100k - 13k
    });

    it('should floor projected cash at 0 cents (bankruptcy event)', () => {
        // Start: 5k cash
        // Net: -10k / month
        // Month 1 should report 0 cash, not -5k. 
        const forecast = generateLinearForecast(0, 0, 1000000, 500000, 2);

        expect(forecast[0].projectedCashBaseCents).toBe(0);
        expect(forecast[1].projectedCashBaseCents).toBe(0);
    });
});
