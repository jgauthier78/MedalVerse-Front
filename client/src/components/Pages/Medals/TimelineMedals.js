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
import { Container } from 'react-bootstrap';

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
        backgroundColor: '#888888',
        color: '#fff',
    },
    imageAtom: {
        objectFit: 'cover',
        overflow: 'hidden',
        width: 'auto',
        maxHeight: '150px',
    },
    marker: {
        backgroundColor: '#00df00',
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
        <section className="   bg-light-gray " >

            <img src="img/MedalVerse.svg" className="Titre-MedalVerse mt-5" alt="MedalVerse" />
            <h5 className="text-black text-light ml-4 margin--4">{"La timeline de vos succès"}</h5>

            <Container className='d-flex justify-content-center'>
                <div className='col mt-6 col-5 '>
                    <Timeline theme={theme}>
                        <Events>
                            <TextEvent date={getDate()} text="**Aujourd'hui:** pas de nouvelle médaille" />

                            <MedalItems userMedals={userProfile.userMedals} />

                            <TextEvent date="08/12/2019" text="*Inscription à MedalVerse*" />
                        </Events>
                    </Timeline>
                </div>
            </Container>
        </section >
    )
}

export default TimelineMedals