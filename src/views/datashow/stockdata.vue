<template>
  <div class="stock-market-table">
    <el-table :data="tableData" style="width: 100%" :default-sort="{ prop: 'code', order: '' }"
      @sort-change="handleSort">
      <el-table-column label="序号" width="60" fixed>
        <template #default="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="code" label="代码" width="100" />
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column prop="price" label="现价" width="100" sortable="custom">
        <template #default="scope">
          <span :style="{ color: scope.row.priceChange >= 0 ? 'red' : 'green' }">{{ scope.row.price.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="changePercent" label="涨跌幅(%)" width="150" sortable="custom">
        <template #default="scope">
          <span :style="{ color: scope.row.changePercent >= 0 ? 'red' : 'green' }">
            {{ scope.row.changePercent.toFixed(2) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="priceChange" label="涨跌" width="100" sortable="custom">
        <template #default="scope">
          <span :style="{ color: scope.row.priceChange >= 0 ? 'red' : 'green' }">
            {{ scope.row.priceChange.toFixed(2) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="turnoverRate" label="换手(%)" width="150" sortable="custom" />
      <el-table-column prop="amplitude" label="振幅(%)" width="150" sortable="custom" />
      <el-table-column prop="transaction" label="成交量" width="150" sortable="custom" />
      <el-table-column prop="transactionAmount" label="成交额" width="150" sortable="custom" />
    </el-table>

    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper" :total="totalItems" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalItems = ref(0)
const sortKey = ref('code')
const sortOrder = ref('')

const fetchData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:4523/m1/5211650-4877960-default/data/stockdata', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        sortKey: sortKey.value,
        sortOrder: sortOrder.value
      }
    })

    if (response.data.ret == '200') {
      tableData.value = response.data.data.list.map(item => ({
        code: item.code,
        name: item.name,
        price: parseFloat(item.closePrice),
        changePercent: parseFloat(item.changePercent),
        priceChange: parseFloat(item.priceChange),
        turnoverRate: parseFloat(item.turnoverRate),
        amplitude: parseFloat(item.amplitude),
        transaction: parseFloat(item.transaction),
        transactionAmount: parseFloat(item.transactionAmount)
      }))
      totalItems.value = response.data.data.totaldata || 0
    } else {
      console.error('Failed to fetch data: Unexpected response structure')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchData()
}

const handleSort = ({ prop, order }) => {

  sortKey.value = prop
  sortOrder.value = order
  currentPage.value = 1
  console.log('sortOrder', sortOrder.value)

  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.stock-market-table {
  margin: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>