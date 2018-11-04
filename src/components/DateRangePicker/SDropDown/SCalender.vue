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
import { getUTCDate } from '../../utils'
export default {
    props: {
        pCurrentRange: [], 
        pPreviousRange: [], 
        isCompareEnabled: false
    },
    data () {
        return {
            weekNameInShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            calenders: 2,
            visibleDate: Date.now(),
            currentRange: [],
            previousRange: [],
            isCurrentRangeSelecting: false,
            isPreviousRangeSelecting: false,
            monthShift : 0,
            hoverDate: null,
            isCurrentRangeSelectedPreviously: false
        }
    },
    watch: {
        pCurrentRange (val) {
            this.currentRange = val
        },
        pPreviousRange (val) {
            this.previousRange = val
        },
        isCompareEnabled (val) {
            if (!val) {
                this.previousRange = []
            }
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
            let selectedDate = getUTCDate(date)
            this.manageSelection()
            if (this.isOutofRange(selectedDate))
                return
            if (this.isCurrentRangeSelecting) {
                if (!this.currentRange || this.currentRange.length >= 2) {
                    this.currentRange = []
                    this.$emit('currentRangeSelecting', 2)
                }
                this.currentRange.push(selectedDate)
                if (this.currentRange.length === 2) {
                    this.hoverDate = null
                    this.isCurrentRangeSelecting = false
                    if (this.isCompareEnabled) {
                        this.$emit('previousRangeSelecting', 1)
                    }
                }
                this.$emit('currentRange', this.currentRange)
            } else if (this.isPreviousRangeSelecting) {
                if (!this.previousRange || this.previousRange.length >= 2) {
                    this.previousRange = []
                    this.$emit('previousRangeSelecting', 2)
                }
                this.previousRange.push(selectedDate)
                if (this.previousRange.length === 2) {
                    this.hoverDate = null
                    this.isPreviousRangeSelecting = false
                    this.$emit('currentRangeSelecting', 1)
                }
                this.$emit('previousRange', this.currentRange)
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
                this.isCurrentRangeSelecting = this.isCompareEnabled ? !this.isCurrentRangeSelectedPreviously: true
                this.isPreviousRangeSelecting = this.isCompareEnabled && this.isCurrentRangeSelectedPreviously
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
            return start < date && date <= end
        },
        getClasses (date, month) {

            const today = new Date()
            const todayUTC = getUTCDate(today)
            const todayLocalString = today.toLocaleDateString('sv-SE')
            const startDay = new Date(date)
            const startDayUTC = getUTCDate(startDay)
            const startDayLocalString = startDay.toLocaleDateString('sv-SE')

            let data = {}

            let isInCurrentRange = false
            if (this.currentRange.length >= 1 && startDayUTC >= this.currentRange[0]) {
                isInCurrentRange = true
                const d1 = getUTCDate(this.currentRange[0])
                let d2 = null
                if (this.currentRange.length === 2) {
                    d2 = getUTCDate(this.currentRange[1])
                } 
                // else if (this.currentRange.length === 1 && this.isCurrentRangeSelecting) {
                //     data['inCurrentRange'] = this.isInRange(this.currentRange[0], this.hoverDate, startDayUTC)
                // }
                const isd1Equal = d1 === startDayUTC
                if (d1 === d2 && isd1Equal) {
                    data['isStartDate'] = true
                    data['isEndDate'] = true
                    data['isCurrentRange'] = true
                } else if (isd1Equal) {
                    data['isStartDate'] = true
                    data['isCurrentRange'] = true
                } else if (d2) {
                    const isd2Equal = d2 === startDayUTC
                    if (isd2Equal) {
                        data['isEndDate'] = true
                        data['isCurrentRange'] = true
                    } else if (d1 <= startDayUTC && d2 >= startDayUTC) {
                        data['isCurrentRange'] = true
                    }
                }
            } 

            if (this.previousRange.length >= 1  && startDayUTC >= this.previousRange[0] && !isInCurrentRange) {
                const d1 = getUTCDate(this.previousRange[0])
                let d2 = null
                if (this.previousRange.length === 2) {
                    d2 = getUTCDate(this.previousRange[1])
                } 
                // else if (this.previousRange.length === 1 && this.isPreviousRangeSelecting) {
                //     data['inPreviousRange'] = this.isInRange(this.previousRange[0], this.hoverDate, startDayUTC)
                // }
                const isd1Equal = d1 === startDayUTC
                if (d1 === d2 && isd1Equal) {
                    data['isStartDate'] = true
                    data['isEndDate'] = true
                    data['isPreviousRange'] = true
                } else if (isd1Equal) {
                    data['isStartDate'] = true
                    data['isPreviousRange'] = true
                } else if (d2) {
                    const isd2Equal = d2 === startDayUTC
                    if (isd2Equal) {
                        data['isEndDate'] = true
                        data['isPreviousRange'] = true
                    } else if (d1 <= startDayUTC && d2 >= startDayUTC) {
                        data['isPreviousRange'] = true
                    }
                }
            }

            return ({
                today: startDayLocalString === todayLocalString,
                currentMonth: startDay.getMonth() === month,
                currentRange: data.isCurrentRange, // Represent current date range
                previousRange: data.isPreviousRange, // Represent previous date range
                startDate: data.isStartDate, // Start of any specific date range
                endDate: data.isEndDate, // End of any specific range
                // inCurrentRange: data.inCurrentRange, // To Show Date in hover state
                // inPreviousRange: data.inPreviousRange,
                isHidden: startDay.getMonth() !== month,
                isDisabled: startDayUTC > todayUTC
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
                    background: white;
                    color: #999;
                }

                .isDisabled {
                    cursor: not-allowed;
                    color: #999;
                }
            }
        }
    }
</style>


