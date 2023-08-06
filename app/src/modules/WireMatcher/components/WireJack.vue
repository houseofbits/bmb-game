<script setup lang="ts">
const emit = defineEmits(['select']);
const props = defineProps({
    color: {
        type: String,
        required: true
    },
    orientation: {
        type: String,
        default: () => 'up'
    }
});
</script>
<template>
    <div class="slot">
        <div v-if="orientation==='down'" class="led-indicator" :class="[props.color]" />

        <div class="slot-input" @click="emit('select', $event)">
            <div class="inner-body">
                <div class="hole"/>
            </div>
        </div>

        <div v-if="orientation==='up'" class="led-indicator" :class="[props.color]" />
    </div>
</template>