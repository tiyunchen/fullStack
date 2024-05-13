import type {Ref} from 'vue'
import { defineStore } from 'pinia'
import {setMyToken, usePost} from "@/service";
import type {LOGIN_FORM, REGISTER_FORM} from "@/views/user/service";
import USER_API from "@/views/user/service";
import {useAppStore} from '@/stores/userAppStore'
import router from '@/router/index'


export interface USER_INFO {
    username?: string
}

export interface USER_STORE {
    userInfo: USER_INFO
}

const sleep = () => {
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve(true)
        },3000)
    })
}

export const useUserStore = defineStore('user', {
    state: (): USER_STORE=>{
        return {
            userInfo: {}
        }
    },
    actions: {
        async afterLogin(query: LOGIN_FORM){
            const {isFetching,success, resData} = await usePost<USER_INFO>(USER_API.LOGIN, query)
            if(success.value && resData.value) {
                await this.afterAuthLogin(resData)
            }
            return {isFetching, resData}
        },
        async afterRegister(query: REGISTER_FORM){
            const {isFetching,success, resData} = await usePost<USER_INFO>(USER_API.REGISTER, query)
            if(success.value && resData.value) {
                await this.afterAuthLogin(resData)
            }
            return {isFetching, resData}
        },


        async afterAuthLogin(resData:  Ref<USER_INFO | null>){
            if(!resData.value) return
            this.userInfo = resData.value
            setMyToken(resData.value.token)
            const appStore = useAppStore()
            appStore.isLogin = true
            await router.push({name: 'spider'})
        },

        afterAuth(){},
    }
})



