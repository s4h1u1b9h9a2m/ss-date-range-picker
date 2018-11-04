<template>
  <div class="s-dropdown">
    <div class="calender">
      <s-calender 
        @currentRange="setCurrentRange"
        @previousRange="setPreviousRange"
        @currentRangeSelecting="currentRangeSelecting"
        @previousRangeSelecting="previousRangeSelecting"
        :isCompareEnabled="compareChecked"
      />
    </div>
    <div class="sidebar">
      <div class="item">
        <date-range-drop-down/>
      </div>
      <div class="item">
        <el-input 
          v-model="currentRange1"
          size="mini"
          ref="currentSelected1"
          class="currentSelected"
        ></el-input>
        <span class="seperator"> - </span>
        <el-input 
          v-model="currentRange2"
          size="mini"
          ref="currentSelected2"
          class="currentSelected"
        ></el-input>
      </div>
      <div class="item">
        <compare-to-drop-down
          @compareCheck="changeCompareCheck"
          @compareSelected="changeCompareSelected"
        />
      </div>
      <div class="item">
        <el-input 
          v-model="previousRange1"
          size="mini"
          ref="previousSelected1"
          class="previousSelected"
          :disabled="!compareChecked"
          :readonly="isPreviousRangeReadOnly"
        ></el-input>
        <span class="seperator"> - </span>
        <el-input 
          v-model="previousRange2"
          size="mini"
          ref="previousSelected2"
          class="previousSelected"
          :disabled="!compareChecked"
          :readonly="isPreviousRangeReadOnly"
        ></el-input>
      </div>
      <div class="item button">
        <el-button @click="focus">Apply</el-button>
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
      currentRange: [],
      currentRange1: new Date().toLocaleDateString('sv-SE'),
      currentRange2: new Date().toLocaleDateString('sv-SE'),
      previousRange: [],
      previousRange1: new Date().toLocaleDateString('sv-SE'),
      previousRange2: new Date().toLocaleDateString('sv-SE'),
      compareChecked: false,
      compareSelected: 1, // Previous Period
    }
  },
  mounted () {
    // this.$nextTick(() => this.$refs.h.focus())
  },
  computed: {
    isPreviousRangeReadOnly () {
      return this.compareSelected !== 0
    }
  },
  methods: {
    focus () {
      this.$refs.h.focus()
    },
    setCurrentRange (val) {
      this.currentRange = val
      if (this.currentRange.length === 1) {
        this.currentRange1 = new Date(this.currentRange[0]).toLocaleDateString('sv-SE')
        this.currentRange2 = ""
      } else if (this.currentRange.length === 2) {
        this.currentRange1 = new Date(this.currentRange[0]).toLocaleDateString('sv-SE')
        this.currentRange2 = new Date(this.currentRange[1]).toLocaleDateString('sv-SE')
      }
    },
    setPreviousRange (val) {
      this.previousRange = val
      if (this.previousRange.length === 1) {
        this.previousRange1 = new Date(this.previousRange[0]).toLocaleDateString('sv-SE')
        this.previousRange2 = ""
      } else if (this.previousRange.length === 2) {
        this.previousRange1 = new Date(this.previousRange[0]).toLocaleDateString('sv-SE')
        this.previousRange2 = new Date(this.previousRange[1]).toLocaleDateString('sv-SE')
      }
    },
    currentRangeSelecting (val) {
      if (val === 1) {
        this.$refs.currentSelected1.focus()
      } else if (val === 2) {
        this.$refs.currentSelected2.focus()
      }
    },
    previousRangeSelecting (val) {
      if (val === 1) {
        this.$refs.previousSelected1.focus()
      } else if (val === 2) {
        this.$refs.previousSelected2.focus()
      }
    },
    changeCompareCheck (val) {
      this.compareChecked = val
    },
    changeCompareSelected (val) {
      this.compareSelected = val
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
<style lang="less">
  .currentSelected {
    input.el-input__inner:focus {
      border-color: #404ba2;
    }
  }
  .previousSelected {
    input.el-input__inner:focus {
      border-color: #FF9800;
    }
  }
</style>


