<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue'
import {usePost, useListPost, API_RES} from "@/service";
import API, {SpiderEvent, ExploreItem, commandList} from './service'
import {useEmitter} from "@/hooks/useEmitt";
import { ElMessage, ElMessageBox } from 'element-plus'
const storeList = ref<ExploreItem[]>([])
const total = ref(0)
const hasNext = ref(true)
const page = ref(1);

const tagsInfo = reactive<{
    show: boolean,
    loading?: boolean,
    item?: ExploreItem,
    tags?: string[]
}>({
    show: false,
})

onMounted(()=>{
    getData()
})

// 监听分页变化
watch(page, ()=>{
    getData()
})

// 事件触发
useEmitter(SpiderEvent, (event: any)=>{
    console.log('收到消息', event)
    getData()
})

// 获取分页数据
const getData = () => {
    const {success, data} = useListPost<ExploreItem>(API.ALL, {page: page.value})
    watch(data,()=>{
        if(success) {
            storeList.value = data.value?.data.items
            total.value = data.value?.data.total
            hasNext.value = data.value?.data.hasNext
        }
    })
}

const beforeRemove = (item: ExploreItem) => {
    ElMessageBox.confirm('确定删除吗').then(()=>{
        const {success} = usePost(API.REMOVE, {
            id: item.id
        })
        watch(success, ()=>{
            if(success) {
                ElMessage.success('删除成功')
                getData()
            }
        })
    })
}

const beforeTags = (item: ExploreItem) => {
    tagsInfo.show = true
    tagsInfo.item = item
    tagsInfo.tags = item.tags.map(e=>e.name)
}

const addTags = () => {
    tagsInfo.loading = true
    const {success, data} = usePost<ExploreItem>(API.ADD_TAG, {
        tags: tagsInfo.tags?? [],
        spiderId: tagsInfo.item?.id
    })
    watch(success, ()=>{
        tagsInfo.loading = false
        if(data && success) {
            tagsInfo.show = false
            ElMessage.success('保存成功')
            const item = storeList.value.find(e=>e.id === tagsInfo.item?.id)
            if(item) {
                item.tags = data.value.data.tags
            }
        }

    })
}

const handleClose = () => {
    tagsInfo.loading = false

}

</script>

<template>
<div style="margin-top: 20px">
    <el-dialog
        v-model="tagsInfo.show"
        title="选择标签"
        width="500"
        @close="handleClose"
    >
        <el-select
            v-model="tagsInfo.tags"
            multiple
            placeholder="选择标签"
            style="width: 460px"
        >
            <el-option
                v-for="item in commandList"
                :key="item.label"
                :label="item.label"
                :value="item.label"
            />
        </el-select>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="tagsInfo.show = false">取消</el-button>
                <el-button type="primary" @click="addTags" :loading="tagsInfo.loading" :disabled="tagsInfo.loading">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-empty description="description" v-if="storeList.length <= 0" />
    <el-space wrap v-else>
        <el-card v-for="(item, number) in storeList" :key="number" class="box-card" style="width: 290px">
            <template #header>
                <div class="card-header">
                    <div class="card-header-top">
                        <el-icon class="add-btn" @click="()=>beforeTags(item)"><Management /></el-icon>
                        <el-icon @click="()=>beforeRemove(item)" class="add-btn"><CircleCloseFilled /></el-icon>
                    </div>
                    <div>
                        <span>{{item.alt}}</span>
                        <el-tag type="success" v-for="(tag) in item.tags" :key="tag.id">{{tag.name}}</el-tag>
                    </div>
                </div>
            </template>
            <el-image
                style="width: 250px;"
                :src="item.src"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="item.sizeList"
                :initial-index="4"
                fit="cover"
            />
        </el-card>
    </el-space>
    <el-pagination background layout="prev, pager, next" :total="total" v-model:current-page="page" style="margin-top: 20px" />
</div>
</template>

<style scoped>
.card-header-top {
    display: flex;
    justify-content: end;
}
.add-btn {
    display: inline-block;
    color: #409eff;
    cursor: pointer;
    margin-left: 8px;
//font-size: 24px;
}
</style>
