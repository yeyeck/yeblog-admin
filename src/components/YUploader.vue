<template>
  <div class="y-uploader bg-white" >
    <div class="row q-pa-sm text-primary justify-center" >
      <div class="column col-12 col-md-4 justify-center">
        <input ref="chooser" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="imageChange()" hidden/>
        <div class="row justify-center q-pb-sm"  style="width: 100%">
          <q-avatar size="120px" rounded>
            <img :src="cropData"/>
          </q-avatar>
        </div>
        <div class="row justify-center q-pb-md"  style="width: 100%">
          <q-btn dense outline icon="backup" @click="uploadImage()" label="上传头像"/>
        </div>
      </div>
      <div class="col-12 col-md-8">
        <div class="q-pa-sm">
          <vue-cropper
            ref="cropper"
            :img="image"
            outputType="png"
            :canScale="true"
            :fixedBox="true"
            :autoCrop="true"
            :original="true"
            style="height: 200px"
            autoCropWidth="100px"
            autoCropHeight="100px" />
          </div>
          <div class="row justify-between q-pa-sm">
            <q-btn dense size="sm" filled icon="add" color="primary" label="选择图片" @click="choose()"/>
            <q-btn dense size="sm" filled glossy icon="visibility" color="primary" label="预览" @click="preview()"/>
            <q-btn dense size="sm" filled glossy icon="delete" color="primary" label="删除" @click="clear()"/>
          </div>
      </div>
    </div>
    <q-separator/>
    <!-- <div class="q-pt-md">
      <q-img :src="image" style="max-width: 200px; max-height: 200px; min-height: 60px" alt="上传头像">
        <q-btn style="width: 100%; height: 100%" flat icon="delete" @click="deleteFile()"/>
      </q-img>
    </div> -->
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'

export default {
  name: 'YUploader',
  props: {
    url: {
      type: String
    }
  },
  components: {
    VueCropper
  },
  data () {
    return {
      image: '',
      cropData: ''
    }
  },
  methods: {
    choose () {
      this.$refs.chooser.click()
    },
    deleteFile () {
      this.$refs.chooser.value = ''
      this.image = ''
      this.btnIcon = 'add'
    },
    imageChange () {
      const file = this.$refs.chooser.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.readAsDataURL(file)
      const that = this
      reader.onload = function (e) {
        that.image = this.result
      }
    },
    preview () {
      const that = this
      this.$refs.cropper.getCropData((data) => {
        that.cropData = data
      })
    },
    clear () {
      this.image = ''
      this.cropData = ''
    },
    uploadImage () {
      this.$refs.cropper.getCropBlob((data) => {
        const param = new FormData()
        param.append('file', data, 'header.png')
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        this.$axios.post(this.url, param, config)
          .then((response) => {
            this.$emit('success', response.data)
          }).catch(function (error) {
            console.log(error)
          })
      })
    },
    isClient () {
      if (process.env.SERVER) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style scoped>
.y-uploader {
  min-height: 200px;
}

</style>
