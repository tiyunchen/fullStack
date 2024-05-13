<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {API_RES, usePost} from "@/service";
import API, {ExploreApi, ExploreItem, SpiderEvent, commandList} from './service'
import { ElMessage, ElMessageBox } from 'element-plus'
import {useEmitter} from "@/hooks/useEmitt";



const query = ref(commandList[0].url)
const exploreList = ref<ExploreItem[]>([])
const loading = ref(false)

const storeTrigger = useEmitter(SpiderEvent)

onMounted(()=>{
    findPage()
})

const findPage = () => {
    loading.value = true
    const { data, success, error} = usePost<ExploreApi>(API.EXPLORE,
        {url: query.value})
    watch(data, ()=> {
        if(success) {
            exploreList.value = data.value.data.imgList
        }
        loading.value = false
    })
    watch(error, ()=>{
        loading.value = false
    })
}


const beforeClick = (item: ExploreItem) => {
    ElMessageBox.confirm('确定要添加入库吗', '提示', {
        confirmButtonText: '确定',
    }).then(()=>{
        const {success} = usePost(API.STORE, {
            stores: [item]
        })
        console.log('success', success)
        watch(success, ()=>{
            if(success) {
                storeTrigger()
                ElMessage.success('保存成功')
            }
        })

    })
}
</script>

<template>
<div v-loading="loading" >
    <el-row>
        <el-col :span="8">
            <el-input placeholder="请输入网址" v-model="query"></el-input>
        </el-col>
        <el-col :span="2">
            <el-button type="primary" @click="findPage" :disabled="!query">搜索</el-button>
        </el-col>
    </el-row>
    <div style="margin-top: 20px">
        <el-radio-group v-model="query" @change="findPage">
            <el-radio-button
                v-for="item in commandList"
                :label="item.url"
                :key="item.url"
            >{{item.label}}</el-radio-button>
        </el-radio-group>
    </div>
    <el-space wrap style="margin-top: 20px">
        <el-card v-for="(item, number) in exploreList" :key="number" class="box-card" style="width: 290px">
            <template #header>
                <div class="card-header" :title="item.sizeList">
                    <span>{{item.alt}}</span>
                    <div v-if="item.isExist">
                        <el-tag type="success">已入库</el-tag>
                    </div>
                    <el-icon class="add-btn" v-else @click="()=>beforeClick(item)" ><CirclePlusFilled /></el-icon>
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
</div>
</template>

<style scoped lang="less">
.add-btn {
    display: none;
}
.card-header {
    &:hover {
        .add-btn {
            display: inline-block;
            color: #409eff;
            cursor: pointer;
            //font-size: 24px;
        }
    }
}
</style>
