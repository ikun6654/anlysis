<template>
    <el-container class="stock-dashboard">
        <el-aside width="180px">
            <el-menu :default-active="activeMenu" @select="handleSelect">
                <el-menu-item index="1">
                    <el-icon><trend-charts /></el-icon>
                    <span>涨跌停</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-icon><pie-chart /></el-icon>
                    <span>涨跌分布</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <el-container>
            <el-main width="100px">
                <el-card v-if="activeMenu === '1'" class="chart-card" shadow="never">
                    <div ref="lineChart" class="chart"></div>
                </el-card>
                <el-card v-if="activeMenu === '2'" class="chart-card" shadow="never">
                    <el-row class="stock-info">

                        <div class="info-item">
                            <el-icon color="#f56c6c"><caret-top /></el-icon>
                            <span>上涨: {{ stockInfo.up }}</span>
                        </div>
                        <div class="info-item">
                            <el-icon color="#67c23a"><caret-bottom /></el-icon>
                            <span>下跌: {{ stockInfo.down }}</span>
                        </div>
                    </el-row>

                    <el-row class="stock-info">
                        <div class="info-item">
                            <el-icon color="#e6a23c">
                                <warning />
                            </el-icon>
                            <span>涨停: {{ stockInfo.limitUp }}</span>
                        </div>
                        <div class="info-item">
                            <el-icon color="#409eff">
                                <warning />
                            </el-icon>
                            <span>跌停: {{ stockInfo.limitDown }}</span>
                        </div>
                    </el-row>
                    <div ref="barChart" class="chart"></div>
                </el-card>

            </el-main>
        </el-container>

        <el-card class="rating-card">
            <template #header>
                <div class="card-header">大盘评级</div>
            </template>
            <el-progress type="dashboard" :percentage="75" :color="customColors" :format="formatRating"
                :stroke-width="15" :width="150">
                <template #default="{ percentage }">
                    <span class="rating-value">{{ percentage / 10 }}</span>
                    <span class="rating-label">分</span>
                </template>
            </el-progress>
            <div class="sugest">投资建议</div>
            <div class="rating-description">大盘走势良好</div>

        </el-card>

    </el-container>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { TrendCharts, PieChart, CaretTop, CaretBottom, Warning } from '@element-plus/icons-vue'

const activeMenu = ref('1')
const lineChart = ref(null)
const barChart = ref(null)

const stockInfo = ref({
    up: 4303,
    down: 982,
    limitUp: 191,
    limitDown: 1
})

const customColors = [
    { color: '#4ca124', percentage: 49 },
    { color: '#f56c6c', percentage: 50 }

]

const formatRating = (percentage) => `${percentage / 10}`

const handleSelect = (key) => {
    activeMenu.value = key
}

const initLineChart = () => {
    const chartInstance = echarts.init(lineChart.value)
    const option = {
        xAxis: { type: 'category', data: ['09:30', '11:30', '14:00', '15:00'] },
        yAxis: { type: 'value' },
        series: [
            { data: [40, 135, 160, 190], type: 'line', smooth: true, color: '#f56c6c' },
            { data: [30, 100, 120, 150], type: 'line', smooth: true, color: '#909399' }
        ]
    }
    chartInstance.setOption(option)
}

const initBarChart = () => {
    const chartInstance = echarts.init(barChart.value)
    const option = {
        xAxis: { type: 'category', data: ['跌停', '-8%', '-4%', '0', '4%', '8%', '涨停'] },
        yAxis: { type: 'value' },
        series: [{
            data: [15, 12, 62, 699, 521, 463, 308],
            type: 'bar',
            itemStyle: {
                color: params => params.dataIndex < 3 ? '#67c23a' : '#f56c6c'
            }
        }]
    }
    chartInstance.setOption(option)
}

watch(activeMenu, (newValue) => {
    setTimeout(() => newValue === '1' ? initLineChart() : initBarChart(), 0)
})

onMounted(initLineChart)
</script>

<style scoped>
.stock-dashboard {
    height: 50vh;
    border: 1px solid #eee;
    overflow: hidden;
}

.el-aside {
    background-color: #ffffff;
}

.el-main {
    padding: 0px;
    overflow: hidden;

}

.chart-card {
    height: 100%;
    overflow: hidden;

}

.rating-card {
    height: 100%;
    overflow: hidden;
    width: 20%;
}

.chart {
    height: calc(50vh - 30px);

}

.stock-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 11px;
}

.info-item {
    display: flex;
    align-items: center;
}

.info-item .el-icon {
    margin-right: 2px;
}

.rating-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card-header {
    font-size: 13px;
    font-weight: bold;
}

.rating-value {
    font-size: 16px;
    font-weight: bold;
}

.rating-label {
    font-size: 11px;
    color: #909399;

}

.rating-description {
    text-align: center;
    margin: 5px 0;
    font-size: 12px;
}

.sugest {
    text-align: center;
    margin: 15px 0;
    font-size: 15px;
    color: #fff;
    background-color: rgb(9, 119, 244);
    padding: 4px 10px;
    border-radius: 4px;
}



.el-button {
    margin-top: auto;
    font-size: 11px;
    padding: 6px 10px;
}

.el-menu-item {
    height: 150%;
    line-height: 180px;
}

.el-menu-item span {
    font-size: 12px;
}
</style>