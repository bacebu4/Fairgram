<template>
  <q-page class="constrain-more q-pa-lg">
    <div class="camera-frame q-pa-lg">
      <video v-show="!imageCaptured" ref="video" class="full-width" autoplay />
      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width"
        height="240"
      />
    </div>

    <div class="text-center q-pa-lg">
      <q-btn
        @click="captureImage"
        round
        color="grey-10"
        size="lg"
        icon="eva-camera"
      />
    </div>

    <div class="row justify-center q-ma-md">
      <q-input
        class="col col-sm-10"
        outlined
        v-model="post.caption"
        placeholder="Caption"
        dense
      />
    </div>

    <div class="row justify-center q-ma-md">
      <q-input
        class="col col-sm-10"
        outlined
        v-model="post.location"
        placeholder="Location"
        dense
      >
        <template v-slot:append>
          <q-btn round dense flat icon="eva-navigation-2-outline" />
        </template>
      </q-input>
    </div>

    <div class="row justify-center q-mt-lg">
      <q-btn unelevated rounded color="primary" no-caps label="Post image" />
    </div>
  </q-page>
</template>

<script>
import { uid } from "quasar";
require("md-gum-polyfill");

export default {
  name: "PageCamera",
  data() {
    return {
      post: {
        id: uid(),
        caption: "",
        location: "",
        photo: null,
        date: Date.now()
      },
      imageCaptured: false
    };
  },
  methods: {
    initCamera() {
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(stream => {
          this.$refs.video.srcObject = stream;
        });
    },

    captureImage() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      this.post.photo = this.dataURItoBlob(canvas.toDataURL());
    },

    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      const byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      const mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      const ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      const ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      const blob = new Blob([ab], { type: mimeString });
      return blob;
    }
  },
  mounted() {
    this.initCamera();
  }
};
</script>

<style lang="sass">
.camera-frame
  border: 1px solid $grey
  border-radius: 25px
</style>
