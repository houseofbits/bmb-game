<script setup lang="ts"></script>
<template>
  <v-card-title class="text-h4 mt-6">Main module - TIMER</v-card-title>
  <v-card-text class="text-body-1 mt-3">
    <p>
      Main module of the game is designed to select game mode, initiate and
      complete the game and display state of the game.
    </p>
    <v-img class="ma-4" height="200px" src="https://picsum.photos/500/200" />
    <p class="mt-2">
      The module has three main components. First is the game mode selector. You
      select the game mode by inserting the card in the card slot.
    </p>
    <p class="mt-2">
      When card has been inserted you can arm the device by pressing the red ARM
      button.
    </p>
    <p class="mt-2">
      By arming the device, countdown timer is started to display the time left
      to disarm all the modules.
    </p>
    <p class="mt-2">
      When all the modules have been disarmed You can press the green DISARM
      button to disarm the device and complete the game.
    </p>
    <p class="mt-2">
      If the mistake has been made during game or the countdown timer runs out,
      the game is considered to be LOST. Appropriate audible warning is given to
      inform You about it.
    </p>
  </v-card-text>
</template>
