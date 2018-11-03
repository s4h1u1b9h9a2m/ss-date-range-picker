<template>
    <div class="calender-container">
        <div class="calenders">
            <table class="calender" v-for="calenderIndex in calenders" :key="calenderIndex">
                <thead class="header">
                    <tr class="header--top">
                        <th class="previous">
                            <font-awesome-icon class="s-icon" icon="chevron-left"/>
                        </th>
                        <th colspan="5" class="month">{{getCalenderMonth(calenderIndex - 1)}}</th>
                        <th class="next">
                            <font-awesome-icon class="s-icon" icon="chevron-right"/>
                        </th>
                    </tr>
                    <tr class="header--bottom">
                        <th v-for="(val, index) in weekNameInShort" :key="index">
                            {{val}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(dates, cIndex) in getCalenderDates(calenderIndex - 1)" :key="cIndex">
                        <td v-for="(date, rIndex) in dates" :key="rIndex"
                            @click="selectDate(date.value)"
                            @mouseover="temporarySelectDate(date.value)"
                            :class="{currentMonth: date.isCurrentMonth, 
                                today: date.isToday, // Represent today
                                currentRange: date.isCurrentRange, // Represent current date range
                                previousRange: date.isPreviousRange, // Represent previous date range
                                startDate: date.isStartDate, // Start of any specific date range
                                endDate: date.isEndDate, // End of any specific range
                                inRange: date.inRange, // To Show Date in hover state
                                isDisabled: date.isDisabled //To Disable Date Selection
                                }"
                        >
                            {{date.label}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            weekNameInShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            // monthNameInShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            calenders: 2,
            visibleDate: Date.now(),
            currentRange: [1539734400000, 1540339200000],
            previousRange: [1538870400000, 1539302400000],
            isCurrentRangeSelecting: false,
            isPreviousRangeSelecting: false
        }
    },
    methods: {
        getCalenderMonth(calenderIndex) {
            const date = new Date(this.visibleDate);
            if (calenderIndex) {
                date.setMonth(date.getMonth() + calenderIndex);
            }
            return date.toLocaleDateString('en-US', {'year': 'numeric', month: 'short'})
        },
        getCalenderDates(calenderIndex) {
            const today = new Date();
            const date = new Date(this.visibleDate);
            if (calenderIndex) {
                date.setMonth(date.getMonth() + calenderIndex);
            }

            const firstDay = new Date(date.getFullYear() + '-' + (date.getMonth()+1) + '-01');

            let currDay = firstDay.getDay(); // 1 is monday
            let startDay = firstDay;

            if (firstDay.getDay() !== 0) {
                // Calculate days to Sunday
                const daysUntilMonday = (-currDay);
                // Find the first Monday to display
                startDay.setTime(Date.parse(firstDay.toLocaleDateString('sv-SE')) + (daysUntilMonday*24*3600*1000));
            }

            let result = []
            for (let i  = 0; i < 6; ++i) {
                let row = []
                for (let k = 0; k < 7; ++k) {
                    let data = {
                        label: startDay.getDate(),
                        value: startDay.toLocaleDateString('sv-SE'),
                        isCurrentMonth: startDay.getMonth() === date.getMonth(),
                        isToday: startDay.toLocaleDateString() === today.toLocaleDateString()
                    }

                    if (this.currentRange.length >= 1) {
                        const d1 = new Date(this.currentRange[0])
                        let d2 = null
                        if (this.currentRange.length === 2) {
                            d2 = new Date(this.currentRange[1])
                        }
                        if (d1 === d2 && d1.toLocaleDateString() === startDay.toLocaleDateString()) {
                            data['isStartDate'] = true
                            data['isEndDate'] = true
                            data['isCurrentRange'] = true
                        } else if (d1.toLocaleDateString() === startDay.toLocaleDateString()) {
                            data['isStartDate'] = true
                            data['isCurrentRange'] = true
                        } else if (d2) {
                            if (d2.toLocaleDateString() === startDay.toLocaleDateString()) {
                                data['isEndDate'] = true
                                data['isCurrentRange'] = true
                            } else if (d1.getTime() <= startDay.getTime() && d2.getTime() >= startDay.getTime()) {
                                data['isCurrentRange'] = true
                            }
                        }
                    } 
                    if (this.previousRange.length >= 1) {
                        const d1 = new Date(this.previousRange[0])
                        let d2 = null
                        if (this.previousRange.length === 2) {
                            d2 = new Date(this.previousRange[1])
                        }
                        if (d1 === d2 && d1.toLocaleDateString() === startDay.toLocaleDateString()) {
                            data['isStartDate'] = true
                            data['isEndDate'] = true
                            data['isPreviousRange'] = true
                        } else if (d1.toLocaleDateString() === startDay.toLocaleDateString()) {
                            data['isStartDate'] = true
                            data['isPreviousRange'] = true
                        } else if (d2) {
                            if (d2.toLocaleDateString() === startDay.toLocaleDateString()) {
                                data['isEndDate'] = true
                                data['isPreviousRange'] = true
                            } else if (d1.getTime() <= startDay.getTime() && d2.getTime() >= startDay.getTime()) {
                                data['isPreviousRange'] = true
                            }
                        }
                    }

                    row.push(data)
                    startDay.setTime(Date.parse(firstDay.toLocaleDateString('sv-SE')) + (1*24*3600*1000));
                }
                result.push(row)
            }

            return result;
        },
        selectDate(date) {

        },
        temporarySelectDate(date) {

        }
    }
}
</script>
<style lang="less" scoped>
    .calender-container {
        .calenders {
            // max-width: 270px;
            padding: 4px;
            display: flex;
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

                th:hover {
                    .previous {
                        background: #ebedf2;
                        border-color: transparent;
                    }
                    .next {
                        background: #ebedf2;
                        border-color: transparent;
                    }
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
                        font-size: 1.3rem;
                    }
                    .month {

                    }
                    .next {
                        font-size: 1.3rem;
                    }
                }

                .currentMonth {
                    color: #575962;
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
                // Overwrite not allowed
                // .currentRange.previousRange {
                //     background: #673ab7;
                //     border-radius: 0;
                // }

                // .currentRange.previousRange:hover {
                //     background: #673ab7;
                // }

                .inRange {
                    background: #ebedf2;
                }
            }
        }
    }
</style>


