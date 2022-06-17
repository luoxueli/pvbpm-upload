<template>
  <el-form :model="formInline" ref="form">
    {{ formInline }}
    <el-form-item label="审批人" prop="file" :rules="[{ required: true, message: '请上传附件' }]">
      <pv-upload v-model="formInline.file" :drag="false" :uploadText="`上传附件`" :downloadUuid="'123'" />
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
        file: [
          {
            status: 'success',
            name: 'upload/20220321/5c3b0210a1bf1ec4634dcc41b649e3be.jpeg',
            size: 79104,
            percentage: 100,
            uid: 1647831024615,
            raw: {
              uid: 1647831024615
            },
            link: 'http://39.101.163.248:9000/bladex/upload/20220321/5c3b0210a1bf1ec4634dcc41b649e3be.jpeg',
            domain: 'http://39.101.163.248:9000/bladex',
            originalName: '2f23348cf9d68004bd114c9474907bc7.jpeg',
            attachId: '1505738809846853633'
          },
          {
            status: 'success',
            name: 'upload/20220321/64be6639d2c8ebb92254d908f70e8ab2.png',
            size: 1717,
            percentage: 100,
            uid: 1647831034561,
            raw: {
              uid: 1647831034561
            },
            link: 'http://39.101.163.248:9000/bladex/upload/20220321/64be6639d2c8ebb92254d908f70e8ab2.png',
            domain: 'http://39.101.163.248:9000/bladex',
            originalName: 'favicon.png',
            attachId: '1505738850942644225'
          }
        ]
      }
    }
  }
}
</script>
