<template>
    <div class="order-book">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span class="text-xl font-bold">最新盘口报价</span>
                </div>
            </template>

            <div class="order-tables">
                <!-- Ask Table (Top, reversed) -->
                <div class="table-container reversed-table">
                    <el-table :data="limitedAsks" style="width: 100%" size="small" :row-class-name="getAskRowClassName">
                        <el-table-column prop="type" label="Type" width="60">
                            <template #default="scope">
                                <span class="text-green-500">Ask</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="price" label="Price" width="80">
                            <template #default="scope">
                                {{ formatPrice(scope.row.price) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="Amount" width="80">
                            <template #default="scope">
                                {{ formatAmount(scope.row.amount) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Total" width="80">
                            <template #default="scope">
                                {{ formatTotal(scope.row.price * scope.row.amount / 100) }}万
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- Divider line (between Ask and Bid) -->
                <div class="divider"></div>

                <!-- Bid Table (Bottom) -->
                <div class="table-container">
                    <el-table :data="limitedBids" style="width: 100%" size="small" :row-class-name="getBidRowClassName">
                        <el-table-column prop="type" label="Type" width="60">
                            <template #default="scope">
                                <span class="text-red-500">Bid</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="price" label="Price" width="80">
                            <template #default="scope">
                                {{ formatPrice(scope.row.price) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="Amount" width="80">
                            <template #default="scope">
                                {{ formatAmount(scope.row.amount) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Total" width="80">
                            <template #default="scope">
                                {{ formatTotal(scope.row.price * scope.row.amount / 100) }}万
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const props = defineProps({
    stockCode: {
        type: String,
        required: true
    }
});

const bids = ref([]);
const asks = ref([]);
const loading = ref(false);

const maxRows = 8; // Limit the number of rows displayed

const sortedBids = computed(() => {
    return [...bids.value].sort((a, b) => b.price - a.price);
});

const sortedAsks = computed(() => {
    return [...asks.value].sort((a, b) => a.price - b.price);
});

// Limit the number of rows shown for asks and bids
const limitedAsks = computed(() => {
    return sortedAsks.value.slice(0, maxRows);
});

const limitedBids = computed(() => {
    return sortedBids.value.slice(0, maxRows);
});

const getAskRowClassName = ({ row, rowIndex }) => {
    return `ask-row ask-row-${rowIndex}`;
};

const getBidRowClassName = ({ row, rowIndex }) => {
    return `bid-row bid-row-${rowIndex}`;
};

const fetchOrderBook = async () => {
    loading.value = true;
    try {
        const response = await axios.get('http://127.0.0.1:4523/m1/5211650-4877960-default/data/depth-tick', {
            params: {
                symbol_list: JSON.stringify([{ code: props.stockCode }])
            }
        });
        console.log('response', response.data);

        const tickData = response.data.data.tick_list[0];
        bids.value = tickData.bids.map(bid => ({ price: parseFloat(bid.price), amount: parseFloat(bid.volume) }));
        asks.value = tickData.asks.map(ask => ({ price: parseFloat(ask.price), amount: parseFloat(ask.volume) }));

    } catch (error) {
        console.error('Error fetching order book:', error);
        ElMessage.error('Failed to update order book');
    } finally {
        loading.value = false;
    }
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
};

const formatAmount = (amount) => {
    return new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
};

const formatTotal = (total) => {
    return new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total);
};

let intervalId;

onMounted(() => {
    fetchOrderBook();
    intervalId = setInterval(fetchOrderBook, 2000); // Update every 2 seconds
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>

<style scoped>
.order-book {
    font-family: 'Arial', sans-serif;
    height: auto;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.order-tables {
    display: flex;
    flex-direction: column;
    height: 500px;
    justify-content: space-between;
    position: relative;
}

.table-container {
    flex-grow: 1;
    max-height: 230px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.reversed-table {
    display: flex;
    flex-direction: column-reverse;
    /* Reverse the column layout */
}

.el-table {
    flex-grow: 1;
}

/* Divider line between Ask and Bid tables */
.divider {
    width: 100%;
    height: 2px;
    background-color: #ccc;
    position: relative;
    z-index: 1;
    margin: 0;
}

:deep(.el-table--small) {
    font-size: 12px;
}

:deep(.el-table__row) {
    transition: background-color 0.3s;
}

:deep(.ask-row) {
    background-color: rgba(0, 255, 0, 0.05);
}

:deep(.bid-row) {
    background-color: rgba(255, 0, 0, 0.05);
}

:deep(.ask-row:hover),
:deep(.bid-row:hover) {
    background-color: rgba(0, 0, 0, 0.05);
}

:deep(.ask-row-0),
:deep(.bid-row-0) {
    font-weight: bold;
}
</style>
