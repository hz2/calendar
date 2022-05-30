<template>
    <div class="calendar">
        {{ current }}
        <button @click="prev">Prev</button>
        <button @click="next">Next</button>
        <div class="header">
            <div class="text" v-for="(x,i) in header" :key="i">{{ x }}</div>
        </div>
        <div class="calendar-list">
            <div
                class="day"
                :class="[x.type, x.today ? 'today' : '', (x.w === 6 || x.w === 0) ? 'weekend' : '']"
                v-for="(x,i) in calendarList"
                :key="i"
            >{{ x.mm + '-' + x.dd }}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
interface calendarItem {
    date?: Date
    str: string
    y?: number
    m?: number
    d?: number
    mm: string
    dd: string
    w?: number
    type?: 'prev' | 'next'
    today?: boolean
}
type WeekStart = 'Mon' | 'Sun'
const calendarList = ref<calendarItem[]>([])
const header = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
const genCalendarList = (y: number, m: number, start: WeekStart = 'Mon') => {
    const firstDay = new Date(y, m - 1, 1)
    const lastDay = new Date(y, m, 0)
    const firstDayOfNext = new Date(y, m, 1)

    const monthLen = lastDay.getDate();
    const genItem = (date: Date, type?: 'prev' | 'next'): calendarItem => {
        const y = date.getFullYear()
        const m = date.getMonth() + 1
        const d = date.getDate()
        const w = date.getDay()
        const mm = String(m).padStart(2, '0')
        const dd = String(d).padStart(2, '0')
        const str = `${y}-${mm}-${dd}`
        return {
            date: date,
            str, y, m, d, mm, dd, w, type,
            today: date.toLocaleDateString('en') === new Date().toLocaleDateString('en')
        }
    }
    const monthList = Array.from({ length: monthLen }, (_x, i) => genItem(new Date(y, m - 1, i + 1)))

    let index = firstDay.getDay()
    let nextIndex = firstDayOfNext.getDay()
    let prevCount = ref(0)
    let nextCount = ref(0)
    if (start === 'Mon') {
        prevCount.value = (index === 0 ? 7 : index) - 1;
        nextCount.value = 7 - (nextIndex === 0 ? 7 : nextIndex) + 1;
    }

    const monthPrev = Array.from({ length: prevCount.value }, (_x, i) => genItem(new Date(y, m - 1, i - prevCount.value + 1), 'prev'));

    const monthNext = Array.from({ length: nextCount.value }, (_x, i) => genItem(new Date(y, m, i + 1), 'next'));

    calendarList.value = [...monthPrev, ...monthList, ...monthNext]


}

const current = ref([new Date().getFullYear(), new Date().getMonth() + 1])
const [y, m] = current.value
genCalendarList(y, m)
const next = () => {
    let [y, m] = current.value
    m += 1
    if (m > 12) {
        m = 1
        y += 1
    }
    current.value = [y, m]
    genCalendarList(y, m)
}
const prev = () => {
    let [y, m] = current.value
    m -= 1
    if (m < 1) {
        m = 12
        y -= 1
    }
    current.value = [y, m]
    genCalendarList(y, m)
}
</script>

<style scoped lang="less">
.calendar-list {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 10px;
    text-align: center;
    .day {
        padding: 20px;
        background-color: rgb(247, 247, 238);
        &.today {
            color: #fff;
            background-color: chocolate;
        }
        &.weekend {
            color: orange;
        }
        &.prev,
        &.next {
            color: #ccc;
            background-color: #f5f5f5;
        }
    }
}
.header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
    text-align: center;
    margin-bottom: 10px;
}
.header .text {
    padding: 20px;
    background-color: rgb(117, 189, 218);
}
</style>