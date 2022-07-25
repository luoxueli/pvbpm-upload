<template>
  <el-form :model="formInline" ref="form" label-position="right" label-width="140px">
    <el-form-item label="审批人" prop="attachments" :rules="[{ required: true, message: '请上传附件' }]">
      <pv-upload
        :drag="false"
        upload-text="点击上传"
        v-model="formInline.attachments"
        multiple
        :limit="5"
        accept="jpg,bmp,png,gif,jpeg"
        disabled
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      formInline: {
        attachments: [{ name: 'xxx.png', url: '' }]
      }
    }
  }
}
</script>
