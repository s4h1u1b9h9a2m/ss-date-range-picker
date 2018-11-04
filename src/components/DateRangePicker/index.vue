<template>
  <!-- <el-dropdown 
    trigger="click" 
    placement="bottom" 
    class="s-container"
    :hide-on-click="false"
  >
    <s-header/>
    <el-dropdown-menu slot="dropdown">
      <s-drop-down/>
    </el-dropdown-menu>
  </el-dropdown> -->
  <el-popover
    placement="bottom"
    class="s-container"
    trigger="click"
    transition="el-zoom-in-top"
  >
    <s-drop-down/>
    <!-- <el-button slot="reference">Delete</el-button> -->
    <s-header slot="reference"/>
  </el-popover>
</template>

<script>
import SHeader from './SHeader.vue';
import SDropDown from './SDropDown/';
export default {
  name: "DateRangePicker",
  components: {
    SHeader,
    SDropDown
  },
  methods: {
  }
};
</script>
<style lang="less" scoped>
.s-container {
  font-size: 12px;
}
</style>
