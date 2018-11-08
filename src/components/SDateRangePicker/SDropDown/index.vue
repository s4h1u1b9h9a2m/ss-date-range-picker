<template>
  <div class="s-dropdown">
    <div class="calender">
      <s-calender 
        @currentRange="setCurrentRange"
        @previousRange="setPreviousRange"
        @currentRangeSelecting="currentRangeSelecting"
        @previousRangeSelecting="previousRangeSelecting"
        :currentRange="currentRange"
        :previousRange="previousRange"
        :isCompareEnabled="compareChecked"
        :isCompareCustomSelected="isCompareCustomSelected"
      />
    </div>
    <div class="sidebar">
      <div class="item">
        <date-range-drop-down
          @dateRangeSelected="dateRangeSelected"
          :dateRange="dateRangeDropDownValue"
        />
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
      <div class="item gap">
        <compare-to-drop-down
          :compareChecked="compareChecked"
          :compareSelected="compareSelected"
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
        <el-button @click="saveChanges">Apply</el-button>
        <el-button @click="cancelChanges">Cancel</el-button>
      </div>
    </div>
  </div>    
</template>
<script>
const { DateTime, Interval, Duration } = require('luxon');
import { getLocaleDateString, getUTCDate } from '../utils'
import SCalender from './SCalender/';
import DateRangeDropDown from './DateRangeDropDown';
import CompareToDropDown from './CompareToDropDown';
export default {
  components: {
    SCalender,
    DateRangeDropDown,
    CompareToDropDown
  },
  props: {
    pCurrentRange: {
      type: Array,
      default: () => []
    },
    pPreviousRange: {
      type: Array,
      default: () => []
    },
    compareChecked: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      today: DateTime.local(DateTime.local().year, DateTime.local().month, DateTime.local().day),
      currentRange: this.pCurrentRange,
      previousRange: this.pPreviousRange,
      compareSelected: 'P1D', // Previous Period
      dateRangeDropDownValue: 0
    }
  },
  mounted () {
    // this.$nextTick(() => this.$refs.h.focus())
  },
  watch: {
    pCurrentRange (val) {
      this.currentRange = val
    },
    pPreviousRange (val) {
      this.previousRange = val
    },
    dateRangeDropDownValue (val) {
      if (val) { //If not Custom
        const split = val.split("-")
        const start = split[0]
        const duration = split[1]
        const startOf = split[2]

        let startDate = this.today.minus(Duration.fromISO(start))
        if (startOf) {
          startDate = startDate.startOf(startOf)
        }
        const endDate = startDate.plus(Duration.fromISO(duration))
        this.currentRange = [startDate.ts, endDate.ts]
      }
    },
    compareSelected (val) {
      this.compareAutoSelect()
    },
    currentRange (val) {
      this.compareAutoSelect()
    }
  },
  computed: {
    isPreviousRangeReadOnly () {
      return this.compareSelected !== 0
    },
    isCompareCustomSelected () {
      return this.compareSelected === 0
    },
    currentRange1: {
      get () {
        if (this.currentRange[0]) {
          return getLocaleDateString(this.currentRange[0])
        }
      },
      set (val) {
        
        if (!val) {
          return
        }

        let date = DateTime.fromSQL(val)
        date = DateTime.local(date.year, date.month, date.day)
        if (isNaN(date)){
          return
        }

        if (date > this.today)
              return true

        if (this.currentRange.length === 2 && date > this.currentRange[1]) {
            return true
        } 
        // if (this.previousRange.length === 2 && date <= this.previousRange[1]) {
        //     return true
        // }
          
        this.$set(this.currentRange, 0, date)
      }
    },
    currentRange2: {
      get () {
        if (this.currentRange[1]) {
          return getLocaleDateString(this.currentRange[1])
        }
      },
      set (val) {
        if (!val) {
          return
        }

        let date = DateTime.fromSQL(val)
        date = DateTime.local(date.year, date.month, date.day)
        if (isNaN(date)){
          return
        }

        if (date > this.today)
              return true

        if (this.currentRange.length === 1 && date < this.currentRange[0]) {
            return true
        } 
        // if (this.previousRange.length === 2 && date <= this.previousRange[1]) {
        //     return true
        // }

        if (this.currentRange.length === 0) {
          this.$set(this.currentRange, 0, date)
        }
        this.$set(this.currentRange, 1, date)
      }
    },
    previousRange1: {
      get () {
        if (this.previousRange[0]) {
          return getLocaleDateString(this.previousRange[0])
        }
      },
      set (val) {
        if (!val) {
          return
        }

        let date = DateTime.fromSQL(val)
        date = DateTime.local(date.year, date.month, date.day)
        if (isNaN(date)){
          return
        }

        if (date > this.today)
              return

        if (this.previousRange.length === 2 && date > this.previousRange[1]) {
            return
        } 
        // if (this.currentRange.length === 2 && date >= this.currentRange[0]) {
        //     return
        // }

        this.$set(this.previousRange, 0, date)
      }
    },
    previousRange2: {
      get () {
        if (this.previousRange[1]) {
          return getLocaleDateString(this.previousRange[1])
        }
      },
      set (val) {
        if (!val) {
          return
        }

        let date = DateTime.fromSQL(val)
        date = DateTime.local(date.year, date.month, date.day)
        if (isNaN(date)){
          return
        }

        if (date > this.today)
              return

        if (this.previousRange.length === 1 && date < this.previousRange[0]) {
            return
        } 
        // if (this.currentRange.length === 2 && date >= this.currentRange[0]) {
        //     return
        // }

        if (this.previousRange.length === 0) {
          this.$set(this.previousRange, 0, date)
        }
        this.$set(this.previousRange, 1, date)

      }
    }
  },
  methods: {
    compareAutoSelect () {
      if (this.compareSelected) { //If not Custom
        if (this.currentRange.length !== 2) {
          this.previousRange = []
          return
        }
        const currentStart = DateTime.fromMillis(this.currentRange[0])
        const currentEnd = DateTime.fromMillis(this.currentRange[1])
        const difference = this.compareSelected
        const duration = Interval.fromDateTimes(currentStart, currentEnd).toDuration()
        let startDate = currentStart.minus(Duration.fromISO(difference)).minus(duration)
        let endDate = startDate.plus(duration)
        this.previousRange = [startDate.ts, endDate.ts]
      }
    },
    dateRangeSelected (val) {
      this.dateRangeDropDownValue = val
    },
    setCurrentRange (val) {
      this.currentRange = val
    },
    setPreviousRange (val) {
      this.previousRange = val
    },
    currentRangeSelecting (val) {
      this.dateRangeSelected(0)
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
      this.$emit("compareChecked", val)
    },
    changeCompareSelected (val) {
      this.compareSelected = val
    },
    saveChanges () {
      if (this.currentRange.length === 2 && this.previousRange.length === 2) {
        this.$emit('currentRange', this.currentRange)
        this.$emit('previousRange', this.previousRange)
        this.closePopup()
      }
    },
    closePopup () {
      this.$emit('closePopup')
    },
    cancelChanges () {
      this.closePopup()
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
    font-size: 13px;
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
        font-size: 13px;
        width: 5%;
        color: #303133;
      }
    }
    .gap {
      margin-top: 20px;
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


