<template>
  <el-popover
    placement="bottom"
    class="s-container"
    trigger="click"
    transition="el-zoom-in-top"
    v-model="visible"
  >
    <s-drop-down
      @currentRange="setCurrentRange"
      @previousRange="setPreviousRange"
      @closePopup="closePopup"
      @compareChecked="changeCompareCheck"
      :pCurrentRange="currentRange"
      :pPreviousRange="previousRange"
      :compareChecked="isCompareEnabled"
    />
    <s-header 
      slot="reference"
      :currentRange="currentRange"
      :previousRange="previousRange"
      :isCompareEnabled="isCompareEnabled"
    />
  </el-popover>
</template>

<script>
import { Settings } from 'luxon';
import SHeader from './SHeader.vue';
import SDropDown from './SDropDown/';
export default {
  name: "SDateRangePicker",
  components: {
    SHeader,
    SDropDown
  },
  data () {
    return {
      currentRange: [],
      previousRange: [],
      isCompareEnabled: false,
      visible: false
    }
  },
  created () {
    Settings.defaultLocale = 'en';

    let to = Date.now()
    let from = new Date()
    from = from.setMonth(from.getMonth()-1)
    this.currentRange = [from, to]

    to = new Date()
    to = to.setMonth(to.getMonth()-1)
    from = new Date()
    from = from.setMonth(from.getMonth()*2-1)
    this.previousRange = [from, to]
  },
  methods: {
    setCurrentRange (val) {
      this.currentRange = val
    },
    setPreviousRange (val) {
      this.previousRange = val
    },
    changeCompareCheck (val) {
      this.isCompareEnabled = val
    },
    closePopup () {
      this.visible = false
    }
  }
};
</script>
<style lang="less" scoped>
.s-container {
  font-size: 13px;
  font-family: 'Montserrat', sans-serif;
}
</style>
<style>
  @import url('https://fonts.googleapis.com/css?family=Montserrat'); 
  .el-popover {
    font-family: 'Montserrat', sans-serif;
  }
</style>