<template>
    <div class="calender-container">
        <div class="calenders">
            <table class="calender" v-for="calenderIndex in calenders" :key="calenderIndex">
                <thead class="header">
                    <tr class="header--top">
                        <th class="previous" 
                            @click="shiftOnePreviousMonth()"
                            v-if="isFirstCalender(calenderIndex)"
                        >
                            <font-awesome-icon 
                                class="s-icon" 
                                icon="chevron-left"
                            />
                        </th>
                        <th v-else></th>
                        <th colspan="5" class="month">{{getCalenderMonth(calenderIndex - 1)}}</th>
                        <th class="next" 
                            @click="shiftOneNextMonth()"
                            v-if="isLastCalender(calenderIndex)"
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
                    <tr v-for="(dates, cIndex) in getCalenderDates(calenderIndex - 1)" :key="cIndex">
                        <td v-for="(date, rIndex) in dates" :key="rIndex"
                            @click="selectDate(date.value)"
                            @mouseover="temporarySelectDate(date.value)"
                            :class="getClasses(date.value, date.month)"
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
            isPreviousRangeSelecting: false,
            monthShift : 0,
            hoverDate: null,
            isCurrentRangeSelectedPreviously: false
        }
    },
    computed: {
        isSelecting () {
            return this.isCurrentRangeSelecting || this.isPreviousRangeSelecting
        }
    },
    methods: {
        isFirstCalender (index) {
            return index == 1
        },
        isLastCalender (index) {
            return index == this.calenders
        },
        getCalenderMonth(calenderIndex) {
            const date = new Date(this.visibleDate);

            date.setMonth(date.getMonth() - this.calenders + calenderIndex + 1);
            if (this.monthShift) {
                date.setMonth(date.getMonth() + this.monthShift);
            }
            return date.toLocaleDateString('en-US', {'year': 'numeric', month: 'short'})
        },
        getCalenderDates(calenderIndex) {
            // console.log('called');
            
            const today = new Date();
            const date = new Date(this.visibleDate);

            date.setMonth(date.getMonth() - this.calenders + calenderIndex + 1);

            if (this.monthShift) {
                date.setMonth(date.getMonth() + this.monthShift);
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
                        month: date.getMonth(),
                        // isToday: startDay.toLocaleDateString() === today.toLocaleDateString(),
                        // isHidden: startDay.getMonth() !== date.getMonth(),
                        // isDisabled: startDay > today
                    }
                    /*
                    if (this.currentRange.length >= 1) {
                        const d1 = new Date(this.currentRange[0])
                        let d2 = null
                        if (this.currentRange.length === 2) {
                            d2 = new Date(this.currentRange[1])
                        } else if (this.currentRange.length === 1 && this.isCurrentRangeSelecting) {
                            data['inCurrentRange'] = this.isInRange(this.currentRange[0], this.hoverDate, startDay.getTime())
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
                        } else if (this.previousRange.length === 1 && this.isPreviousRangeSelecting) {
                            data['inPreviousRange'] = this.isInRange(this.previousRange[0], this.hoverDate, startDay.getTime())
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
                    */
                    row.push(data)
                    startDay.setTime(Date.parse(firstDay.toLocaleDateString('sv-SE')) + (1*24*3600*1000));
                }
                result.push(row)
            }

            return result;
        },
        shiftOnePreviousMonth () {
            this.monthShift += -1
        },
        shiftOneNextMonth () {
            this.monthShift += 1
        },
        selectDate(date) {
            let selectedDate = this.getUTCDate(date)
            this.manageSelection()
            if (this.isOutofRange(selectedDate))
                return
            // this.log()
            if (this.isCurrentRangeSelecting) {
                if (!this.currentRange || this.currentRange.length >= 2) {
                    this.currentRange = []
                }
                this.currentRange.push(selectedDate)
                if (this.currentRange.length === 2) {
                    this.hoverDate = null
                    this.isCurrentRangeSelecting = false
                }
            } else if (this.isPreviousRangeSelecting) {
                if (!this.previousRange || this.previousRange.length >= 2) {
                    this.previousRange = []
                }
                this.previousRange.push(selectedDate)
                if (this.previousRange.length === 2) {
                    this.hoverDate = null
                    this.isPreviousRangeSelecting = false
                }
            }
        },
        isOutofRange (selectedDate) {
            let today = new Date().getTime()

            if (selectedDate > today)
                return true
            if (this.isCurrentRangeSelecting){
                if (this.currentRange.length === 1 && selectedDate < this.currentRange[0]) {
                    return true
                } 
                if (this.previousRange.length === 2 && selectedDate <= this.previousRange[1]) {
                    return true
                }
            }

            if (this.isPreviousRangeSelecting){
                if (this.previousRange.length === 1 && selectedDate < this.previousRange[0]) {
                    return true
                } 
                if (this.currentRange.length === 2 && selectedDate >= this.currentRange[0]) {
                    return true
                }
            }
            return false
        },
        manageSelection () {
            /**
             * Here we're checking the state of datepicker.
             * If Date picker is not in selection mode, than on click event we'll start selection mode.
             * Selection mode will choose current or previous date selection based on which category user already selected.
             * For initiial, we'll set current selection mode on and keeping a state that current selection mode is choosen.
             * Later if current select mode was chosen before we'll choose previsous selection mode.
             */
            if (!this.isSelecting) {
                this.isCurrentRangeSelecting = !this.isCurrentRangeSelectedPreviously
                this.isPreviousRangeSelecting = this.isCurrentRangeSelectedPreviously
                this.isCurrentRangeSelectedPreviously = !this.isCurrentRangeSelectedPreviously
            }
        },
        resetSelection () {
            this.hoverDate = null
            this.isCurrentRangeSelecting = false
            this.isCurrentRangeSelectedPreviously = false
            this.isPreviousRangeSelecting = false
            this.currentRange = [],
            this.previousRange = []
        },
        temporarySelectDate(date) {
            if (this.isSelecting) {
                this.hoverDate = new Date(date).getTime()
            }
        },
        isInRange (start, end, date) {
            return start < date && date < end
        },
        getUTCDate(date) {
            let selectedDate = new Date(date)
            selectedDate = selectedDate.getTime() + selectedDate.getTimezoneOffset()
            return selectedDate
        },
        getClasses (date, month) {

            // :class="{currentMonth: date.isCurrentMonth, 
            // today: date.isToday, // Represent today
            // currentRange: date.isCurrentRange, // Represent current date range
            // previousRange: date.isPreviousRange, // Represent previous date range
            // startDate: date.isStartDate, // Start of any specific date range
            // endDate: date.isEndDate, // End of any specific range
            // inCurrentRange: date.inCurrentRange, // To Show Date in hover state
            // inPreviousRange: date.inPreviousRange,
            // isDisabled: date.isDisabled, //To Disable Date Selection
            // isHidden: date.isHidden
            // }"

            let today = new Date()
            let startDay = new Date(date)

            let data = {}

            if (this.currentRange.length >= 1) {
                const d1 = new Date(this.currentRange[0])
                let d2 = null
                if (this.currentRange.length === 2) {
                    d2 = new Date(this.currentRange[1])
                } else if (this.currentRange.length === 1 && this.isCurrentRangeSelecting) {
                    data['inCurrentRange'] = this.isInRange(this.currentRange[0], this.hoverDate, startDay.getTime())
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
                } else if (this.previousRange.length === 1 && this.isPreviousRangeSelecting) {
                    data['inPreviousRange'] = this.isInRange(this.previousRange[0], this.hoverDate, startDay.getTime())
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

            return ({
                today: startDay.toLocaleDateString() === today.toLocaleDateString(),
                currentMonth: startDay.getMonth() === month,
                currentRange: data.isCurrentRange, // Represent current date range
                previousRange: data.isPreviousRange, // Represent previous date range
                startDate: data.isStartDate, // Start of any specific date range
                endDate: data.isEndDate, // End of any specific range
                // inCurrentRange: data.inCurrentRange, // To Show Date in hover state
                // inPreviousRange: data.inPreviousRange,
                isHidden: startDay.getMonth() !== month,
                isDisabled: startDay > today
            })
        },
        log () {
            
            console.log('currentRange', this.currentRange);
            console.log('previousRange', this.previousRange);
            console.log('isCurrentRangeSelecting', this.isCurrentRangeSelecting);
            console.log('isPreviousRangeSelecting', this.isPreviousRangeSelecting);
            console.log('monthShift', this.monthShift);
            console.log('hoverDate', this.hoverDate);
            console.log('isCurrentRangeSelectedPreviously', this.isCurrentRangeSelectedPreviously);
            
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

                .isHidden {
                    // visibility: hidden;
                }

                .isDisabled {
                    cursor: not-allowed;
                    color: #999;
                }
            }
        }
    }
</style>


