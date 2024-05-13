<template>
    <div class="user">
        <button @click="download">下载</button>
        <button @click="startPromise">开始promise</button>
        <button @click="stopPromise">停止promise</button>
    </div>
</template>
<script setup lang="ts">
import { usePostStream} from '@/service/index'
import {watch} from "vue-demi";
import {until} from '@vueuse/shared'
import {ref} from "vue";
  const isStart = ref<boolean | null>(null)
  const startPromise = () => {
      isStart.value = true
      const fns = new Set()
      fns.add(2)
      fns.add(isStart)
      console.log('ssss', fns)
      until(isStart).toBe(false).then(res =>{
          console.log('返回', res)
      })
  }







  const stopPromise = ()=> {
      isStart.value = false
  }

  const download = () => {
      // const {data} = usePostStream('/upload/stream')
      const {data} = usePostStream('/upload/stream2')
      watch(data, ()=>{
          console.log('监听变化', data.value)
          if(!data.value) return
          const a = document.createElement('a')
          // a.download = '测试文件.zip'
          a.download = 'photo2.avif'
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
