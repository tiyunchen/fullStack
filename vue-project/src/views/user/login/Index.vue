<template>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"

        :size="formSize"
        status-icon
    >
        <el-form-item label="账号" prop="username">
            <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" />
        </el-form-item>

        <el-form-item label="验证码" prop="code">
            <el-row>
                <el-col :span="20"><el-input v-model="ruleForm.code" placeholder="请输入验证码" /></el-col>
                <el-col :span="4"><img :src="captchaUrl" alt="" @click="resetCaptcha" ></el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {usePost} from "@/service";

interface RuleForm {
    username: string
    password: string
    // 验证码
    code: string
}

const formSize = ref('default')
const CAPTCHA_BASE = '/api/user/code'
const captchaUrl = ref(CAPTCHA_BASE)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    username: 'Hello',
    password: '',
    code: ''
})

const rules = reactive<FormRules<RuleForm>>({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max: 50, message: '长度在3到5位', trigger: 'blur' },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'change',
        },
    ],

    code: [
        {
            required: true,
            message: '请输入验证码',
            trigger: 'change',
        },
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {

            const {isFetching, data} = usePost('/user', ruleForm)
            console.log('submit!', isFetching)
            console.log('datadatadata', data)
        } else {
            console.log('error submit!', fields)
        }
    })
}


const resetCaptcha = () => {
    captchaUrl.value = `${CAPTCHA_BASE}?t=${new Date().getTime()}`
}



</script>
