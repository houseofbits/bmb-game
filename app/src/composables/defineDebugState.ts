import { ref } from "vue";

const isDebugModeEnabled = ref(false);
export default () => {
  return {
    isDebugModeEnabled,
  };
};
