<script setup lang="ts">
defineProps({
    isArmed: {
        type: Boolean,
        required: true
    },
    isDisarmed: {
        type: Boolean,
        required: true
    }
});
</script>
<template>
    <div class="module-status-indicator">
        <div class="led armed" :class="{active: isArmed}">
            <div class="label">ARMED</div>
        </div>
        <div class="led disarmed" :class="{active: isDisarmed}">
            <div class="label">DISARMED</div>
        </div>
    </div>
</template>