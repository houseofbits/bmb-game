<script setup lang="ts">
import MorseCodeDocumentation from "@src/modules/Documentation/components/MorseCodeDocumentation.vue";
import WireMatcherDocumentation from "@src/modules/Documentation/components/WireMatcherDocumentation.vue";
import NumberDecoderDocumentation from "@src/modules/Documentation/components/NumberDecoderDocumentation.vue";
import BinaryLogicDocumentation from "@src/modules/Documentation/components/BinaryLogicDocumentation.vue";
import SimonSaysDocumentation from "@src/modules/Documentation/components/SimonSaysDocumentation.vue";
import TimerDocumentation from "@src/modules/Documentation/components/TimerDocumentation.vue";
import LabyrinthDocumentation from "@src/modules/Documentation/components/LabyrinthDocumentation.vue";
</script>
<template>
  <v-card width="1000px" class="docs-container pb-15">
    <v-card-title class="text-h3 font-weight-bold mt-6 text-center"
      >BMB DISARMING MANUAL</v-card-title
    >
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

    <TimerDocumentation />

    <LabyrinthDocumentation />

    <SimonSaysDocumentation />

    <NumberDecoderDocumentation />

    <MorseCodeDocumentation />

    <WireMatcherDocumentation />

    <BinaryLogicDocumentation />
  </v-card>
</template>
