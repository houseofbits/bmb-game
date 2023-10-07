<script setup lang="ts"></script>
<template>
  <v-card-title class="text-h5 font-weight-bold mt-6 mb-2 text-center"
    >SMART LOCK</v-card-title
  >
  <v-img height="200px" src="/images/number-decoder-doc-main.svg" />
  <v-card-text class="text-body-1 mt-3">
    <p>Crack the pin code to disarm this module.</p>
    <p class="mt-2">
      Type in the number and press enter. A string of symbols will be displayed
      according to the state of each number.
    </p>
    <p class="mt-2">
      _ is displayed if the number is present in code but is not in the right
      position
    </p>
    <p class="mt-2">c is displayed if number is correct for a given position</p>
    <p class="mt-2">
      Blank is displayed if the number is not present in the code
    </p>
    <p class="mt-2">
      The module has limited number of attempts to decode the pin. Pin code can
      be cracked by brute force which should take a maximum of 11 attempts to
      enter the number. On harder difficulty levels number of attempts are
      decreased so the brute force method will not be possible and a more clever
      method will have to be used.
    </p>
    <p class="mt-2">
      Each difficulty level has increasingly longer code and leser number of
      attempts:
    </p>
    <p class="mt-2">EASY: 3 numbers, 11 attempts and 2 srikes</p>
    <p class="mt-2">AVERAGE: 4 numbers, 9 attempts and 2 strikes</p>
    <p class="mt-2">HARD: 5 numbers, 5 attempts and 2 strikes</p>
    <p class="mt-2">IMPOSSIBLE: 6 numbers, 5 attempts and no strikes</p>
  </v-card-text>
</template>
