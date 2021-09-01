# TODO for backend

- order by 

- lib/gecko.js & lib/api.js save images in mongodb, check if exists before querying coingecko api
- document how data is formatted e.g. {coin: {imageurl: 'asd.jpg'...}...}
- move usage of keys to /lib/crypto.js from lib/api.js
- binanceData total balance: free + locked, now: just free balance
- couldnt resolve coin $name -> ?? idk what this means even tho i wrote it
- add || x.name if x.exchange == binance to transform coin filter/id match
- axios interceptors for more verbose logging & retry incase of timeout or ratelimit hit etcetc
- add summing of balances in transform() function
- save price data in mongodb
- if not found in mongodb -> fetch from coingecko
- first search of coin: fetch hourly data from coingecko, then start fetching higher resolution data
- request priority queue