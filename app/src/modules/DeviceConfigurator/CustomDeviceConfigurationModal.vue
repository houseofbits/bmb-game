<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import ModuleSelectorModal from "@src/modules/DeviceConfigurator/ModuleSelectorModal.vue";

const emit = defineEmits(['apply', 'close']);

const tickLabels = {
    1: '1', 2: '2', 3: '3', 4: '4'
};

const modulesWidth = ref(2);
const modulesHeight = ref(2);
const isModalVisible = ref(true);
const selectedModuleSlot = ref<number | null>(null);
const isModuleSelectModalVisible = ref(false);
const selectedModules = ref<Array<string | null>>([]);

watch(() => modulesWidth.value, regenerateModules);
watch(() => modulesHeight.value, regenerateModules);

const numberOfModules = computed(() => {
    return modulesWidth.value * modulesHeight.value;
})

function regenerateModules(): void {
    const size = modulesWidth.value * modulesHeight.value;
    selectedModules.value = Array(size);
    selectedModules.value.fill('placeholder', 0, size);
}

function showModuleSelector(index: number): void {
    selectedModuleSlot.value = index;
    isModuleSelectModalVisible.value = true;
}

function selectModule(moduleName: string): void {
    if (selectedModuleSlot.value !== null) {
        selectedModules.value[selectedModuleSlot.value] = moduleName;
    }
    isModuleSelectModalVisible.value = false;
    selectedModuleSlot.value = null;
}

function applyConfiguration(): void {
    if (!selectedModules.value.some((val) => val === 'timer')) {
        return;
    }

    //TODO: Show error message

    emit('apply', modulesWidth.value, modulesHeight.value, selectedModules.value);
}

function close(): void {
    emit('close');
}

onMounted(() => {
    regenerateModules();
});

</script>
<template>
    <v-dialog
            v-model="isModalVisible"
            width="auto"
            persistent
    >
        <v-card>
            <v-container>

                <div class="text-caption">Module count horizontal</div>
                <v-slider
                        v-model="modulesWidth"
                        :ticks="tickLabels"
                        :min="1"
                        :max="4"
                        step="1"
                        show-ticks="always"
                        tick-size="4"
                />
                <div class="text-caption">Module count vertical</div>
                <v-slider
                        v-model="modulesHeight"
                        :ticks="tickLabels"
                        :min="1"
                        :max="4"
                        step="1"
                        show-ticks="always"
                        tick-size="4"
                />

                <div class="config-device">
                    <div class="config-device-row" :class="['device-width-'+modulesWidth]">
                        <div v-for="(num, index) in numberOfModules" class="config-module"
                             @click="() => showModuleSelector(index)">
                            {{ selectedModules[index]?.toUpperCase() }}
                        </div>
                    </div>
                </div>
            </v-container>

            <v-card-actions>
                <v-btn color="primary" variant="outlined" @click="applyConfiguration">Apply
                    configuration
                </v-btn>
                <v-btn color="secondary" @click="close">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <ModuleSelectorModal
            v-if="isModuleSelectModalVisible"
            @select="selectModule"
            @close="isModuleSelectModalVisible = false"
    />
</template>