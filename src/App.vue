<template>
  <el-form :model="formInline" ref="form">
    <el-form-item label="审批人" prop="file" :rules="[{ required: true, message: '请上传附件' }]">
      <pv-upload v-model="formInline.file" :drag="false" :downloadUuid="'123'" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      formInline: {
        file: []
      }
    }
  }
}
</script>
