<template>
    <div ref="chartContainer" class="line-chart"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

const chartContainer = ref(null)
let myChart = null

const props = defineProps({
    stockCode: {
        type: String,
        required: true
    }
})

const fetchData = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4523/m1/5211650-4877960-default/data/transaction', {
            params: {
                code: props.stockCode
            }
        })

        if (response.data.ret === 200) {
            return response.data.data.profit_list.map(item => item.profit)
        } else {
            console.error('Error fetching data:', response.data.ret)
            return []
        }
    } catch (error) {
        console.error('Error fetching data:', error)
        return []
    }
}

const initChart = (profits) => {
    myChart = echarts.init(chartContainer.value)

    const option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: profits.map((_, index) => `${index + 1}`)
        },
        yAxis: {
            type: 'value',

            interval: 0.02,
            axisLabel: {
                formatter: '{value}'
            },
            axisLine: {
                onZero: false,
            }
        },
        series: [
            {
                name: '利润',
                type: 'line',
                data: profits,
                markLine: {
                    silent: true,
                    lineStyle: {
                        color: '#333'
                    },

                }
            }
        ]
    }

    myChart.setOption(option)
}

onMounted(async () => {
    const profits = await fetchData()
    if (profits.length > 0) {
        initChart(profits)
    }
})

onBeforeUnmount(() => {
    if (myChart) {
        myChart.dispose()
    }
})
</script>

<style scoped>
.line-chart {
    width: 100%;
    height: 400px;
}
</style>