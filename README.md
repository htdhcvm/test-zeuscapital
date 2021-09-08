# Zeus Capital

Для запуска проекта по крону следует задать переменные среды в файле .env корневой директории.
- DB_PASSWORD
- DB_USER
- DB_HOST
- DB_PORT
- DB_NAME

Выполнить:

```
npm install 
```

## Тестовое задание

1) Найти среднюю цену по полю close_price за все время по тикерам EOSUSD, ETHUSD и XRPUSD
для биржы BitFinex(таблицы instruments и instrument_bars)

```
SELECT i.ticker ticker, AVG(ib.close_price) average_price
    FROM instrument_bars ib
    JOIN instruments i ON ib.ticker = i.ticker
    WHERE ib.exchange='BitFinex' AND (i.ticker='EOSUSD' OR i.ticker='ETHUSD' OR i.ticker='XRPUSD')
    GROUP BY i.ticker;
```


2) Изменить структуру таблицы(используя ALTER) TEST_KA подходящим образом(она должна содержать поле timstamp c текущим временем расчета) 

```
ALTER TABLE test_ka ADD COLUMN current_time_calc TIMESTAMP;
ALTER TABLE test_ka ADD COLUMN ticker character varying(30);
ALTER TABLE test_ka ADD COLUMN average_price numeric;
```

3) Записать туда результаты для каждого тикера.

```
INSERT INTO test_ka(current_time_calc, ticker, average_price) (
    SELECT (SELECT now()) current_time_calc, i.ticker ticker, AVG(ib.close_price) average_price
    FROM instrument_bars ib
    JOIN instruments i ON ib.ticker = i.ticker
    WHERE ib.exchange='BitFinex' AND (i.ticker='EOSUSD' OR i.ticker='ETHUSD' OR i.ticker='XRPUSD')
    GROUP BY i.ticker
);
```

4) На сайте расширения postgres https://docs.timescale.com:
Найдите как называются родные таблицы для этого расширения
Поддерживается ли этим расширением конструкция ON CONFLICT ON CONSTRAINT?

- ON CONFLICT - поддерживаетя
- ON CONSTRAINT - поддерживаетя


5) Используя пакет https://github.com/porsager/postgres для Node.js написать сам скрипт и команды для запуска через крон этого скрипта раз в полночь, который рассчитывает среднюю цену по полю close_price для тикера BTCUSD биржы BitFinex для прошедшего дня и вставкой результата в уже созданную и измененную таблицу TEST_KA



```
crontab -e
00 00 * * * /usr/local/bin/node pathToProject/index.js
```