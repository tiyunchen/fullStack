import { isObject } from '@vueuse/core'
import type {MaybeRef, UseFetchReturn} from '@vueuse/core'
import {computed, reactive, ref, unref} from 'vue'
import { stringifyQuery } from 'vue-router'
import {createFetch} from '@/service/useFetch'


const getMyToken = async () => {
    return ''
}
export const useMyFetch = createFetch({
    baseUrl: '/api',
    options: {
        async beforeFetch({ options }) {
            const myToken = await getMyToken()
            if(options.headers) {

                (options.headers as any).Authorization = `Bearer ${myToken}`
            }
            return { options }
        },
        async onFetchError(err){
            console.log('请求出错', err)
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
): UseFetchReturn<T> {
    return useMyFetch<T>(url).post(payload).json()
}


export function usePostStream<T = unknown>(
    url: MaybeRef<string>,
    payload?: MaybeRef<unknown>,
){
    return useMyFetch<T>(url, {},{
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

    return useMyFetch<T>(_url).json()
}
