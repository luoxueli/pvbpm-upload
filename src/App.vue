<template>
  <el-form :model="formInline" ref="form">
    <el-form-item label="审批人" prop="file" :rules="[{ required: true, message: '请上传附件' }]">
      <pv-upload v-model="formInline.file" :drag="false" :uploadText="`上传附件`" :downloadUuid="'123'" />
      <pv-upload v-model="formInline.file" disabled :drag="false" :uploadText="`上传附件`" :downloadUuid="'123'" />
    </el-form-item>
    <el-button @click="() => $refs.form.validate()">validate</el-button>
  </el-form>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      formInline: {
        file: [{name: '测试.png'}]
      }
    }
  }
}
</script>
