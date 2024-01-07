import { createFetch, isObject } from '@vueuse/core'
import type {MaybeRef, UseFetchReturn} from '@vueuse/core'
import {computed, unref} from 'vue'
import { stringifyQuery, LocationQueryRaw } from 'vue-router'

import router from '../router/index'


const getMyToken = async () => {
    return ''
}
export const useMyFetch = createFetch({
    baseUrl: '/api',
    options: {
        async beforeFetch({ options }) {
            const myToken = await getMyToken()
            if(options.headers) {
                options.headers.Authorization = `Bearer ${myToken}`
            }
            return { options }
        },
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
            ? stringifyQuery(_query as LocationQueryRaw)
            : _query || ''
        return `${_url}${queryString ? '?' : ''}${queryString}`
    })

    return useMyFetch<T>(_url).json()
}
