/* Traduction */
import { t } from "i18next";

const format_TimeStampToStartDate = (timestampinSeconds) =>{
    return format_TimeStampToDate(timestampinSeconds, false)
}
const format_TimeStampToEndDate = (timestampinSeconds) =>{
    return format_TimeStampToDate(timestampinSeconds, true)
}

const format_TimeStampToDate = (timestampinSeconds, withTZ) =>{
    const timestampInMs = timestampinSeconds * 1000
    const formatOptionsWithTZ = {hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short"}
    const formatOptionsWithoutTZ = {hour: "numeric", minute: "numeric", second: "numeric"}
    const formatOptions = ( withTZ ? formatOptionsWithTZ : formatOptionsWithoutTZ )
    let jsDate = new Date(timestampInMs);
    let sDate = jsDate.toLocaleDateString( t("Formats.date") ) + " " +
        new Intl.DateTimeFormat( t("Formats.date"), formatOptions ).format(  )
    return sDate
}


export { format_TimeStampToStartDate, format_TimeStampToEndDate };