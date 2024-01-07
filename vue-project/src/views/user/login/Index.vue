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
        <el-form-item label="Activity name" prop="name">
            <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="Activity zone" prop="region">
            <el-select v-model="ruleForm.region" placeholder="Activity zone">
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
            </el-select>
        </el-form-item>

        <el-form-item label="验证码" prop="code">
            <div>
                <el-input v-model="ruleForm.code" placeholder="请输入验证码" />
                <img src="" alt="">
            </div>
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
    name: string
    region: string
    // 验证码
    code: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    name: 'Hello',
    region: '',
    code: ''
})

const rules = reactive<FormRules<RuleForm>>({
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    region: [
        {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change',
        },
    ],

    code: [
        {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change',
        },
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {

            const {isFetching, data} = usePost('/user', {
                name: '陈体云'
            })
            console.log('submit!', isFetching)
            console.log('datadatadata', data)
        } else {
            console.log('error submit!', fields)
        }
    })
}



</script>
