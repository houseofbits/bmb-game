<script setup lang="ts">
import { ref } from "vue";
import { moduleDefinition } from "@src/config/moduleDefinition";

const emit = defineEmits(["close", "select"]);
const isModalVisible = ref(true);

function close(): void {
  emit("close");
}

function selectModule(index: number): void {
  emit("select", moduleDefinition[index].name);
}
</script>
<template>
  <v-dialog v-model="isModalVisible" width="auto" persistent>
    <v-card>
      <v-card-title> Select module </v-card-title>

      <v-list style="max-height: 400px" class="overflow-y-auto">
        <v-list-item
          v-for="(item, i) in moduleDefinition"
          :key="i"
          :value="item"
          color="primary"
          @click="selectModule(i)"
        >
          <!--          <template v-slot:prepend>-->
          <!--            <v-img-->
          <!--              class="mr-2"-->
          <!--              :width="100"-->
          <!--              :height="70"-->
          <!--              cover-->
          <!--              :src="item.imageUrl"-->
          <!--            />-->
          <!--          </template>-->

          <v-list-item-title v-text="item.title" />
          <v-list-item-subtitle v-text="item.description" />
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-btn color="secondary" @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
