import React from 'react';
import {
    Timeline,
    Events,
    UrlButton,
    ImageEvent,
    TextEvent,
    YouTubeEvent, themes,
    createTheme,
} from '@merc/react-timeline';
import { format_Date } from "../../../utils/dateUtils";

function getDate() {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    return day + "/" + month + "/" + year;
}
const theme = createTheme(themes.default, {
    timeline: {
        color: "#dddddd",
        a: { color: 'yellow' },

    },
    timelineTrack: {

        width: '2px',
        color: "#dddddd",
        backgroundColor: '#bbbbbb',
    },
    date: {
        backgroundColor: '#2570c8',
        color: '#fff',
    },
    imageAtom: {

        width: 'auto',
        height: '50%',
    },
    marker: {
        backgroundColor: '#ffffff',
        border: '2px solid #bbbbbb',
        color: "#ffffff",
        borderRadius: '50%',
        width: '20px',
        height: '20px',
    },
    button: {
        backgroundColor: '#000958',
    },
});

const MedalItems = ({ userMedals }) => {

    return (
        <>
            {
                userMedals.Medals.map((medal, indx) => (
                    <ImageEvent key={indx}
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
        <div className='mt-4'>
            <Timeline theme={theme}>
                <Events>
                    <TextEvent date={getDate()} text="**Aujourd'hui:** pas de nouvelle médaille" />

                    <MedalItems userMedals={userProfile.userMedals} />

                    <TextEvent date="08/12/2019" text="*Inscription à MedalVerse*" />
                </Events>
            </Timeline>
        </div>
    )
}

export default TimelineMedals