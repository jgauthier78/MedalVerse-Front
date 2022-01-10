
import 'react-toastify/dist/ReactToastify.css';


import {
    Timeline,
    Events,
    UrlButton,
    ImageEvent,
    TextEvent,
    YouTubeEvent, themes,
    createTheme,
} from '@merc/react-timeline';
import NavigateButton from '../../UIElements/NavigateButton';

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
        backgroundColor: '#00df00',
        border: '2px solid #99999999',
        color: "#ef00ef",
        borderRadius: '50%',
        width: '20px',
        height: '20px',
    },
    button: {
        backgroundColor: '#000958',
    },
});

const ProjectTimeline = () => {
    return (
        <div id="project" className='Container-Full bg-light-gray'>
            <section className="section section-lg ">
                <div className=' d-flex justify-content-center'>

                    <img src="img/MedalVerse.svg" className="Titre-MedalVerse ml-3" alt="MedalVerse" />
                </div>
                <div className="d-flex justify-content-center cards-margin-title-small">
                    <h1 className="justify-content-sm-center display-3">{"RoadMap"}</h1>
                </div>
                <Timeline theme={theme}>
                    <Events>
                        <TextEvent date="T1 2022" text="**T1 2022:** V1 de MedalVerse">
                            <p />
                            <ul>
                                <li>Trophy Factory</li>
                                <li>Mise en place de partenariats</li>
                                <li>Private sale</li>
                            </ul>
                        </TextEvent>
                        <TextEvent date="T2 2022" text="**T2 2022:** Mise en production V2">
                            <p />
                            <ul>
                                <li>Création de Galeries</li>
                                <li>Espace membre</li>
                                <li>IEO</li>
                            </ul>
                        </TextEvent>

                        <TextEvent date="S2 2022" text="**T2 2022:** Mise en production de la V3">
                            <p />
                            <ul>
                                <li>Nouvelles Blockchains</li>
                                <li>Personnalisation des galeries</li>
                                <li>Mise en ligne de la Fan Place</li>
                            </ul>
                        </TextEvent>
                        <TextEvent date="2023" text="**2023:** Mise en production de la V4">
                            <p />
                            <ul>
                                <li>Ouverture vers les récompenses d’autres secteurs</li>
                                <li>Intégration VR</li>
                            </ul>
                        </TextEvent>
                    </Events>
                </Timeline>
                <NavigateButton linkTo="communeaute" up="false" />
            </section >
        </div>

    )
}

export default ProjectTimeline