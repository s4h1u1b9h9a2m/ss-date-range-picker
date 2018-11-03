<template>
  <div class="s-dropdown">
    <div class="calender">
      <s-calender />
    </div>
    <div class="sidebar">
    hio
    </div>
  </div>    
</template>
<script>
import SCalender from './SCalender';
export default {
  components: {
    SCalender
  }
}
</script>

<style lang="less" scoped>
  .s-dropdown {
    width: fit-content;
    display: flex;
    flex-direction: row;
    position: absolute;
    // float: left;
    // top: 132px;
    right: 20.0002px;
    left: auto;
    max-width: none;
    z-index: 3001;
    padding: 10px;
    margin: 0;
    margin-top: 5px;
    border: 0;
    box-shadow: 0px 0px 15px 1px rgba(69,65,78,0.2);
    border-radius: 4px;
    min-width: 10rem;
    font-size: 1rem;
    color: #212529;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    // width: auto;
  }
</style>

