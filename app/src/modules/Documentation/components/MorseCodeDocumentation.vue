<script setup lang="ts">
import { computed } from "vue";
import Alphabet from "@src/modules/MorseCode/helpers/alphabet";
import { Signal } from "@src/modules/MorseCode/helpers/constants";

const table1: Array<{ letter: string; signal: Array<Signal> }> = computed(
  () => {
    const keys = Object.keys(Alphabet);
    const size = Math.ceil(keys.length / 3);
    const result = [];

    for (let i = 0; i < size; i++) {
      result.push({
        letter: keys[i],
        signal: Alphabet[keys[i]],
      });
    }

    return result;
  },
);

const table2: Array<{ letter: string; signal: Array<Signal> }> = computed(
  () => {
    const keys = Object.keys(Alphabet);
    const size = Math.ceil(keys.length / 3);
    const result = [];

    for (let i = size; i < size * 2; i++) {
      result.push({
        letter: keys[i],
        signal: Alphabet[keys[i]],
      });
    }

    return result;
  },
);

const table3: Array<{ letter: string; signal: Array<Signal> }> = computed(
  () => {
    const keys = Object.keys(Alphabet);
    const size = Math.ceil(keys.length / 3);
    const result = [];

    for (let i = size * 2; i < keys.length; i++) {
      result.push({
        letter: keys[i],
        signal: Alphabet[keys[i]],
      });
    }

    return result;
  },
);

function createSignalString(signal: Array<Signal>): string {
  let result = "";

  for (const part of signal) {
    result += part === Signal.DIT ? " •" : " —";
  }

  return result;
}
</script>

<template>
  <v-card-title class="text-h4 mt-6">Morse-code</v-card-title>
  <v-card-text class="text-body-1 mt-3">
    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <v-table density="compact">
          <tbody>
            <tr v-for="row in table1">
              <td>{{ row.letter }}</td>
              <td v-html="createSignalString(row.signal)" />
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col cols="12" sm="4">
        <v-table density="compact">
          <tbody>
            <tr v-for="row in table2">
              <td>{{ row.letter }}</td>
              <td v-html="createSignalString(row.signal)" />
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col cols="12" sm="4">
        <v-table density="compact">
          <tbody>
            <tr v-for="row in table3">
              <td>{{ row.letter }}</td>
              <td v-html="createSignalString(row.signal)" />
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-card-text>
</template>
