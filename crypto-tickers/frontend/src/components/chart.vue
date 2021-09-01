<template>
  <div v-if="loading" class="loading">
    <div class="spinner" />
  </div>
  <canvas :id="tickerId" :height="height" />
</template>

<script>
import { watch, ref, onMounted } from "vue";
import Chart from "chart.js";
import * as styling from "chartjs-plugin-style";
import { customAlphabet } from "nanoid";


class Ticker {
  constructor(id, data) {
    this.data         = data
    this.ctx          = document.getElementById(id).getContext("2d");
    this.color_white  = "rgba(255, 255, 255, 0.7)";
    this.color_shadow = "rgba(255, 255, 255, 1)";
    this.color_glow   = "rgba(255, 255, 255, 0.6)";
    this.chart        = this.createTicker()
  }
  createTicker() {
    let chart = new Chart(this.ctx, {
      type: "line",
      data: {
        labels: this.data.labels,
        datasets: [
          {
            label: this.data.tooltipName,
            borderColor: this.color_white,
            backgroundColor: "rgba(255,255,255, 0.05)",
            borderCapStyle: "round",
            borderWidth: 3,
            pointRadius: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 10,
            shadowBlur: 40,
            shadowColor: this.color_shadow,
            outerGlowWidth: 6,
            outerGlowColor: this.color_glow,
            tension: 0.5,
            data: this.data.prices,
          },
        ],
      },
      options: {
        plugins: {
          styling,
        },
        maintainAspectRatio: false,
        tooltips: {
          mode: 'nearest',
          intersect: false,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false
            },
          ],
        },
      },
    });
    return chart
  }
  update(data) {
    this.chart.data.labels = data.labels
    this.chart.data.datasets[0].data = data.prices
    let min = Math.min(...data.prices)
    let max = Math.max(...data.prices)
    this.chart.options.scales.yAxes[0].ticks.min = min - (min * 0.05)
    this.chart.options.scales.yAxes[0].ticks.max = max + (max * 0.05)
    this.chart.update({duration: 0})
  }
}

export default {
  name: "chart",
  props: {
    height: String,
    data: Object,
  },
  setup(props) {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const tickerId = nanoid();

    let loading = ref(true)

    onMounted(() => {
      let chart = new Ticker(tickerId, props.data)

      watch(props.data, () => {
        loading.value = false
        chart.update(props.data)
      });
    })

    

    return {
      tickerId,
      loading
    };
  },
};
</script>

<style lang="scss">
.loading {
  width: 100%;
  height: 100%;
  background-color: #1a151e;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .spinner {
    position: relative;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
  }

  .spinner::before,
  .spinner:after {
    content: "";
    position: absolute;
    border-radius: 50%;
  }

  .spinner:before {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(90deg, #e4e4e4 0%, #2a2633 100%);
    animation: spin 0.5s infinite linear;
  }

  .spinner:after {
    width: 90%;
    height: 90%;
    background-color: #1a151e;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
}
</style>