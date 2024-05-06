<template>
    <div>
        <div class="header">
            <a-card>
                <h1 class="title">收银台</h1>
            </a-card>
        </div>
        <div class="show-item">
            <a-space direction="vertical"
                     fill>
                <a-alert>最低金额{{ min_amount }}, 最高金额{{ max_amount }}</a-alert>
                <a-input-number v-model="amount"
                                size="large"
                                hide-button
                                :max="max_amount"
                                :min="min_amount">
                    <template #prefix>
                        <span>充值金额</span>
                    </template>
                    <template #suffix>
                        <span>¥</span>
                    </template>
                </a-input-number>
            </a-space>
        </div>

        <div class="show-item">
            <a-input v-model="remark"
                     size="large">
                <template #prefix>
                    <span>备注</span>
                </template>
            </a-input>
        </div>

        <div class="pay-btn">
            <a-button @click="to_pay"
                      :loading="pay_loading"
                      type="primary"
                      size="large">
                确认支付
            </a-button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import request from '@/utils/request'

const { query } = useRoute()

let min_amount = ref(100)
let max_amount = ref(2000)
let amount = ref(min_amount.value)

let remark = ref('')

let channel = reactive(null)

async function get_channel_info(cid) {
    const res = await request.get(`/api/client/channels/${cid}/`)
    if (res.code == 200) {
        channel = res.data
        const credit_range = channel.credit_range.split(',').map(item => parseFloat(item)).sort(((a, b) => a - b))
        min_amount.value = credit_range[0]
        max_amount.value = credit_range[1]
    } else {
        Message.error(res.msg)
    }
}


let pay_loading = ref(false)

async function to_pay() {
    if (amount < min_amount.value) {
        Message.error(`充值金额至少${min_amount.value}`)
        return
    }
    if (amount > max_amount.value) {
        Message.error(`充值金额最多${max_amount.value}`)
        return
    }
    const data = {
        money: amount.value,
        cid: channel.cid,
        remark: remark.value
    }
    pay_loading.value = true
    const res = await request.post('/api/client/pay/', data)
    if (res.code === 201) {
        // window.open(res.data.pay_url)
        window.location.replace(res.data.pay_url)
    } else {
        console.log(res.msg)
        Message.error(res.msg)
    }
    pay_loading.value = false
}

onMounted(() => {
    get_channel_info(query.cid)
})

</script>


<style scoped>
.title {
    margin: 0;
    padding: 0;
    font-size: 22px;
    font-weight: 400;
    text-align: center;
}

.pay-btn {
    margin-top: 100px;
    display: flex;
    justify-content: center;
}

.arco-btn {
    width: 95%;
}

.show-item {
    margin-top: 20px;
}
</style>