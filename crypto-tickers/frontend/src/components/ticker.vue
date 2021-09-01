<template>
  <div class="wrapper" :style="{ width: width + 'px' }">
    <div class="header">
      <img :src="coin.imageUrl" />
      <h2 style="margin-right: 5px">{{ coin.name }}</h2>
    </div>

    <div class="canvas-wrapper" :style="{ height: height + 'px'}">
      <chart :height="height" :data="data" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import chart from "@/components/chart.vue";


export default {
  name: "ticker",
  components: {
    chart,
  },
  props: {
    token: String,
    height: String,
    width: String,
  },

  setup(props) {
    let data = ref({ labels: [], prices: [] });
    let coin = ref({ name: '', imageUrl: '' });

    

    getCoinData()
      .then((val) => {
        coin.value.name = val.coin.name;
        coin.value.imageUrl = val.coin.imageUrl;
        data.value.labels = val.labels;
        data.value.prices = val.prices;
      })
      .catch((err) => console.log(err));

    function getCoinData() {
      return new Promise((resolve, reject) => {
        const apiUrl = "https://api.coingecko.com/api/v3";
        const coinData = `${apiUrl}/coins/${props.token}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`;
        const marketData = `${apiUrl}/coins/${props.token}/market_chart?vs_currency=usd&days=3&interval=hourly`;

        let data = {
          labels: [],
          prices: [],
          coin: {
            name: String,
            imageUrl: String,
          },
        };

        axios
          .all([axios.get(marketData), axios.get(coinData)])
          .then(
            axios.spread((marketData, coinData) => {
              data.coin.name = coinData.data.name;
              data.coin.imageUrl = coinData.data.image.large.split("?")[0];

              marketData.data.prices.forEach((el) => {
                data.labels.push(el[0]);
                data.prices.push(el[1]);
              });
              resolve(data)
            })
          )
          .catch(err => reject(err))
      });
    }
    return {
      data,
      coin,
    };
  },
};
</script>

<style lang="scss">
.wrapper {
  position: relative;
  padding: 2px;
  background-color: $background-light;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;

    img {
      width: 2rem;
      height: 2rem;
      margin: 4px;
      margin-bottom: 6px;
      border-radius: 50%;
    }
  }
  .canvas-wrapper {
    display: flex;
    background-color: #1a151e;
    height: 100%;
    width: 100%;
  }
  h2 {
    margin: 0;
    padding: 0;
    font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  }
}
</style>