import mitt from '@/utils/mitt';
import {onUnmounted} from 'vue'

const emitter = mitt();


export function useEmitter(key: string, cb?: (d: any)=>void): ()=>void{
    const callback = (d: any) => {
        cb(d)
    }
     const trigger = () => {
         emitter.emit(key)
     }
     if(cb) {
         emitter.on(key, callback)
     }
    onUnmounted(()=>{
        emitter.off(key, callback)
    })
    return trigger
}
