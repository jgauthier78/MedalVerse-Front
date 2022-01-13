/* Traduction */
import { t } from "i18next";

const formatOptionsWithTZ = { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" }
const formatOptionsWithTZWithoutSeconds = { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }
const formatOptionsWithoutTZ = { hour: "2-digit", minute: "2-digit", second: "2-digit" }
const formatOptionsWithoutTZWithoutSeconds = { hour: "2-digit", minute: "2-digit" }

// const formatOptionsWithTZ = {hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short"}
// const formatOptionsWithoutTZ = {hour: "2-digit", minute: "2-digit", second: "2-digit"}

const format_TimeStampToStartDate = (timestampinSeconds, withTZ=false, withSeconds=false) => {
    return format_TimeStampToDate(timestampinSeconds, withTZ, withSeconds )
}
const format_TimeStampToEndDate = (timestampinSeconds, withTZ=false, withSeconds=false) => {
    return format_TimeStampToDate(timestampinSeconds, withTZ, withSeconds )
}

const format_TimeStampToDate = (timestampinSeconds, withTZ=false, withSeconds=false) => {
    const timestampInMs = timestampinSeconds * 1000
    const formatOptions = (withTZ ? (withSeconds ? formatOptionsWithTZ : formatOptionsWithTZWithoutSeconds) : (withSeconds ? formatOptionsWithoutTZ : formatOptionsWithoutTZWithoutSeconds))
    // console.log("format_TimeStampToDate: timestampInMs="+timestampInMs)
    // console.log( "jsDate toUTCString = " + jsDate.toUTCString() )
    let jsDate = new Date(timestampInMs);
    let sDate = new Intl.DateTimeFormat(t("Formats.date")).format(jsDate) + " " + new Intl.DateTimeFormat(t("Formats.date"), formatOptions).format(jsDate)
    return sDate
}

const format_Date = (timestampinSeconds) => {
    const timestampInMs = timestampinSeconds * 1000
    // console.log("format_TimeStampToDate: timestampInMs="+timestampInMs)
    // console.log( "jsDate toUTCString = " + jsDate.toUTCString() )
    let jsDate = new Date(timestampInMs);
    let sDate = new Intl.DateTimeFormat().format(jsDate)
    return sDate
}

const format_TimeMsToDate = (timestampInMs, withTZ=false, withSeconds=false) => {
    const formatOptions = (withTZ ? (withSeconds ? formatOptionsWithTZ : formatOptionsWithTZWithoutSeconds) : (withSeconds ? formatOptionsWithoutTZ : formatOptionsWithoutTZWithoutSeconds))
    let jsDate = new Date(timestampInMs);
    let sDate = new Intl.DateTimeFormat(t("Formats.date")).format(jsDate) + " " + new Intl.DateTimeFormat(t("Formats.date"), formatOptions).format(jsDate)
    return sDate
}

// Exports
export { format_TimeStampToStartDate, format_TimeStampToEndDate, format_Date, format_TimeMsToDate };