<script setup lang="ts"></script>
<template>
  <v-card-title class="text-h4 mt-6">Simon Says module</v-card-title>
  <v-img height="200px" src="/images/simon-says-doc-main.svg" />
  <v-card-text class="text-body-1 mt-3">
    <p>
      Be prepared to calculate some basic checksums. Colored buttons blink in
      specific pattern. To disarm the module you should press the button of
      correct color matching the pattern.
    </p>
    <p class="mt-2">
      Each colored button has respective number assigned. To calculate the
      number of the correct answer You should sum all the color numbers which
      blinked and then find the remainder of a division by number of colors
      (Modulo).
    </p>
    <p class="mt-2 align-center">∑ c mod 4</p>

    <v-img height="200px" src="/images/simon-says-doc.png" />

    <p class="mt-2">
      Interval between repeating pattern is 1.5 seconds. Blinking interval for a
      individual colors in a pattern is 600ms
    </p>
  </v-card-text>
</template>
