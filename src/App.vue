<template>
  <div id="app">
    <date-range-picker/>
    <div>
      hey
    </div>
  </div>
</template>

<script>
import DateRangePicker from "./components/DateRangePicker/";

export default {
  name: "App",
  components: {
    DateRangePicker
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Poppins');
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
