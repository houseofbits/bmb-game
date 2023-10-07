<script setup lang="ts"></script>
<template>
  <v-card-title class="text-h5 font-weight-bold mt-6 mb-2 text-center"
    >DETONATOR (MAIN MODULE)</v-card-title
  >
  <v-img height="200px" src="/images/timer-doc-header.svg" />

  <v-card-text class="text-body-1 mt-3">
    <p>
      Main module of the game is designed to select game mode, initiate and
      complete the game and display state of the game.
    </p>

    <p>
      <span class="text-h5">&#10102;</span> Card slot. Card contains the vital
      information of serial number and difficulty level. They will come in handy
      later.
    </p>
    <p>
      <span class="text-h5">&#10103;</span> Countdown timer displays the time
      remaining to disarm the device.
    </p>
    <p>
      <span class="text-h5">&#10104;</span> Arm / Disarm button. Push the button
      to begin the game and end the game if all the modules have been completed.
    </p>
    <p class="mt-2">
      If the mistake has been made during game or the countdown timer runs out,
      the game is considered to be lost.
    </p>
  </v-card-text>
</template>
