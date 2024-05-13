<script setup lang="ts">
    import {onMounted, ref} from 'vue'
    import store from './store.vue'
    import explore from './explore.vue'

    const activeTab = ref('explore')



</script>

<template>
    <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane label="探索" name="explore">
            <explore />
        </el-tab-pane>
        <el-tab-pane label="仓库" name="store">
            <store />
        </el-tab-pane>
    </el-tabs>
</template>

<style scoped>

</style>
