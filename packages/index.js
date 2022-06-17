export default {
  install(Vue, opts = {}) {
    const {
      componentName = 'EasyUpload',
      listType = 'text',
      uploadText = '选取文件',
      downloadText = '模板下载',
      downloadUuid,
      action,
      name = 'file',
      templateURL,
      data = {},
      headers = {},
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
      theme,
      onTemplateDownload,
      onDownload,
      onRemove,
      renderPopoverReference = (h, t) => h('el-link', t)
    } = opts

    const isFunctionValue = (k, dv) => (typeof opts[k] === 'function' ? opts[k]() : opts[k] || dv)

    const EasyUpload = {
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
        templateURL: { type: String, default: templateURL },
        theme: { type: String, default: theme },
        templateParams: { type: Object, default: () => templateParams },
        data: { type: Object, default: () => data },
        headers: { type: Object, default: () => headers },
        fileList: { type: Array, required: false, default: () => [] },
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
        renderPopoverReference: { type: Function, default: renderPopoverReference },
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
          listType,
          templateURL,
          onTemplateDownload,
          onDownload,
          templateParams,
          onSuccess,
          onRemove,
          theme,
          beforeUpload
        } = this

        const defaultChildren = this.$slots.default
        const tip = this.$slots.tip
        const uploadTipText = tip || [
          accept && `只能上传${accept}文件，`,
          limit > 0 && `最多上传${limit}个，`,
          `且不超过${size}MB`
        ]
        const isTextView = listType === 'text'
        const textViewUploadStyle = `.el-upload {display: block;}.el-upload-list__item:first-child{margin-top: 0;}`
        const themeClass = theme ? `.color-theme { color: ${theme};}` : ''
        const dragUploadStyle = `
          ${themeClass}
          .el-upload-dragger { 
            display: flex;flex-direction: column;align-items: center;
            justify-content: space-around;background: #f5f7fd;
            border: 2px dashed ${theme || '#d9d9d9'}; 
          }
          .el-upload-dragger:hover {border: 2px dashed ${theme || '#d9d9d9'}; }
          .el-upload-dragger .el-icon-upload { margin-top: 20px }
          .el-upload-dragger .drag-icon { font-size: 40px;transition: all ease-in-out 0.3s;position: absolute;left: 0;top: 0; }
          .el-upload__icon { position: relative;width: 40px;height: 40px; }
          .el-upload__buttons { width: 85%; font-size: 14px }
          .el-upload-dragger .el-icon-folder-opened { opacity: 0; transform: translateX(100%); }
          .el-upload-dragger.is-dragover .el-icon-folder{ opacity: 0; transform: translateX(-100%); }
          .el-upload-dragger.is-dragover .el-icon-folder-opened{ opacity: 1; transform: translateX(0) scale(1.1); }
          ${disabled && '.el-upload {display: none}'}
        `

        const UploadStyle = h('style', [isTextView && disabled && textViewUploadStyle, dragUploadStyle].join(' '))
        const UploadTipElement = h('div', { class: 'el-upload__tip', slot: 'tip' }, uploadTipText)
        const NormalUploadTrigger = h('el-button', { slot: 'trigger', props: { type: 'primary' } }, uploadText)

        const DragUploadTrigger = [
          h('div', { class: 'el-upload__icon' }, [
            h('i', { class: 'el-icon-folder drag-icon color-theme' }),
            h('i', { class: 'el-icon-folder-opened drag-icon color-theme' })
          ]),
          h('div', { class: 'el-upload__text' }, [
            '将文件拖到这里开始上传',
            !templateURL && '或',
            !templateURL && h('span', { class: 'color-theme' }, '点击上传'),
            UploadTipElement
          ]),
          templateURL &&
            h('el-row', { class: 'el-upload__buttons', props: { type: 'flex', justify: 'space-between' } }, [
              h('span', { class: 'color-theme' }, '点击上传'),
              h(
                'span',
                {
                  class: 'color-theme',
                  on: {
                    click: e => {
                      e.stopPropagation()
                      onTemplateDownload
                        ? onTemplateDownload(templateURL, templateParams)
                        : window.open(templateURL + `?${templateParams}`, '_blank')
                    }
                  }
                },
                '下载模板'
              )
            ])
        ]
        const NormalDownloadTrigger = h(
          'el-button',
          {
            style: 'margin-left:10px',
            props: { type: 'success' },
            on: {
              click: e => {
                e.stopPropagation()
                onDownload(downloadUuid)
              }
            }
          },
          downloadText
        )
        const Uploader = h(
          'el-upload',
          {
            ref: 'uploader',
            props: {
              ...this.$props,
              beforeUpload: file => (beforeUpload ? beforeUpload(file, this) : true),
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
            disabled
              ? ''
              : defaultChildren ||
                (drag
                  ? DragUploadTrigger
                  : downloadUuid
                  ? [NormalUploadTrigger, NormalDownloadTrigger, UploadTipElement]
                  : [NormalUploadTrigger, UploadTipElement]),
            UploadStyle
          ]
        )

        return !viewWithCount
          ? Uploader
          : h(
              'el-popover',
              {
                scopedSlots: {
                  reference: () =>
                    renderPopoverReference(h, fileList.length > 0 ? `${fileList.length}个附件` : '暂无附件')
                }
              },
              [Uploader]
            )
      }
    }
    Vue.component(EasyUpload.name, EasyUpload)
  }
}
