<template>
  <q-page class="constrain q-pa-lg">
    <q-card
      class="card-post card--radiused q-mb-lg"
      v-for="post in posts"
      :key="post.id"
      flat
      bordered
    >
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img
              src="https://scontent-arn2-2.cdninstagram.com/v/t51.2885-19/s320x320/117433868_596686834347986_1746806507336062882_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com&_nc_ohc=jmXCf7MNAOUAX9dH-j5&oh=82fd867ea4f5a7ca25640385b91721ca&oe=5F6D70A1"
            />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">ui.bace</q-item-label>
          <q-item-label caption> {{ post.location }} </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-img :src="post.imageUrl" />

      <q-card-section>
        <div>{{ post.caption }}</div>
        <div class="text-caption text-grey">{{ niceDate(post.date) }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { date } from "quasar";

export default {
  name: "PageHome",
  data() {
    return {
      posts: [
        {
          id: 1,
          caption: "Golden Gate Bridge",
          date: 1598373938358,
          location: "Saint-Petersburg, Russia",
          imageUrl: "https://cdn.quasar.dev/img/parallax2.jpg"
        },
        {
          id: 2,
          caption: "Golden Gate Bridge",
          date: 1598373938358,
          location: "Saint-Petersburg, Russia",
          imageUrl: "https://cdn.quasar.dev/img/parallax2.jpg"
        },
        {
          id: 3,
          caption: "Golden Gate Bridge",
          date: 1598373938358,
          location: "Saint-Petersburg, Russia",
          imageUrl: "https://cdn.quasar.dev/img/parallax2.jpg"
        },
        {
          id: 4,
          caption: "Golden Gate Bridge",
          date: 1598373938358,
          location: "Saint-Petersburg, Russia",
          imageUrl: "https://cdn.quasar.dev/img/parallax2.jpg"
        }
      ]
    };
  },
  methods: {
    niceDate(value) {
      return date.formatDate(value, "MMMM D, hh:mmA");
    }
  }
};
</script>

<style lang="sass">
.card-post
  .q-img
    min-height: 200px

.card--radiused
  border-radius: 25px
  padding-top: 10px
</style>
