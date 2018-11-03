<template>
  <div class="s-container">
    <s-header @toggle="toggle()"/>
    <s-drop-down v-show="isDropDownVisible"/>
  </div>
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
  data () {
    return {
      isDropDownVisible: false
    }
  },
  methods: {
    toggle () {
      this.isDropDownVisible = !this.isDropDownVisible
    }
  }
};
</script>
<style lang="less" scoped>
.s-container {
  font-size: 12px;
}
</style>
