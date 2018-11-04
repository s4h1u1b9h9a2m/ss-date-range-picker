<template>
    <div>
        <span>
            <el-checkbox v-model="checked"></el-checkbox>
        </span>
        <span>
            Compare To : 
        </span>
        <el-select 
            v-model="dateRange" 
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
export default {
    data () {
        return {
            checked: true,
            dateRange: null,
            dateRangeOptions: [
                {
                value: 0,
                label: 'Custom',
                },{
                value: 1,
                label: 'Today',
                },{
                value: 2,
                label: 'Yesterday',
                },{
                value: 3,
                label: 'Last Week',
                },{
                value: 4,
                label: 'Last Month',
                },{
                value: 5,
                label: 'Last 7 Days',
                },{
                value: 6,
                label: 'Last 30 Days',
                }
            ],
        }
    }
}
</script>

