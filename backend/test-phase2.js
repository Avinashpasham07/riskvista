const http = require('http');

async function testPhase2() {
    console.log('--- Testing Phase 2 Security & Middleware ---\n');

    try {
        // 1. Test basic endpoint and CORS/Helmet headers
        const res1 = await fetch('http://localhost:5000/');
        console.log('GET / -> Status:', res1.status);
        console.log('Headers (Helmet):');
        console.log(' - X-DNS-Prefetch-Control:', res1.headers.get('x-dns-prefetch-control'));
        console.log(' - X-Frame-Options:', res1.headers.get('x-frame-options'));
        console.log(' - Access-Control-Allow-Origin:', res1.headers.get('access-control-allow-origin'));

        // 2. Test 404 Error handler
        const res2 = await fetch('http://localhost:5000/api/non-existent-route');
        console.log('\nGET /api/non-existent-route -> Status:', res2.status);
        const data2 = await res2.json();
        console.log('404 Response Body:', data2);

        // 3. Test Rate Limiter (send multiple requests)
        console.log('\nTesting Rate Limiter (/api endpoints are limited)...');
        for (let i = 1; i <= 102; i++) {
            const resRateLimit = await fetch('http://localhost:5000/api/non-existent-route');
            if (i === 101 || resRateLimit.status === 429) {
                console.log(`Request ${i} -> Status:`, resRateLimit.status);
                if (resRateLimit.status === 429) {
                    const text = await resRateLimit.text();
                    console.log('Rate Limit Response:', text);
                    break;
                }
            }
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testPhase2();
