<template>
    <div class="calender-container">
        <div class="calenders">
            <calender
                v-for="calenderIndex in calenders" 
                :key="calenderIndex"
                :isFirstCalender="isFirstCalender(calenderIndex)"
                :isLastCalender="isLastCalender(calenderIndex)"
                :calenderMonth="getCalenderMonth(calenderIndex)"
                :startDay="getCalenderStartDay(calenderIndex)"
                :currentRange="currentRange"
                :previousRange="previousRange"
                :isCurrentRangeSelecting="isCurrentRangeSelecting"
                :isPreviousRangeSelecting="isPreviousRangeSelecting"
                :hoverDate="hoverDate"
                :isCompareEnabled="isCompareEnabled"
                @shiftOnePreviousMonth="shiftOnePreviousMonth"
                @shiftOneNextMonth="shiftOneNextMonth"
                @selectDate="selectDate"
                @temporarySelectDate="temporarySelectDate"
            />
        </div>
    </div>
</template>
<script>
const { Info, DateTime } = require('luxon');
import { getUTCDate } from '../../utils';
import Calender from './Calender';
export default {
    name: "SCalender",
    components: {
        Calender
    },
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
        },
        isCompareCustomSelected: {
            type: Boolean,
            default: false
        }, 
    },
    data () {
        return {
            calenders: 2,
            today: DateTime.local(DateTime.local().year, DateTime.local().month, DateTime.local().day),
            isCurrentRangeSelecting: false,
            isPreviousRangeSelecting: false,
            monthShift : 0,
            hoverDate: null,
            isCurrentRangeSelectedPreviously: false
        }
    },
    watch: {
        isCompareEnabled (val) {
            // if (!val) {
            //     this.$emit('previousRange', [])
            // }
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
        getShift (index) {
            return this.calenders - index - this.monthShift
        },
        getCalenderMonth (calenderIndex) {
            const shift = this.getShift(calenderIndex);
            return this.today.minus({month: shift})
        },
        getCalenderStartDay (calenderIndex) {
            const shift = this.getShift(calenderIndex);
            const date = this.today.minus({month: shift}); //Month Date
            const firstDay = date.startOf("month"); // First Day of Month
            const startDay = firstDay.minus({day: firstDay.weekday - 1});
            return startDay;
        },
        getCalenderDates(calenderIndex) {
            const shift = this.getShift(calenderIndex);
            const date = this.today.plus({month: shift}); //Month Date
            const firstDay = date.startOf("month"); // First Day of Month
            let startDay = firstDay.minus({day: firstDay.weekday - 1});

            let result = []
            for (let i  = 0; i < 6; ++i) {
                let row = []
                for (let k = 0; k < 7; ++k) {
                    let data = {
                        label: startDay.day.toString(),
                        value: startDay.ts,
                        month: date.month // Current Month
                    }
                    row.push(data)
                    startDay = startDay.plus({day: 1});
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
            this.manageSelection()
            if (this.isOutOfRange(date.ts))
                return
            if (this.isCurrentRangeSelecting) {
                let current = this.currentRange
                if (!this.current || this.current.length >= 2) {
                    this.current = []
                    this.$emit('currentRangeSelecting', 2)
                }
                this.current.push(date.ts)
                if (this.current.length === 2) {
                    this.hoverDate = null
                    this.isCurrentRangeSelecting = false
                    if (this.isCompareEnabled) {
                        this.$emit('previousRangeSelecting', 1)
                    }
                }
                this.$emit('currentRange', this.current)
            } else if (this.isPreviousRangeSelecting) {
                let previous = this.previousRange
                if (!this.previous || this.previous.length >= 2) {
                    this.previous = []
                    this.$emit('previousRangeSelecting', 2)
                }
                this.previous.push(date.ts)
                if (this.previous.length === 2) {
                    this.hoverDate = null
                    this.isPreviousRangeSelecting = false
                    this.$emit('currentRangeSelecting', 1)
                }
                this.$emit('previousRange', this.previous)
            }
        },
        isOutOfRange (selectedDate) {
            let today = getUTCDate(new Date())

            if (selectedDate > today)
                return true
            if (this.isCurrentRangeSelecting){
                if (this.currentRange.length === 1 && selectedDate < this.currentRange[0]) {
                    return true
                } 
                // if (this.previousRange.length === 2 && selectedDate <= this.previousRange[1]) {
                //     return true
                // }
            }

            if (this.isPreviousRangeSelecting){
                if (this.previousRange.length === 1 && selectedDate < this.previousRange[0]) {
                    return true
                } 
                // if (this.currentRange.length === 2 && selectedDate >= this.currentRange[0]) {
                //     return true
                // }
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
                this.isCurrentRangeSelecting = this.isCompareEnabled && this.isCompareCustomSelected ? !this.isCurrentRangeSelectedPreviously: true
                this.isPreviousRangeSelecting = this.isCompareEnabled && this.isCompareCustomSelected && this.isCurrentRangeSelectedPreviously
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
                this.hoverDate = date
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

            if (this.previousRange.length >= 1  && startDayUTC >= this.previousRange[0]) {
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
        }
    }
</style>


