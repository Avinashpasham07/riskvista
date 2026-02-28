const { generateLinearForecast } = require('./services/forecastEngine');

const currentRevenueCents = 100000;
const currentCogsCents = 40000;
const currentOpexCents = 40000;
const currentCashOnHandCents = 500000;

const forecast = generateLinearForecast(currentRevenueCents, currentCogsCents, currentOpexCents, currentCashOnHandCents, 6);
console.log(JSON.stringify(forecast, null, 2));
