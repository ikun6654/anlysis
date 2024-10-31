<template>
    <div ref="chartContainer" class="line-chart"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'  // 引入axios

const chartContainer = ref(null)
let myChart = null

const props = defineProps({
    stockCode: {
        type: String,
        required: true
    }
});
// 获取股票价格数据的函数
const fetchData = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4523/m1/5211650-4877960-default/data/predictdata', {
            params: {
                code: props.stockCode
            }
        })

        // 检查响应的状态
        if (response.data.ret === 200) {
            return response.data.data.price_list.map(item => item.price) // 提取价格列表
        } else {
            console.error('Error fetching data:', response.data.ret)
            return []
        }
    } catch (error) {
        console.error('Error fetching data:', error)
        return []
    }
}

// 初始化图表的函数
const initChart = (prices) => {
    myChart = echarts.init(chartContainer.value)

    const option = {

        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: prices.map((_, index) => ` ${index + 1}`) // 生成横坐标数据，示例为简单的 Day 1, Day 2 等
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '价格',
                type: 'line',
                data: prices
            }
        ]
    }

    myChart.setOption(option)
}

onMounted(async () => {
    const prices = await fetchData() // 获取价格数据
    if (prices.length > 0) {
        initChart(prices) // 初始化图表
    }
})

onBeforeUnmount(() => {
    if (myChart) {
        myChart.dispose() // 清理图表实例
    }
})
</script>

<style scoped>
.line-chart {
    width: 100%;
    height: 400px;
    /* 可根据需要调整高度 */
}
</style>