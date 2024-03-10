<script setup lang="ts">
import bgImg from '@/assets/parkding_card.jpg'
import {computed, onMounted, ref, watch} from "vue";
import { ElMessage } from 'element-plus'
import html2canvas from 'html2canvas'


import moment from "moment";
const parkingDate = ref(new Date())
const imgSrc = ref()
const nodeRef = ref<HTMLDivElement>()

onMounted(()=>{
    document.title = '自在里茶室停车券'
})

const onClick = () => {
    const node = nodeRef.value
    if(!node) return
    html2canvas(node, {
        useCORS: true // 开启跨域设置，需要后台设置cors
    }).then((canvas) => {
        // toDataURL函数生成img标签的可用数据  图片格式转成 base64
        let dataURL = canvas.toDataURL("image/png")
        imgSrc.value = dataURL
        ElMessage.success('请长按保存')
    })
}

const parkingStrYear = computed(()=>{
    const str = parkingDate.value && moment(parkingDate.value).format('YYYY')
    console.log('parkingStr', parkingDate,str)
    return str
})

const parkingStrMonth = computed(()=>{
    const str = parkingDate.value && moment(parkingDate.value).format('MM.DD')
    console.log('parkingStr', parkingDate,str)
    return str
})

watch(parkingDate, ()=>{
    imgSrc.value = null
})

const reFresh = () => {
    imgSrc.value = null
}


</script>
<template>
<div>
    <template v-if="!imgSrc">
        <el-date-picker
            v-model="parkingDate"
            type="date"
            placeholder="请选择停车时间"
        />
        <div style="margin-top: 16px">
            <el-button type="primary" @click="onClick" :disabled="!parkingDate">提交</el-button>
        </div>
    </template>
    <template v-else>
        <div>
            <div>请长按保存</div>
            <el-button type="primary" @click="reFresh">重新提交</el-button>
        </div>
    </template>

    <div class="parking-card" ref="nodeRef">
        <template v-if="!imgSrc">
            <img :src="bgImg" alt="" width="100%" height="100%">
            <div class="date-str">
                <div>{{parkingStrYear}}</div>
                <div>{{parkingStrMonth}}</div>
            </div>
        </template>
        <template  v-else>
            <img :src="imgSrc" width="100%" alt="" height="100%">
        </template>
    </div>
</div>
</template>



<style scoped lang="less">
.parking-card {
 position: relative;
 .date-str {
     color: white;
     position: absolute;
     left: 44%;
     font-size: 52px;
     line-height: 44px;
     bottom: 44%;
     font-weight: bolder;
     letter-spacing: -4px;
 }
    img {
        display: block;
    }
}
</style>
