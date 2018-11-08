<template>
    <div>
        <span>
            <el-checkbox v-model="checked"></el-checkbox>
        </span>
        <span>
            Compare To : 
        </span>
        <el-select 
            v-model="compare" 
            size="mini"
            :disabled="!compareChecked"
        >
            <el-option
            v-for="item in compareOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>
<script>
export default {
    props: ["compareChecked", "compareSelected"],
    data () {
        return {
            checked: this.compareChecked,
            compare: this.compareSelected,
            compareOptions: [
                {
                    value: 0,
                    label: 'Custom',
                },{
                    value: 'P1D',
                    label: 'Previous Period',
                },{
                    value: 'P1Y',
                    label: 'Previous Year',
                }
            ],
        }
    },
    watch: {
        compareSelected (val) {
            this.compareSelected = val
        },
        checked (val) {
            this.$emit("compareCheck", val)
        },
        compare (val) {
            this.$emit("compareSelected", val)
        }
    }
}
</script>

