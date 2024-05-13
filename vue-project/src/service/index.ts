import { isObject } from '@vueuse/core'
import type {MaybeRef} from '@vueuse/core'
import type {UseFetchReturn} from './useFetch'
import {computed, reactive, ref, unref} from 'vue'
import { stringifyQuery } from 'vue-router'
import {createFetch} from '@/service/useFetch'
import router from "@/router";
import {isRef} from "vue-demi";
import {ElMessage} from "element-plus";

export interface API_RES<T> {
    data: T,
    // 接口成功状态
    success: boolean,
    // 返回文案
    msg?: string,
    // 状态
    status?: number,
    // 报错内容
    error?: string,
    // 报错的接口
    path?: string
}

interface API_PAGINATE<T> {
    items: T[],
    // 总数
    total: number,
    // 是否有下一页
    hasNext: boolean
}


interface PAGE {
    limit?: number;
    page?: number;
    [props: string]: any
}
const TOKEN_KEY = 'T-T'
export const setMyToken = (token: string) => {
    if(token) {
        localStorage.setItem(TOKEN_KEY, token)
    }

}
export const getMyToken = async () => {
    return localStorage.getItem(TOKEN_KEY)
}


// 根据状态码处理错误
const ERR_METHOD = {
    '401': {
        cb: (data: any) => {
            const msg = data.msg.message
            if(msg) {
                ElMessage.error(msg)
            }
            router.push({name: 'login'})
        }
    }
}


export const useMyFetch = createFetch({
    baseUrl: '/api',
    options: {
        async beforeFetch({ options }) {
            const myToken = await getMyToken()
            if(options.headers) {
                (options.headers as any).authorization = myToken || undefined
            }
            return { options }
        },
        async onFetchError(err){
            console.log('请求出错', err)
            const status = err?.data?.status as string
            const statusDict = (ERR_METHOD as any)[status]
            if(statusDict) {
                statusDict.cb(err.data)
            }
            return err
        }
    },
    fetchOptions: {
        mode: 'cors',
    },
})


/**
 * 封装 post 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function usePost<T = unknown>(
    url: MaybeRef<string>,
    payload?: MaybeRef<unknown>,
): UseFetchReturn<API_RES<T>, T> | Promise<UseFetchReturn<API_RES<T>, T>> {
    return useMyFetch<T, T>(url).post(payload).json()
}


/**
 * 分页请求器
 * @param url
 * @param payload
 */
export function useListPost<T = unknown>(
    url: MaybeRef<string>,
    payload?: MaybeRef<PAGE>,
): UseFetchReturn<API_RES<API_PAGINATE<T>>> {
    if(isRef(payload)) {
        payload.value = payload.value || {}
        payload.value.limit = payload.value.limit || 10
        payload.value.page = payload.value.page || 1
    } else {
        payload = payload || {}
        payload.limit = payload.limit || 10
        payload.page = payload.page || 1
    }
    return useMyFetch(url).post(payload).json()
}


export function usePostStream<T = unknown>(
    url: MaybeRef<string>,
    payload?: MaybeRef<unknown>,
){
    return useMyFetch<T, T>(url, {},{
        afterFetch: async (res)=>{
            // 不能调用arrary 因为 useFetch 已经调用了 arrayBuffer 进行处理了, 对于已经处理过arraybuffer的对象是不能够再次执行的
            // const arrayBuffer = await res.response.arrayBuffer()
            const blob = new Blob([res.data])
            const url = URL.createObjectURL(blob)
            return ({data: url})
        }
    }).post(payload).arrayBuffer<string>()
}



/**
 * 封装 get 请求
 * @param url 请求地址
 * @param query 请求参数
 */
export function useGet<T = unknown>(
    url: MaybeRef<string>,
    query?: MaybeRef<unknown>,
): UseFetchReturn<T> {
    const _url = computed(() => {
        const _url = unref(url)
        const _query = unref(query)
        const queryString = isObject(_query)
            ? stringifyQuery(_query as any)
            : _query || ''
        return `${_url}${queryString ? '?' : ''}${queryString}`
    })

    return useMyFetch<T, T>(_url).json()
}
