<script>
import { defineComponent } from 'vue'
import { Bar } from 'vue3-chart-v2'

export default defineComponent({
  name: 'MonthlyChart',
  extends: Bar,
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      required: false
    },
  },
  data () {
    return {
      state: {
        chartData: {
          datasets: [
            {
              data: [1, 2, 3, 4],
              backgroundColor: ['Red', 'Yellow', 'Blue', 'Green']
            }
          ],
          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: ['Red', 'Yellow', 'Blue', 'Green']
        },

      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.chartOptions)
    console.log("char", this.chartData, this.chartOptions)
  },
  updated(){
    this.renderChart(this.chartData, this.chartOptions)
    console.log("char2", this.chartData, this.chartOptions)
  }
})
</script>
