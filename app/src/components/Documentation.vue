<script setup lang="ts"></script>
<template>
  <v-card width="1000px" class="pb-15">
    <v-card-title class="text-h3 mt-6">Bomb defusion manual</v-card-title>
    <v-card-text class="text-body-1 mt-3">
      <p>
        Not all modules will be armed for a given game. Only the armed modules
        have to be disarmed to complete the game.
      </p>
      <p class="mt-2">
        Some modules might activate themselves again even after they have been
        disarmed. This depends on the game mode and difficulty level
      </p>
    </v-card-text>

    <v-card-title class="text-h4 mt-6">Main module - TIMER</v-card-title>
    <v-card-text class="text-body-1 mt-3">
      <p>
        Main module of the game is designed to select game mode, initiate and
        complete the game and display state of the game.
      </p>
      <v-img class="ma-4" height="200px" src="https://picsum.photos/500/200" />
      <p class="mt-2">
        The module has three main components. First is the game mode selector.
        You select the game mode by inserting the card in the card slot.
      </p>
      <p class="mt-2">
        When card has been inserted you can arm the device by pressing the red
        ARM button.
      </p>
      <p class="mt-2">
        By arming the device, countdown timer is started to display the time
        left to disarm all the modules.
      </p>
      <p class="mt-2">
        When all the modules have been disarmed You can press the green DISARM
        button to disarm the device and complete the game.
      </p>
      <p class="mt-2">
        If the mistake has been made during game or the countdown timer runs
        out, the game is considered to be LOST. Appropriate audible warning is
        given to inform You about it.
      </p>
    </v-card-text>

    <v-card-title class="text-h4 mt-6">Labyrinth module</v-card-title>
    <v-card-text class="text-body-1 mt-3"></v-card-text>

    <v-card-title class="text-h4 mt-6">Simon Says module</v-card-title>
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
        Interval between repeating pattern is 1.5 seconds. Blinking interval for
        a individual colors in a pattern is 600ms
      </p>
    </v-card-text>

    <v-card-title class="text-h4 mt-6">Pin-code</v-card-title>
    <v-card-text class="text-body-1 mt-3">
      <p>Crack the pin code to disarm this module.</p>
      <p class="mt-2">
        Type in the number and press enter. A string of symbols will be
        displayed according to the state of each number.
      </p>
      <p class="mt-2">
        _ is displayed if the number is present in code but is not in the right
        position
      </p>
      <p class="mt-2">
        c is displayed if number is correct for a given position
      </p>
      <p class="mt-2">
        Blank is displayed if the number is not present in the code
      </p>
      <p class="mt-2">
        The module has limited number of attempts to decode the pin. Pin code
        can be cracked by brute force which should take a maximum of 11 attempts
        to enter the number. On harder difficulty levels number of attempts are
        decreased so the brute force method will not be possible and a more
        clever method will have to be used.
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
  </v-card>
</template>
