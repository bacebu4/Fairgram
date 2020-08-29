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

    <q-footer class='bg-white'>
      <transition appear enter-active-class='animated fadeIn' leave-active-class='animated fadeOut'>
        <div class='banner-container bg-primary' v-if='showAppInstallBanner'>
          <div class='constrain'>
            <q-banner inline-actions class='bg-primary text-white' dense>
              <template v-slot:avatar>
                <q-avatar
                  color='white'
                  text-color='grey-10'
                  icon='eva-camera-outline'
                  font-size='16px'
                />
              </template>
              Install Fairgram?
              <template v-slot:action>
                <q-btn @click='installApp' flat label='Yes' dense class='q-px-sm' />
                <q-btn
                  @click='showAppInstallBanner = false'
                  flat
                  label='Later'
                  dense
                  class='q-px-sm'
                />
                <q-btn @click='neverShowAppInstallBanner' flat label='Never' dense class='q-px-sm' />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>

      <q-tabs
        class='text-grey-10 small-screen-only'
        active-color='primary'
        indicator-color='transparent'
      >
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
let deferredPrompt;

export default {
  name: "MainLayout",
  data() {
    return {
      showAppInstallBanner: false,
    };
  },

  methods: {
    async installApp() {
      // Hide the app provided install promotion
      this.showAppInstallBanner = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        this.neverShowAppInstallBanner();
      } else {
        console.log("User dismissed the install prompt");
      }
    },

    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set("neverShowAppInstallBanner", true);
    },
  },

  mounted() {
    const neverShowAppInstallBanner = this.$q.localStorage.getItem(
      "neverShowAppInstallBanner"
    );

    if (!neverShowAppInstallBanner) {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        setTimeout(() => {
          this.showAppInstallBanner = true;
        }, 3000);
      });
    }
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
