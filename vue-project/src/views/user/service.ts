const USER_API = {
    // 用户登录
    LOGIN: '/user/login',

    // 用户注册
    REGISTER: '/user/register',
}

export interface LOGIN_FORM {
    username: string
    password: string
    // 验证码
    code: string
}

export interface REGISTER_FORM {
    username: string
    password: string
    password2: string
    // 验证码
    code: string
}

export default USER_API
