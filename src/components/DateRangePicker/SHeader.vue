<template>
  <span class="s-header" @click="toggle()">
    <span class="s-subheader__label">
      <span class="s-subheader__title">Today: </span>
      <span class="s-subheader__value">Oct 24</span>
    </span>
    <a href="#" class="s-btn">
      <font-awesome-icon class="s-icon" icon="angle-down"/>
    </a>
  </span>
</template>
<script>
export default {
  name: "SHeader",
  methods: {
    toggle () {
      this.$emit('toggle')
    }
  }
}
</script>
<style lang="less"  scoped>
  .s-header {
    position: relative;
    display: inline-block;
    border-radius: 2rem;
    padding: 5px;
    cursor: pointer;
    background: #fff;
    border: 1px solid #aaaeb8;

    .s-subheader__label {
      padding: 0.7rem 0.75rem 0.7rem 1.5rem;
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
    .s-btn {
      width: 30px;
      height: 30px;
      font-size: 0.9rem;
      color: #fff;
      display: inline-block;
      position: relative;
      padding: 0 !important;
      font-weight: 400;
      font-family: Poppins;
      border-radius: 60px;
      box-shadow: none !important;
      background-color: #22b9ff;
      border-color: #22b9ff;
      line-height: 1.5;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      user-select: none;
      border: 1px solid #22b9ff;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
        -webkit-box-shadow 0.15s ease-in-out;
      text-decoration: none;

      .s-icon {
        font-size: 0.8rem;
        line-height: 0;
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        vertical-align: middle;
      }
    }
    .s-btn:not(:disabled):not(.disabled) {
      cursor: pointer;
    }
  }
</style>


