<template>
    <div class="user">
        <button @click="download">下载</button>
    </div>
</template>
<script setup lang="ts">
import { usePostStream} from '@/service/index'
import {watch} from "vue-demi";
  const download = () => {
      const {data} = usePostStream('/upload/stream')
      watch(data, ()=>{
          console.log('监听变化', data.value)
          if(!data.value) return
          const a = document.createElement('a')
          a.download = '测试文件.zip'
          a.href = data.value
          a.click()
      })
      console.log('res', data)
  }

  const downloadFn = async () => {
    const res = await fetch('api/upload/stream', {
        method: 'post'
    }).then(f=>{
        console.log('ffffffff', f)
        return f.arrayBuffer()
    })
      const url = new Blob([res])
      // window.open(URL.createObjectURL(url))
      const a = document.createElement('a')
      a.download = '测试文件.zip'
      a.href = URL.createObjectURL(url)
      // a.click()
      console.log('res', res)
  }
</script>

<style scoped>

</style>
