<template>
  <div class="desktop-sidebar">
    <img src="@/assets/sidebar.png">

  </div>
</template>
<script>

export default {
  name: "desktop-sidebar",
}
</script>

<style scoped lang="scss">
.desktop-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  background: #fff;
  width: calc(100% - 800px);
  z-index: 999;
  display: flex;
  img {
    height: 100%;
  }
  @media (max-width: 1100px) {
    display: none;
  }
}
</style>
