import {ref, computed, reactive} from 'vue'
import { defineStore } from 'pinia'
import {getMyToken, usePost} from "@/service";

interface APP_STATE {
    isLogin: boolean,
}
export const useAppStore = defineStore('app', {
    state: (): APP_STATE=>{
        return {
            isLogin: false,
        }
    },
    actions: {
        /**
         * 页面加载初始化
         */
        async init(){
            const token = await getMyToken()
            this.isLogin = !!token
        }
    }
})



