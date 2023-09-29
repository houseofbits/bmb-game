<script setup lang="ts">
import gameModes from "@src/config/gameModes";
import { PropType } from "vue";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";

const props = defineProps({
  serialNumber: {
    type: String,
    default: null,
  },
  difficulty: {
    type: Number as PropType<DifficultyLevel>,
    default: () => DifficultyLevel.EASY,
  },
});

function isDifficultyStarSelected(difficulty: DifficultyLevel): boolean {
  return difficulty <= props.difficulty;
}
</script>
<template>
  <div class="card-slot">
    <div class="slot-opening-border"></div>
    <div class="slot-opening"></div>

    <div class="card-3d-container">
      <div class="card-3d">
        <div class="bottom-shadow"></div>
        <div class="overlay-shadow"></div>
        <div class="inner-border">
          <div class="difficulty-label">DIFFICULTY LEVEL</div>
          <div class="difficulty-text">
            <template v-for="(v, i) in gameModes">
              <svg
                v-if="isDifficultyStarSelected(v.difficulty)"
                width="26"
                height="27"
                viewBox="0 0 26 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.06146 26.0683H9.46624V23.5066C9.46624 22.6179 11.0869 22.4611 11.0869 23.5066V26.0683H14.2758V23.5066C14.2758 22.3565 15.8964 22.5657 15.8964 23.5066V26.0683H18.3535C19.8173 26.0683 20.6928 24.7125 20.6537 23.8726V20.4745C22.3789 19.3767 25.2542 16.3969 25.411 11.6918C25.5678 6.98683 20.8105 0.504359 12.6029 0.608915C4.39528 0.713471 -0.152903 6.62088 0.00392541 12.0055C0.136392 16.5537 3.15804 19.3941 4.76123 20.4745V23.8726C4.76123 24.9181 5.91134 26.0683 7.06146 26.0683ZM11.1391 13.3648C11.1391 15.1548 9.68798 16.606 7.89789 16.606C6.10781 16.606 4.65666 15.1548 4.65666 13.3648C4.65666 11.5747 6.10781 10.1235 7.89789 10.1235C9.68798 10.1235 11.1391 11.5747 11.1391 13.3648ZM17.4125 16.606C19.2026 16.606 20.6537 15.1548 20.6537 13.3648C20.6537 11.5747 19.2026 10.1235 17.4125 10.1235C15.6224 10.1235 14.1713 11.5747 14.1713 13.3648C14.1713 15.1548 15.6224 16.606 17.4125 16.606Z"
                  fill="black"
                />
              </svg>

              <svg
                v-else
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M26 11.5673C26 15.1874 24.1311 18.2147 21.2049 20.1585V23.6653H21.2026C21.1469 24.9641 20.0719 26 18.7541 26H7.35246C5.99891 26 4.90164 24.9072 4.90164 23.5592V20.2285C1.91436 18.2878 0 15.2312 0 11.5673C0 5.17887 5.82029 0 13 0C20.1797 0 26 5.17887 26 11.5673ZM7.35246 23.5592H9.80328V22.1796C9.80328 20.7469 12.2541 20.6408 12.2541 22.1796V23.5592H13.8525V22.233C13.8525 20.8004 16.3033 20.6942 16.3033 22.233V23.5592H18.7541V20.0041C18.7541 19.4735 19.0596 18.3281 19.7939 17.9036C22.1433 16.3056 23.6557 13.9772 23.6557 11.5673C23.6557 6.52691 18.885 2.44082 13 2.44082C7.11499 2.44082 2.34426 6.52691 2.34426 11.5673C2.34426 13.9772 3.75863 16.3056 6.02049 17.9036C7.03358 18.7987 7.35246 19.3143 7.35246 20.0041V23.5592ZM11.6148 13.0531C11.6148 14.6941 10.2789 16.0245 8.63115 16.0245C6.98335 16.0245 5.64754 14.6941 5.64754 13.0531C5.64754 11.412 6.98335 10.0816 8.63115 10.0816C10.2789 10.0816 11.6148 11.412 11.6148 13.0531ZM20.459 13.0531C20.459 14.6941 19.1232 16.0245 17.4754 16.0245C15.8276 16.0245 14.4918 14.6941 14.4918 13.0531C14.4918 11.412 15.8276 10.0816 17.4754 10.0816C19.1232 10.0816 20.459 11.412 20.459 13.0531Z"
                  fill="black"
                />
              </svg>
            </template>
          </div>

          <div class="serial-number-label">SERIAL NUMBER</div>
          <div class="serial-number-text">
            {{ serialNumber || "??-????" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
