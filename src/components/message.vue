<template>
  <div class="message" :class="['level-'+level]">
    <slot></slot>
  </div>
</template>
<script lang="ts">

export default {
  props: {
    level: {
      type: Number,
      default: 0
    },
    parent: {
      type: String,
      default: ""
    }
  }
}
</script>

<style>
.message {
  box-sizing: border-box;
  padding-top: 10px;
  height: 50px;
  border-bottom: 1px solid #f00;
  background: rgba(0,0,0,0.2);
}
.level-1 {
  background: rgba(0,0,0,0.3);
}
.level-2 {
  background: rgba(0,0,0,0.5);
}
</style>
