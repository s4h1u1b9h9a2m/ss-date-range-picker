<template>
  <div class="s-dropdown">
    <div class="calender">
      <s-calender />
    </div>
    <div class="sidebar">
      <div class="item">
        <date-range-drop-down/>
      </div>
      <div class="item">
        <el-input 
          v-model="currentRange1"
          size="mini"
        ></el-input>
        <span class="seperator"> - </span>
        <el-input 
          v-model="currentRange2"
          size="mini"
        ></el-input>
      </div>
      <div class="item">
        <compare-to-drop-down/>
      </div>
      <div class="item">
        <el-input 
          v-model="previousRange1"
          size="mini"
        ></el-input>
        <span class="seperator"> - </span>
        <el-input 
          v-model="previousRange2"
          size="mini"
        ></el-input>
      </div>
      <div class="item button">
        <el-button>Apply</el-button>
        <el-button>Cancel</el-button>
      </div>
    </div>
  </div>    
</template>
<script>
import SCalender from './SCalender';
import DateRangeDropDown from './DateRangeDropDown';
import CompareToDropDown from './CompareToDropDown';
export default {
  components: {
    SCalender,
    DateRangeDropDown,
    CompareToDropDown
  },
  data () {
    return {
      currentRange1: new Date().toLocaleDateString('sv-SE'),
      currentRange2: new Date().toLocaleDateString('sv-SE'),
      previousRange1: new Date().toLocaleDateString('sv-SE'),
      previousRange2: new Date().toLocaleDateString('sv-SE'),
    }
  }
}
</script>

<style lang="less" scoped>
  .s-dropdown {
    width: fit-content;
    display: flex;
    flex-direction: row;
    // position: absolute;
    // right: 20.0002px;
    // left: auto;
    // max-width: none;
    // z-index: 3001;
    padding: 0 10px 0 10px;
    margin: 0;
    // margin-top: 5px;
    border: 0;
    // box-shadow: 0px 0px 15px 1px rgba(69,65,78,0.2);
    border-radius: 4px;
    // min-width: 10rem;
    font-size: 1rem;
    color: #212529;
    list-style: none;
    // background-color: #fff;
    // background-clip: padding-box;
    // width: auto;
  }
  .sidebar {
    padding: 10px;
    display: flex;
    flex-direction: column;
    .item {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
      .seperator {
        display: inline-block;
        height: 100%;
        padding: 0 5px;
        margin: 0;
        text-align: center;
        line-height: 25px;
        font-size: 14px;
        width: 5%;
        color: #303133;
      }
    }
    .button {
      margin-top: auto;
    }
  }
</style>

