<template>
    <table class="calender">
        <thead class="header">
            <tr class="header--top">
                <th class="previous" 
                    @click="shiftOnePreviousMonth()"
                    v-if="isFirstCalender"
                >
                    <font-awesome-icon 
                        class="s-icon" 
                        icon="chevron-left"
                    />
                </th>
                <th v-else></th>
                <th colspan="5" class="month">{{monthName}}</th>
                <th class="next" 
                    @click="shiftOneNextMonth()"
                    v-if="isLastCalender"
                >
                    <font-awesome-icon 
                        class="s-icon" 
                        icon="chevron-right"
                    />
                </th>
                <th v-else></th>
            </tr>
            <tr class="header--bottom">
                <th v-for="(val, index) in weekNameInShort" :key="index">
                    {{val}}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(week) in maxWeeksInMonth" :key="week">
                <td 
                    v-for="(dayInWeek) in daysInWeek" 
                    :key="dayInWeek"
                    :class="getClasses(week - 1, dayInWeek - 1)"
                    @click="selectDate(week - 1, dayInWeek - 1)"
                    @mouseover="temporarySelectDate(week - 1, dayInWeek - 1)"
                >
                    <!-- @click="selectDate(date.value)" -->
                    <!-- @mouseover="temporarySelectDate(date.value)" -->
                    {{getDay(week - 1, dayInWeek - 1)}}
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script>
const { Info, DateTime } = require('luxon');
export default {
    props: {
        isFirstCalender: {
            type: Boolean,
            default: false
        },
        isLastCalender: {
            type: Boolean,
            default: false
        },
        calenderMonth: {
            type: Object
        },
        startDay: {
            type: Object
        },
        currentRange: {
            type: Array,
            default: () => []
        },
        previousRange: {
            type: Array,
            default: () => []
        },
        isCurrentRangeSelecting: {
            type: Boolean,
            default: false
        },
        isPreviousRangeSelecting: {
            type: Boolean,
            default: false
        },
        hoverDate: {
            type: Object,
            default: () => {}
        },
        isCompareEnabled: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            daysInWeek: 7,
            maxWeeksInMonth: 6,
            weekNameInShort: Info.weekdays("short") // ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        }
    },
    computed: {
        monthName () {
            return this.calenderMonth.toLocaleString({'year': 'numeric', month: 'short'})
        }
    },
    methods: {
        getDate (week, dayInWeek) {
            return this.startDay.plus({week:week, day: dayInWeek })
        },
        getDay (week, dayInWeek) {
            return this.getDate(week, dayInWeek).day
        },
        getClasses (week, dayInWeek) {
            const date = this.getDate(week, dayInWeek)

            let today = DateTime.local()
            today = DateTime.local(today.year, today.month, today.day)

            let data = {}
            if (this.currentRange.length >= 1 && date.ts >= this.currentRange[0]) {
                const d1 = this.currentRange[0]
                let d2 = null
                if (this.currentRange.length === 2) {
                    d2 = this.currentRange[1]
                } 
                else if (this.currentRange.length === 1 && this.isCurrentRangeSelecting && this.hoverDate) {
                    data['inCurrentRange'] = this.isInRange(this.currentRange[0], this.hoverDate.ts, date.ts)
                }
                const isd1Equal = d1 === date.ts

                if (d1 === d2 && isd1Equal) {
                    data['isStartDate'] = true
                    data['isEndDate'] = true
                    data['isCurrentRange'] = true
                } else if (isd1Equal) {
                    data['isStartDate'] = true
                    data['isCurrentRange'] = true
                } else if (d2) {
                    const isd2Equal = d2 === date.ts
                    if (isd2Equal) {
                        data['isEndDate'] = true
                        data['isCurrentRange'] = true
                    } else if (d1 <= date.ts && d2 >= date.ts) {
                        data['isCurrentRange'] = true
                    }
                }
            }

            if (this.previousRange.length >= 1  && date.ts >= this.previousRange[0] && this.isCompareEnabled) {
                const d1 = this.previousRange[0]
                let d2 = null
                if (this.previousRange.length === 2) {
                    d2 = this.previousRange[1]
                }
                else if (this.previousRange.length === 1 && this.isPreviousRangeSelecting && this.hoverDate) {
                    data['inPreviousRange'] = this.isInRange(this.previousRange[0], this.hoverDate.ts, date.ts)
                }
                const isd1Equal = d1 === date.ts
                if (d1 === d2 && isd1Equal) {
                    data['isStartDate'] = true
                    data['isEndDate'] = true
                    data['isPreviousRange'] = true
                } else if (isd1Equal) {
                    data['isStartDate'] = true
                    data['isPreviousRange'] = true
                } else if (d2) {
                    const isd2Equal = d2 === date.ts
                    if (isd2Equal) {
                        data['isEndDate'] = true
                        data['isPreviousRange'] = true
                    } else if (d1 <= date.ts && d2 >= date.ts) {
                        data['isPreviousRange'] = true
                    }
                }
            }
            
            return ({
                today: today.ts === date.ts,
                currentMonth: date.month === this.calenderMonth.month,
                isHidden: date.month !== this.calenderMonth.month,
                isDisabled: date.ts > today.ts,
                currentRange: data.isCurrentRange, // Represent current date range
                previousRange: data.isPreviousRange, // Represent previous date range
                startDate: data.isStartDate, // Start of any specific date range
                endDate: data.isEndDate, // End of any specific range
                inCurrentRange: data.inCurrentRange,
                inPreviousRange: data.inPreviousRange
            })

        },
        shiftOnePreviousMonth () {
            this.$emit("shiftOnePreviousMonth")
        },
        shiftOneNextMonth () {
            this.$emit("shiftOneNextMonth")
        },
        isInRange (start, end, date) {
            return start < date && date <= end
        },
        selectDate (week, dayInWeek) {
            let date = this.getDate(week, dayInWeek)
            date = DateTime.local(date.year, date.month, date.day)
            this.$emit("selectDate", date)
        },
        temporarySelectDate (week, dayInWeek) {
            let date = this.getDate(week, dayInWeek)
            date = DateTime.local(date.year, date.month, date.day)
            this.$emit("temporarySelectDate", date)
        }
    }
}
</script>
<style lang="less" scoped>
    .calender {
        width: 100%;
        margin: 0;
        border-collapse: collapse;
        margin-right: 6px;

        th, td {
            white-space: nowrap;
            text-align: center;
            min-width: 32px;
            width: 35px;
            height: 35px;
            border-radius: 3px;
            border: 0;
            vertical-align: middle;
            line-height: 0;
            cursor: pointer;
        }

        td {
            color: #999;
        }

        td:hover {
            background: #ebedf2;
            border-color: transparent;
        }

        thead {
            th {
                font-weight: 500;
            }
        }

        .header {
            .previous {
                // font-size: 1.3rem;
            }
            .month {

            }
            .next {
                // font-size: 1.3rem;
            }
            .previous:hover {
                background: #ebedf2;
                border-color: transparent;
            }
            .month:hover {
                background: #ebedf2;
                border-color: transparent;
            }
            .next:hover {
                background: #ebedf2;
                border-color: transparent;
            }
        }

        .currentMonth {
            // color: #575962;
            color: #000;
        }

        .today {
            background: #828ee6;
            color: #fff;
            position: relative;
        }

        .today:before {
            border-bottom-color: #ffffff;
            border-top-color: rgba(0,0,0,0.2);
            content: '';
            display: inline-block;
            border: solid transparent;
            border-width: 0 0 7px 7px;
            border-bottom-color: #ffffff;
            border-top-color: rgba(0,0,0,0.2);
            position: absolute;
            bottom: 4px;
            right: 4px;
        }

        .today:hover {
            background: #404ba2;
        }

        .currentRange {
            background: #5867dd;
            color: #fff;
            border-radius: 0;
        }

        .currentRange:hover {
            background: #404ba2
        }

        .previousRange {
            background: #FF9800;
            color: #fff;
            border-radius: 0;
        }

        .previousRange:hover {
            background: #cf7b01
        }

        .startDate {
            border-radius: 4px 0 0 4px;
        }
        .endDate {
            border-radius: 0 4px 4px 0;
        }
        .startDate.endDate {
            border-radius: 4px;
        }

        .currentRange.previousRange {
            background: #673ab7;
            border-radius: 0;
        }
        .currentRange.previousRange:hover {
            background: #673ab7;
        }

        .currentRange.previousRange.startDate {
            border-radius: 4px 0 0 4px;
        }

        .currentRange.previousRange.endDate {
            border-radius: 0 4px 4px 0;
        }

        .startDate.endDate.currentRange.previousRange {
            border-radius: 4px;
        }

        
        .inCurrentRange {
            background: #5867ddcf;
            color: #fff;
            border-radius: 0;
        }
        .inPreviousRange {
            background: #cf7b01cf;
            color: #fff;
            border-radius: 0;
        }

        // .inCurrentRange.inPreviousRange {
        //     background: #673ab7cf;
        //     color: #fff;
        //     border-radius: 0;
        // }

        .isHidden {
            // visibility: hidden;
            background: white;
            color: #999;
        }

        .isDisabled {
            cursor: not-allowed;
            color: #999;
        }
    }
</style>
