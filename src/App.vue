<template>
  <div id="app">
    <!-- <s-date-range-picker/> -->
    <date-range-picker/>
  </div>
</template>

<script>
import DateRangePicker from "./components/SDateRangePicker/";

export default {
  name: "App",
  components: {
    DateRangePicker
  }
};
</script>
<style>
 @import url('https://fonts.googleapis.com/css?family=Montserrat'); 
#app{
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.el-popover {
  font-family: 'Montserrat', sans-serif;
}
</style>
