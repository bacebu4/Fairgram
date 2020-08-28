<template>
  <q-page class='constrain-more q-pa-lg'>
    <div class='camera-frame q-pa-lg'>
      <video v-show='!imageCaptured' ref='video' class='full-width' autoplay />
      <canvas v-show='imageCaptured' ref='canvas' class='full-width' height='240' />
    </div>

    <div class='text-center q-pa-lg'>
      <q-btn
        v-if='hadCameraSupport'
        @click='captureImage'
        :disable='imageCaptured'
        round
        color='grey-10'
        size='lg'
        icon='eva-camera'
      />
      <q-file
        @input='captureImageFallback'
        v-else
        dense
        outlined
        v-model='imageUpload'
        label='Choose an image'
        accept='image/*'
      >
        <template v-slot:prepend>
          <q-icon name='eva-attach-outline' />
        </template>
      </q-file>
    </div>

    <div class='row justify-center q-ma-md'>
      <q-input
        class='col col-sm-10'
        outlined
        v-model.trim='post.caption'
        placeholder='Caption (required)'
        dense
      />
    </div>

    <div class='row justify-center q-ma-md'>
      <q-input
        class='col col-sm-10'
        :loading='locationLoading'
        outlined
        v-model.trim='post.location'
        placeholder='Location'
        dense
      >
        <template v-slot:append>
          <q-btn
            @click='getLocation'
            v-if='!locationLoading && locationSupported'
            round
            dense
            flat
            icon='eva-navigation-2-outline'
          />
        </template>
      </q-input>
    </div>

    <div class='row justify-center q-mt-lg'>
      <q-btn
        @click='addPost()'
        :disable='!post.caption || !post.photo'
        unelevated
        rounded
        color='primary'
        no-caps
        label='Post image'
      />
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
        date: Date.now(),
      },
      imageCaptured: false,
      hadCameraSupport: true,
      imageUpload: [],
      locationLoading: false,
    };
  },

  computed: {
    locationSupported() {
      return "geolocation" in navigator;
    },
  },

  methods: {
    async initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.$refs.video.srcObject = stream;
      } catch {
        this.hadCameraSupport = false;
      }
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
      this.disableCamera();
    },

    captureImageFallback(file) {
      this.post.photo = file;

      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },

    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    },

    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      const byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

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
    },

    getLocation() {
      this.locationLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getCityAndCountry(position);
        },
        (error) => {
          this.locationError();
        },
        { timeout: 7000 }
      );
    },

    async getCityAndCountry(position) {
      try {
        const apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`;
        const result = await this.$axios.get(apiUrl);
        this.locationSuccess(result);
      } catch (e) {
        this.locationError(e);
      }
    },

    locationSuccess(result) {
      this.post.location = result.data.city + `, ${result.data?.country}`;
      this.locationLoading = false;
    },

    locationError(e) {
      this.$q.dialog({
        title: "Error",
        message: "Could not find your location.",
      });
      this.locationLoading = false;
    },

    async addPost() {
      try {
        const formData = new FormData();
        formData.append("id", this.post.id);
        formData.append("caption", this.post.caption);
        formData.append("location", this.post.location);
        formData.append("date", this.post.date);
        formData.append("file", this.post.photo, this.post.id + ".png");

        const response = await this.$axios.post(
          `${process.env.API}/createPost`,
          formData
        );
        console.log("response: ", response);
      } catch (e) {
        console.log("e: ", e);
      }
    },
  },

  mounted() {
    this.initCamera();
  },

  beforeDestroy() {
    if (this.hadCameraSupport) {
      this.disableCamera();
    }
  },
};
</script>

<style lang="sass">
.camera-frame
  border: 1px solid $grey
  border-radius: 25px
</style>
