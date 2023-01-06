<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
body, html {
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
  overflow: scroll;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding:0;
}
</style>
