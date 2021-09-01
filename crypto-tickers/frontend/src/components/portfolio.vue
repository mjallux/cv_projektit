<template>
  <div class="wrapper" :style="{ width: width + 'px' }">
    <div style="display: flex; align-items: center">
      <h2 style="margin-right: 5px">Portfolio</h2>
      <a @click.prevent="select(30)">1d</a>
      <a @click.prevent="select(4)">7d</a>
      <a @click.prevent="select(2)">14d</a>
      <a @click.prevent="select(1)">1m</a>
    </div>

    <div class="canvas-wrapper" :style="{ height: height + 'px' }">
      <chart :height="height" :data="returnData" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import chart from "@/components/chart.vue";
import axios from "axios";
import rateLimit from 'axios-rate-limit'
import crypto from 'crypto';
import percentile from 'percentile'

export default {
  name: "portfolio",
  components: {
    chart,
  },
  props: {
    height: String,
    width: String,
    apiKeys: Object,
  },
  setup(props) {
    let data = ref({ labels: [], prices: [] });

    let returnData = ref({ labels: [], prices: [] });

    function select(n) {
      returnData.value.labels = data.value.labels.slice(-(Math.floor(data.value.labels.length/n)))
      returnData.value.prices = data.value.prices.slice(-(Math.floor(data.value.prices.length/n)))
      console.log(returnData)
    }

    onMounted(() => {
      portfolioData().then(val => {
        coinsData(val).then(val => {
          toPlotData(val).then(val => {
            data.value.labels = val.labels
            data.value.prices = val.prices

            returnData.value.labels = data.value.labels
            returnData.value.prices = data.value.prices
          })
        })
      })
    })


    async function coinsData(data) {
      const gecko = rateLimit(axios.create(), { maxRPS: 10})
      const geckoAPI = "https://api.coingecko.com/api/v3";
      const geckoAll = "/coins/list?include_platform=false";

      try {
        let res = await gecko.get(`${geckoAPI}${geckoAll}`)
        res = res.data
        .filter((x) => {
          return (Object.keys(data).includes(x.symbol.toUpperCase()))
          })
        .map(async (el) => {
          const transformData = async () => {
              let request = await gecko.get(
                `${geckoAPI}/coins/${el.id}/market_chart?vs_currency=usd&days=3&interval=hourly`
              )

              return {
                labels: request.data.prices.map(el => {
                  return el[0]
                }),
                prices: request.data.prices.map(el => {
                  return el[1]
                })
              }
            }

          let coinsData = {
            id: el.id,
            symbol: el.symbol,
            balance: parseFloat(data[el.symbol.toUpperCase()]),
          }

          let marketData = await transformData()

          return Object.assign(coinsData, marketData)
        })
        
        return res
      } catch (e) {
        alert(e)
      }
      
    }

    async function toPlotData(data) {
      
      let chartData = {}

      await Promise.all(data).then(res => chartData = transform(res))
      
      return chartData

      function transform(data) {
        let chartData = { labels: [], prices: [] }

        let min = data.map(el => {
          return el.labels.length
        })

        min = Math.min(
          ...data.map(el => {
            return el.labels.length
          })
          .filter((x, _, arr) => {

            // remove outliers
            let p1 = percentile(10, arr)
            let p2 = percentile(90, arr)
            return x > (p1 - (1.5 * (p2 - p1)))
          })
        )

        console.log(min)

        // transforms data to suitable format for chart component
        data.forEach((el, i) => {

          if(el.prices.length != min) {
            el.prices.splice(0, Math.abs(el.prices.length - min))
          }
          
          el.prices = el.prices.map(ex => {
            return parseFloat(ex * el.balance)
          })

          if(el.labels.length == min) {
            chartData.labels = el.labels
          }
          el.prices.forEach((price, j) => {
            if(i == 0) {
              chartData.prices[j] = 0
            }
            chartData.prices[j] += price
          })
        })
        console.log(chartData)
        return chartData
      }
    }

    function portfolioData() {
      return new Promise((resolve, reject) => {
        const binanceAPI = "https://api.binance.com";
        const binanceEndpoint = "/sapi/v1/accountSnapshot";
        const gateAPI = "https://api.gateio.ws";
        const gateEndpoint = "/api/v4/spot/accounts";

        const proxyUrl = "https://thingproxy.freeboard.io/fetch/";

        let data = {
          gate: {},
          binance: {},
          combined: {},
        };

        let binanceRequestData = {};
        binanceRequestData.queryString = `type=SPOT&timestamp=${Date.now()}`;
        binanceRequestData.requestString = encodeURIComponent(
          `?${binanceRequestData.queryString}&signature=${binanceSignature(
            binanceRequestData.queryString
          )}`
        );

        const gateRequest = {
          method: "GET",
          url: `${proxyUrl}${gateAPI}${gateEndpoint}`,
          headers: gateSignature("GET", gateEndpoint, "", ""),
        };

        const binanceRequest = {
          method: "GET",
          url: `${proxyUrl}${binanceAPI}${binanceEndpoint}${binanceRequestData.requestString}`,
          headers: { "X-MBX-APIKEY": props.apiKeys.binance.key },
        };

        axios
          .all([axios(gateRequest), axios(binanceRequest)])
          .then(
            axios.spread((val1, val2) => {
              val1.data.forEach((val) => {
                if (val.currency != "USDTEST")
                  data.gate[val.currency] = val.available;
              });

              val2.data.snapshotVos
                .slice(-1)
                .pop()
                .data.balances.forEach((val) => {
                  data.binance[val.asset] = val.free;
                });

              data.combined = Object.assign(data.binance, data.gate);
              resolve(data.combined);
            })
          )
          .catch((err) => reject(err));

        function gateSignature(method, url, queryString, payloadString) {
          const key = props.apiKeys.gate.key;
          const secret = props.apiKeys.gate.secret;

          const hmac = crypto.createHmac("sha512", secret);
          const hash = crypto.createHash("sha512");

          const timestamp = Math.floor(Date.now() / 1000);

          hash.update(payloadString || "");
          const hashed = hash.digest("hex");

          const s = `${method}\n${url}\n${queryString}\n${hashed}\n${timestamp}`;
          hmac.update(s);
          const sig = hmac.digest("hex");

          return { KEY: key, Timestamp: timestamp, SIGN: sig };
        }

        function binanceSignature(queryString) {
          return crypto
            .createHmac("sha256", props.apiKeys.binance.secret)
            .update(queryString)
            .digest("hex");
        }
      });
    }
    return {
      returnData,
      select,
    }
  }
}
</script>

<style scoped lang="scss">
  a {
    margin: 0 10px;
  }
</style>