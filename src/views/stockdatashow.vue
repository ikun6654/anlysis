<template>
    <div class="stock-data-display">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="stock-info">
                    <div class="stock-header">
                        <div class="stock-title">
                            <h2>数据展示&&数据预测</h2>
                        </div>
                        <div class="search-container">
                            <el-input v-model="searchInput" placeholder="搜索" @keyup.enter="handleSearch"
                                class="search-input">
                                <template #prefix>
                                    <el-icon>
                                        <Search />
                                    </el-icon>
                                </template>
                            </el-input>
                            <el-button type="primary" @click="handleSearch">搜索</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row class="mt-4">
            <el-col :span="18">
                <el-card class="chart-card">
                    <template #header>
                        <div class="card-header">
                            <span>{{ code }}</span>
                        </div>
                    </template>
                    <k_line :stock-code="code" :key="refreshKey" />
                </el-card>
            </el-col>
            <el-col :span="6">
                <bookprice :stock-code="code" :key="refreshKey" />
            </el-col>
        </el-row>

        <el-row :gutter="20" class="mt-4">
            <el-col :span="12">
                <el-card class="chart-card">
                    <template #header>
                        <div class="card-header">
                            <span>未来走势图</span>
                        </div>
                    </template>
                    <Zhexian :stock-code="code" :key="refreshKey" />
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="chart-card">
                    <template #header>
                        <div class="card-header">
                            <span>模拟交易利润图(%)</span>
                        </div>
                    </template>
                    <Transaction :stock-code="code" :key="refreshKey" />
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import K_line from './datashow/k_line.vue'
import bookprice from './datashow/bookprice.vue'
import { Search } from '@element-plus/icons-vue'
import Zhexian from './datashow/zhexian.vue'
import Transaction from './datashow/transaction.vue'

const searchInput = ref('000001.SH')
const code = ref('000001.SH')
const refreshKey = ref(0)

const handleSearch = () => {
    console.log('Searching for:', searchInput.value)
    code.value = searchInput.value
    refreshKey.value += 1 // Increment to trigger child component refresh
}
</script>

<style scoped>
.stock-data-display {
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.stock-info {
    background-color: #f0f2f5;
}

.stock-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.search-container {
    display: flex;
    gap: 8px;
    align-items: center;
}

.search-input {
    width: 200px;
}

.mt-4 {
    margin-top: 16px;
}

.chart-card {
    height: 100%;
}
</style>