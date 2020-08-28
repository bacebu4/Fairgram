<template>
  <q-layout view='lHh Lpr lFf'>
    <q-header class='bg-white text-grey-10' bordered>
      <q-toolbar class='constrain'>
        <q-toolbar-title class='text-grand-hotel q-ml-md'>Fairgram</q-toolbar-title>
        <q-btn flat round to='/' class='large-screen-only q-mr-md' icon='eva-home-outline' />
        <q-btn
          flat
          round
          to='/camera'
          class='large-screen-only q-mr-md'
          icon='eva-plus-circle-outline'
        />
      </q-toolbar>
    </q-header>

    <q-footer class='bg-white small-screen-only'>
      <q-banner inline-actions class='bg-primary text-white' dense>
        <template v-slot:avatar>
          <q-avatar color='white' text-color='grey-10' icon='eva-camera-outline' font-size='16px' />
        </template>
        Install Fairgram?
        <template v-slot:action>
          <q-btn flat label='Yes' dense class='q-px-sm' />
          <q-btn flat label='Later' dense class='q-px-sm' />
          <q-btn flat label='Never' dense class='q-px-sm' />
        </template>
      </q-banner>

      <q-tabs class='text-grey-10' active-color='primary' indicator-color='transparent'>
        <q-route-tab to='/' icon='eva-home-outline' />
        <q-route-tab to='/camera' icon='eva-plus-circle-outline' />
      </q-tabs>
    </q-footer>

    <q-page-container class='bg-grey-2'>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {};
  },
};
</script>

<style lang="sass">
.q-toolbar
  @media (min-width: $breakpoint-sm-min)
    height: 55px
.q-toolbar__title
  font-size: 24px
  @media (max-width: $breakpoint-xs-max)
    text-align: center
.q-footer
  .q-tab__icon
    font-size: 26px
</style>
