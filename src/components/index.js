import SDateRangePicker from './SDateRangePicker/'
const SDateRangePickerPlugin = {
    install(Vue, opts){  
        
        Vue.mixin({
            mounted () {
                console.log("Mounted");
            }
        })

        // Vue.component(DateRangePicker.name, DateRangePicker)
        Vue.customElement('s-date-range-picker', SDateRangePicker)

    }
}

export default SDateRangePickerPlugin;