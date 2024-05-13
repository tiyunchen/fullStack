export interface ExploreItem {
    // 图片标题
    alt:string;
    // 图片资源
    src: string;
    // 图片尺寸列表
    sizeList: string,
    // 是否存在
    isExist: boolean,

    /**
     * 唯一标识
     */
    id?: number,

    /**
     * 关联标签
     */
    tags: {name: string, id: number}[]
}
export interface ExploreApi {
    imgList: ExploreItem[],
    size?: number
}

export default {
    // 探索
    EXPLORE: '/spider/explore',
    // 查询已有的图片
    ALL: '/spider/all',
    // 保存图片
    STORE: '/spider/store',

    // 删除照片
    REMOVE: '/spider/remove',

    // 添加标签
    ADD_TAG: '/spider/addTags',
}

// 事件
export const SpiderEvent = 'spider-store'


export const commandList = [
    {
        label: '壁纸',
        url: 'https://unsplash.com/t/wallpapers',
        value: 'wallpapers'
    },
    {
        label: '自然',
        url: 'https://unsplash.com/t/nature',
        value: 'nature'
    },
    {
        label: '旅途',
        url: 'https://unsplash.com/t/travel',
        value: 'travel'
    },
    {
        label: '建筑艺术',
        url: 'https://unsplash.com/t/architecture-interior',
        value: 'architecture-interior'
    },
    {
        label: '街景',
        url: 'https://unsplash.com/t/street-photography',
        value: 'street-photography'
    }
]
