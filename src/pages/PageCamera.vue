<template>
  <q-page class='constrain-more q-pa-lg'>
    <div class='camera-frame q-pa-lg'>
      <img src='https://cdn.quasar.dev/img/parallax2.jpg' alt class='full-width' />
    </div>

    <div class='text-center q-pa-lg'>
      <q-btn round color='grey-10' size='lg' icon='eva-camera' />
    </div>

    <div class='row justify-center q-ma-md'>
      <q-input class='col col-sm-10' outlined v-model='text' label='Caption' dense />
    </div>

    <div class='row justify-center q-ma-md'>
      <q-input class='col col-sm-10' outlined v-model='text' label='Location' dense>
        <template v-slot:append>
          <q-btn round dense flat icon='eva-navigation-2-outline' />
        </template>
      </q-input>
    </div>

    <div class='row justify-center q-mt-lg'>
      <q-btn unelevated rounded color='primary' no-caps label='Post image' />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageCamera",
};
</script>

<style lang="sass">
.camera-frame
  border: 1px solid $grey
  border-radius: 25px
</style>
