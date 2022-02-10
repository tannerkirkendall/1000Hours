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
  mounted () {
    this.renderChart(this.chartData, this.chartOptions)
    console.log("char", this.chartData)
  },
  updated(){
    this.renderChart(this.chartData, this.chartOptions)
    console.log("char2", this.chartData)
  }
})
</script>
