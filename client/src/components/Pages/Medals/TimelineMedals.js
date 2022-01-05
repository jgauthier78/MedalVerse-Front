import React from 'react';
import {
    Timeline,
    Events,
    UrlButton,
    ImageEvent,
    TextEvent,
    YouTubeEvent,
} from '@merc/react-timeline';
import { format_Date } from "../../../utils/dateUtils";

function getDate() {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    return day + "/" + month + "/" + year;
}
const MedalItems = ({ userMedals }) => {

    return (
        <>
            {
                userMedals.Medals.map((medal, indx) => (
                    <ImageEvent
                        date={format_Date(medal.event.endDate)}
                        text={userMedals.nftDesc[indx].name}
                        src={userMedals.uriList[indx]}
                        alt="Medal"
                        credit={"Médaille par " + userMedals.nftDesc[indx].orgName}
                    />
                ))
            }
        </>
    )
}

const TimelineMedals = ({ userProfile }) => {
    return (
        <Timeline>
            <Events>
                <TextEvent date={getDate()} text="**Aujourd'hui:** pas de nouvelle médaille" />

                <MedalItems userMedals={userProfile.userMedals} />

                <YouTubeEvent
                    date="6/18/19"
                    id="6UnRHtwHGSE"
                    name="General Tso's Chicken recipe"
                    text="... and YouTube videos!"
                />
            </Events>
        </Timeline>
    )
}

export default TimelineMedals