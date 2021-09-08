require('dotenv').config()
const sql = require('./connect');

(async () => {
    const responseDbSelect = await sql`
        SELECT (SELECT now()) current_time_calc, i.ticker ticker, AVG(ib.close_price) average_price
            FROM instrument_bars ib
            JOIN instruments i ON ib.ticker = i.ticker
            WHERE ib.exchange='BitFinex' AND i.ticker='BTCUSD' AND ib.timestamp=date_trunc('day', NOW() - interval '4 month')
            GROUP BY i.ticker;
    `;

    if(responseDbSelect.count === 0)
        return console.log('No data was found for the period');
    
    const averagePriceForMonthAgo = {
        current_time_calc: responseDbSelect[0].current_time_calc,
        ticker: responseDbSelect[0].ticker,
        average_price: responseDbSelect[0].average_price,
    }

    const responseInsert = await sql`
        INSERT INTO test_ka(current_time_calc, ticker, average_price)
        VALUES(${averagePriceForMonthAgo.current_time_calc}, ${averagePriceForMonthAgo.ticker}, ${averagePriceForMonthAgo.average_price})
    `

    if(responseInsert.count === 0) return console.log('No data added')
})()
