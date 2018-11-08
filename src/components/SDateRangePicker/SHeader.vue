<template>
  <span class="s-header">
    <div class="s-content">
      <div class="s-subheader__label">
        <span class="s-subheader__label_current">
          <span class="s-subheader__value1">{{current1}} </span>
          <span class="s-separator"> - </span>
          <span class="s-subheader__value2">{{current2}}</span>
        </span>
        <span class="s-subheader__label_previous" v-if="isCompareEnabled">
          <span class="s-comapre__label"> Compare to: </span>
          <span class="s-subheader__value1">{{previous1}} </span>
          <span class="s-separator"> - </span>
          <span class="s-subheader__value2">{{previous2}}</span>
        </span>
      </div>
      <a href="#" class="s-btn">
        <font-awesome-icon class="s-icon" icon="chevron-down"/>
      </a>
    </div>
  </span>
</template>
<script>
import { getLocaleDateStringDateMed } from './utils'
export default {
  name: "SHeader",
  props: {
    currentRange: {
      type: Array,
      default: () => []
    },
    previousRange: {
      type: Array,
      default: () => []
    },
    isCompareEnabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    current1 () {
      if (this.currentRange[0]) {
        return getLocaleDateStringDateMed(this.currentRange[0])
      }
    },
    current2 () {
      if (this.currentRange[1]) {
        return getLocaleDateStringDateMed(this.currentRange[1])
      }
    },
    previous1 () {
      if (this.previousRange[0]) {
        return getLocaleDateStringDateMed(this.previousRange[0])
      }
    },
    previous2 () {
      if (this.previousRange[1]) {
        return getLocaleDateStringDateMed(this.previousRange[1])
      }
    }
  },
  methods: {

  }
}
</script>
<style lang="less"  scoped>
  .s-header {
    position: relative;
    display: inline-block;
    border-radius: 3px;
    padding: 5px;
    cursor: pointer;
    background: #fff;
    border: 1px solid #d2d2d2;

    .s-content {
      display: flex;
      flex-direction: row;
      padding-left: 5px;

      .s-subheader__label {
        display: flex;
        flex-direction: column;
        text-align: left;
        margin: auto;
        width: 226px; //Fixed Width

        .s-subheader__label_current {
          // padding: 0.7rem 0.75rem 0.7rem 1.5rem;
          font-weight: 600;
          user-select: none;

          .s-subheader__title {
            display: inline-block;
            font-weight: 500;
            color: #aaaeb8;
          }
          .s-subheader__value {
            display: inline-block;
            font-weight: 600;
            color: #22b9ff;
          }
        }
        .s-subheader__label_previous {
          font-size: 12px;
          // margin-top: 2px;
          span.s-comapre__label {
            color: gray;
          }
        }
      }

      .s-btn {
        width: 30px;
        height: 30px;
        color: #4d4d4d;
        display: inline-block;
        position: relative;
        padding: 0 !important;
        font-weight: 400;
        border-radius: 60px;
        box-shadow: none !important;
        background-color: #fff;
        border-color: #fff;
        line-height: 1.5;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;
        border: 0px;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
          border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
          -webkit-box-shadow 0.15s ease-in-out;
        text-decoration: none;
        margin-left: 10px;

        .s-icon {
          font-size: 14px;
          line-height: 0;
          display: inline-block;
          position: absolute;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%);
          vertical-align: middle;
        }
      }
      .s-btn:not(:disabled):not(.disabled) {
        cursor: pointer;
      }

    }
  }
</style>


