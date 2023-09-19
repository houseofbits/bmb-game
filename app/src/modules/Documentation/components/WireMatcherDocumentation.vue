<script setup lang="ts"></script>
<template>
  <v-card-title class="text-h4 mt-6">Wire matcher</v-card-title>
  <v-card-text class="text-body-1 mt-3">
    <v-img class="ma-4" height="350px" src="images/wires-doc.png" />
    <p class="mt-2">
      <v-table density="compact">
        <tbody>
          <tr>
            <td>1</td>
            <td>Connect one of the same color</td>
          </tr>
          <tr>
            <td>2</td>
            <td>
              Connect RED if first digit of serial number is Odd, else connect
              YELLOW
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>
              Connect RED or YELLOW if first digit of serial number is Odd, else
              connect GREEN
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>
              Connect RED or YELLOW if first digit of serial number is Odd, else
              connect BLUE
            </td>
          </tr>
          <tr>
            <td>5</td>
            <td>
              Connect GREEN if first digit of serial number is Odd, else connect
              BLUE
            </td>
          </tr>
          <tr>
            <td>6</td>
            <td>
              Connect YELLOW if first digit of serial number is Odd, else
              connect RED
            </td>
          </tr>
          <tr>
            <td>7</td>
            <td>
              Connect BLUE if first digit of serial number is Odd, else connect
              GREEN
            </td>
          </tr>
          <tr>
            <td>8</td>
            <td>Connect BLUE</td>
          </tr>
        </tbody>
      </v-table>
    </p>
  </v-card-text>
</template>
