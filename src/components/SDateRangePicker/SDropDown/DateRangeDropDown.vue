<template>
    <div>
        <span>
            Date Range : 
        </span>
        <el-select 
            v-model="dateRangeSelected" 
            placeholder="Select"
            size="mini"
        >
            <el-option
            v-for="item in dateRangeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>
<script>
const { Interval, DateTime } = require('luxon');
export default {
    props: ["dateRange"],
    data () {
        return {
            dateRangeSelected: this.dateRange,
            dateRangeOptions: [
                {
                value: 0,
                label: 'Custom',
                },{
                value: "P0D-P0D",  //luxon.DateTime.local().minus(luxon.Duration.fromISO("P1D")).toISODate();
                label: 'Today',
                },{
                value: "P1D-P0D",
                label: 'Yesterday',
                },{
                value: "P1W-P1W-week",
                label: 'Last Week',
                },{
                value: "P1M-P30D-month", //we can add end of
                label: 'Last Month',
                },{
                value: "P8D-P7D",
                label: 'Last 7 Days',
                },{
                value: "P30D-P30D",
                label: 'Last 30 Days',
                }
            ],
        }
    },
    watch: {
        dateRange (val) {
            this.dateRangeSelected = val
        },
        dateRangeSelected (val) {
            this.$emit('dateRangeSelected', val)
        }
    }
}
</script>

