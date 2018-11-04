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
            :disabled="!checked"
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
    data () {
        return {
            checked: false,
            compare: 1,
            compareOptions: [
                {
                    value: 0,
                    label: 'Custom',
                },{
                    value: 1,
                    label: 'Previous Period',
                },{
                    value: 2,
                    label: 'Previous Year',
                }
            ],
        }
    },
    watch: {
        checked (val) {
            this.$emit("compareCheck", val)
        },
        compare (val) {
            this.$emit("compareSelected", val)
        }
    }
}
</script>

