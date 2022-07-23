export default {
  install(Vue, opts = {}) {
    const {
      componentName = 'PvUpload',
      listType = 'text',
      uploadText = '选取文件',
      downloadText = '模板下载',
      downloadUuid,
      action,
      name = 'file',
      data = {},
      headers = () => ({}),
      templateParams = {},
      limit = 20,
      size = 50,
      withCredentials = false,
      multiple = false,
      drag = false,
      viewWithCount = false,
      autoUpload = true,
      showFileList = true,
      accept,
      onStart,
      generateUuid,
      onProgress,
      onSuccess,
      onError,
      onExceed,
      onChange,
      beforeUpload,
      httpRequest,
      beforeRemove,
      onPreview,
      onTemplateDownload,
      onDownload,
      onRemove
    } = opts

    const isFunctionValue = (k, dv) => (typeof opts[k] === 'function' ? opts[k]() : opts[k] || dv)

    const PvUpload = {
      name: componentName,
      model: {
        prop: 'fileList',
        event: 'change'
      },
      props: {
        listType: { type: String, default: listType },
        uploadText: { type: String, default: uploadText },
        downloadText: { type: String, default: downloadText },
        downloadUuid: { type: String, default: downloadUuid },
        action: { type: String, required: !action, default: action },
        name: { type: String, default: name },
        templateParams: { type: Object, default: () => templateParams },
        data: { type: Object, default: () => data },
        headers: { type: [Function, Object], default: typeof headers === 'function' ? headers : () => headers },
        fileList: { type: Array, required: false, default: () => [], validator: v => Array.isArray(v) },
        limit: { type: Number, default: limit, validator: v => v > 0 },
        size: { type: Number, default: size, validator: v => v > 0 },
        withCredentials: { type: Boolean, default: withCredentials },
        multiple: { type: Boolean, default: multiple },
        drag: { type: Boolean, default: drag },
        viewWithCount: { type: Boolean, default: viewWithCount },
        disabled: { type: Boolean, default: isFunctionValue('disabled') },
        autoUpload: { type: Boolean, default: autoUpload },
        showFileList: { type: Boolean, default: showFileList },
        accept: { type: String, default: accept },
        onStart: { type: Function, default: onStart },
        onProgress: { type: Function, default: onProgress },
        onSuccess: { type: Function, default: onSuccess },
        onError: { type: Function, default: onError },
        onExceed: { type: Function, default: onExceed },
        onChange: { type: Function, default: onChange },
        beforeUpload: { type: Function, default: beforeUpload },
        httpRequest: { type: Function, default: httpRequest },
        beforeRemove: { type: Function, default: beforeRemove },
        onPreview: { type: Function, default: onPreview },
        generateUuid: {
          type: Function,
          default: generateUuid ? generateUuid : () => `${+new Date()}`
        },
        onTemplateDownload: { type: Function, default: onTemplateDownload },
        onDownload: { type: Function, default: onDownload },
        onRemove: { type: Function, default: onRemove }
      },
      methods: {
        clearFiles() {
          this.$refs.uploader.clearFiles()
        },
        abort(file) {
          this.$refs.uploader.abort(file)
        },
        submit() {
          this.$refs.uploader.submit()
        }
      },
      render(h) {
        const {
          viewWithCount,
          fileList,
          accept,
          limit,
          size,
          disabled,
          drag,
          uploadText,
          downloadText,
          downloadUuid,
          onDownload,
          onSuccess,
          onRemove,
          headers,
          beforeUpload
        } = this

        const UploadTipElement = h(
          'div',
          { class: 'el-upload__tip', slot: 'tip' },
          this.$slots.tip || [
            accept && `只能上传${accept}文件，`,
            limit > 0 && `最多上传${limit}个，`,
            `且不超过${size}MB`
          ]
        )

        const Uploader = h(
          'el-upload',
          {
            ref: 'uploader',
            attrs: { 'data-uid': this._uid },
            class: { disabled },
            props: {
              ...this.$props,
              beforeUpload: file => (beforeUpload ? beforeUpload(file, this) : true),
              headers: headers ? (typeof headers === 'function' ? headers(this) : headers) : {},
              onSuccess: (response, file, fileList) => {
                fileList = fileList.map(({ response = {}, ...rest }) => ({ ...rest, ...response.data }))
                this.$emit('change', fileList)
                onSuccess && onSuccess(response, file, fileList)
              },
              onRemove: (file, fileList) => {
                fileList = fileList.map(({ response = {}, ...rest }) => ({ ...rest, ...response.data }))
                this.$emit('change', fileList)
                onRemove && onRemove(file, fileList)
              }
            }
          },
          [
            this.$slots.default ||
              (drag
                ? h('div', { class: 'el-upload__text', style: { 'line-height': '180px' } }, ['将文件拖到这里开始上传'])
                : [
                    downloadUuid &&
                      h(
                        'el-button',
                        {
                          style: 'margin-left:10px',
                          props: { type: 'success' },
                          on: { click: () => onDownload && onDownload(downloadUuid) }
                        },
                        downloadText
                      ),
                    h('el-button', { slot: 'trigger', props: { type: 'primary' } }, uploadText)
                  ])
          ]
        )

        if (disabled && !fileList.length) return h('span', '暂无附件')

        return viewWithCount
          ? h('el-popover', { scopedSlots: { reference: () => h('el-link', `${fileList.length}个附件`) } }, [
              Uploader,
              UploadTipElement
            ])
          : h('div', [Uploader, UploadTipElement])
      }
    }
    Vue.component(PvUpload.name, PvUpload)
  }
}
