<template>
  <ul class="list-group">
    <li
      class="list-group-item"
      v-for="(sach, index) in sachs"
      :key="sach._id"
      :class="{ active: index === activeIndex }"
      @click="$emit('update:activeIndex', index)"
    >
      <SachCard :sach="sach" />
    </li>
  </ul>
</template>

<script>
import SachCard from "./SachCard.vue";

export default {
  components: {
    SachCard,
  },
  props: {
    sachs: { type: Array, default: [] },
    activeIndex: { type: Number, default: -1 },
  },
  emits: ["update:activeIndex"],
};
</script>

<style scoped>
.list-group-item {
  cursor: pointer;
}
.list-group-item.active {
  background-color: #f0f0f0;
  border-color: #007bff;
}
</style>
