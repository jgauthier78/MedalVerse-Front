/* Traduction */
import { t } from "i18next";

const formatOptionsWithTZ = {hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short"}
const formatOptionsWithoutTZ = {hour: "2-digit", minute: "2-digit", second: "2-digit"}

// const formatOptionsWithTZ = {hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short"}
// const formatOptionsWithoutTZ = {hour: "2-digit", minute: "2-digit", second: "2-digit"}

const format_TimeStampToStartDate = (timestampinSeconds) =>{
    return format_TimeStampToDate(timestampinSeconds, false)
}
const format_TimeStampToEndDate = (timestampinSeconds) =>{
    return format_TimeStampToDate(timestampinSeconds, true)
}

const format_TimeStampToDate = (timestampinSeconds, withTZ) =>{
    const timestampInMs = timestampinSeconds * 1000
    const formatOptions = ( withTZ ? formatOptionsWithTZ : formatOptionsWithoutTZ )
    // console.log("format_TimeStampToDate: timestampInMs="+timestampInMs)
    // console.log( "jsDate toUTCString = " + jsDate.toUTCString() )
    let jsDate = new Date(timestampInMs);
    let sDate = new Intl.DateTimeFormat( t("Formats.date") ).format( jsDate ) + " " + new Intl.DateTimeFormat( t("Formats.date"), formatOptions ).format( jsDate )
    return sDate
}


export { format_TimeStampToStartDate, format_TimeStampToEndDate };