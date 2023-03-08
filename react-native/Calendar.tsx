import { Image, ImageStyle, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import React, { ReactNode, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

interface Prop {
    onPress?: () => void
    children?: ReactNode
    boxSize?: [number] | number
    maxNum?: number
    style?: StyleProp<ImageStyle>
    containerStyle?: StyleProp<ViewStyle>
}
const Calendar = ({ onPress, children, style: userStyle, containerStyle, boxSize }: Prop) => {

    const { t } = useTranslation()

    const [height, width] = [64, 64]

    const style = [{
        height, width,
        margin: 10
    }, userStyle]


    type WeekStartsWith = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

    const headerList = [t("app.SUN"), t("app.MON"), t("app.TUE"), t("app.WED"), t("app.THU"), t("app.FRI"), t("app.SAT")]
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
    const [calendarList, setCalendarList] = useState<calendarItem[]>([])
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
        let prevCount = 0
        let nextCount = 0
        if (start === 'Mon') {
            prevCount = (index === 0 ? 7 : index) - 1;
            nextCount = 7 - (nextIndex === 0 ? 7 : nextIndex) + 1;
        }
        const monthPrev = Array.from({ length: prevCount }, (_x, i) => genItem(new Date(y, m - 1, i - prevCount + 1), 'prev'));
        const monthNext = Array.from({ length: nextCount }, (_x, i) => genItem(new Date(y, m, i + 1), 'next'));
        return [...monthPrev, ...monthList, ...monthNext]
    }
    const [y, m] = [new Date().getFullYear(), new Date().getMonth() + 1]

    useEffect(() => {
        setCalendarList(genCalendarList(y, m))
    }, [])

    // const next = () => {
    //     let [y, m] = current.value
    //     m += 1
    //     if (m > 12) {
    //         m = 1r
    //         y += 1
    //     }
    //     current.value = [y, m]
    //     genCalendarList(y, m)
    // }
    // const prev = () => {
    //     let [y, m] = current.value
    //     m -= 1
    //     if (m < 1) {
    //         m = 12
    //         y -= 1
    //     }
    //     current.value = [y, m]
    //     genCalendarList(y, m)
    // }

    return <View  >
        <View style={styles.header}>
            {headerList.map((x, i) => <Text style={styles.headerItem} key={i + "header"}>{x}</Text>)}
        </View>
        <View style={styles.body}>
            {
                calendarList.map((x, i) => <Text style={[
                    styles.bodyItem,
                    x.type ? { color: "#ccc" } : { color: "#333" },
                    (x.w === 6 || x.w === 0) ? { color: '#777' } : {}
                ]} key={i + "day"}>{x.d}</Text>)
            }
        </View>
    </View >
}
export default Calendar

const styles = StyleSheet.create({
    header: {
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "row",
        marginBottom: 10
    },
    headerItem: {
        width: "14.28%",
        textAlign: "center"
    },
    body: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    bodyItem: {
        width: "14.28%",
        textAlign: "center",
        marginVertical: 10
    }
})
