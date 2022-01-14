import { useParams } from "react-router-dom"
import { useEffect, useState } from 'react'
import Reveal from "reveal.js"
// import { Markdown } from "reveal.js/plugin/markdown/markdown"
import "reveal.js/dist/reveal.css"
import "reveal.js/dist/theme/black.css"
import Appearance from "reveal.js-appearance/plugin/appearance/appearance"
import { format_Date } from "../../utils/dateUtils";




function getEventsString(evnts) {
    if (evnts && evnts.nbEvents > 0)
        return (<>{"Participe à " + evnts.nbEvents + " événements"}</>)
    return (<></>)
}
function getMedalCountString(medal) {
    if (medal && medal.nbMedals > 0)
        return (<>
            {"déjà " + medal.nbMedals + " médaille(s)"}
        </>)
    return (<></>)
}



const getImageSrcFromEvent = (evnt, i) => {
    return (evnt.organisationDesc[i])[0].logoURI
}
const getOrgNameFromEvent = (evnt, i) => { return (evnt.encoursOrganisationDesc[i])[0].name }
const getOrgDescFromEvent = (evnt, i) => { return (evnt.encoursOrganisationDesc[i])[0].description }
const getEventStartDate = (evnt, i) => { return format_Date(((evnt.encoursEvent[i])).endDate) }
const getEventEndDate = (evnt, i) => { return format_Date(((evnt.encoursEvent[i])).startDate) }
const getEventDesc = (evnt, i) => { return (evnt.encoursEvent[i]).eventDescription }

const MedalSlides = ({ web3, mdl }) => {

    if (!mdl || mdl.nbMedalsInGallery === 0) return (<></>)

    return (
        <>
            {
                mdl.Gallery.map((ml, indx) => {
                    return (


                        < section key={indx}

                            data-transition={indx === mdl.Gallery.length - 1 ? "fade" : "fade-in zoom-out"}
                            data-background-image={mdl.uriList[indx]}


                        >

                            <h2 className=" shadows">{ml.event.eventDescription}</h2>
                            <h3 className="r-fit-text shadows">{ml.org} </h3>
                            <h3 className=" shadows-sm">Remportée le: {(format_Date(ml.event.endDate)).toString()}</h3>


                        </section>

                    )
                })
            }
        </>
    )
}

const EventSlides = ({ evnt }) => {
    if (!evnt || evnt.encoursOrganisationDesc.length === 0) return (<></>)
    return (
        <>
            {evnt.encoursOrganisationDesc.map((ogdesc, indx) => (
                < section key={indx}
                    data-transition="fade"
                    data-background-image={getImageSrcFromEvent(evnt, indx)}
                >

                    <div className=" ">
                        <h1 className="r-fit-text shadows">{getOrgDescFromEvent(evnt, indx)}</h1>
                        <h2 className="shadows-sm">{getOrgNameFromEvent(evnt, indx)}</h2>
                        <h2 className="shadows-sm">{getEventDesc(evnt, indx)}</h2>
                        <h3 className="shadows-sm">Du {getEventStartDate(evnt, indx)} au {getEventEndDate(evnt, indx)}
                        </h3>
                    </div>

                </section>
            ))}
        </>
    )
}

export default function Gallerie({ AppCallBacks }) {
    const { id } = useParams()
    const [_web3, setWeb3] = useState(null);
    const [userDetails, setDetails] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [role, setRole] = useState(0);
    // const [setIncorrect] = useState(false);
    const [events, setEvents] = useState(null)
    const [medals, setMedals] = useState(null)




    useEffect(() => {
        async function initStructures() {
            if (AppCallBacks != null)
                if (!initialized) {
                    try {
                        if (!AppCallBacks.isConnected()) {
                            setWeb3(await AppCallBacks.getWeb3Cnx())
                        }
                        await AppCallBacks.initContract()
                        let details = await AppCallBacks.initUserDetails(id)
                        setDetails(details.detail)
                        setRole(details.detail.role)
                        setInitialized(true);
                        if (details.detail.role & 8) {
                            let evnts = await AppCallBacks.getAthleteEvents(id)
                            setEvents(evnts)
                            // console.log(evnts)
                            let medl = await AppCallBacks.getUserMedals(id)
                            setMedals(medl)
                        }
                        await Reveal.initialize({
                            autoSlide: 2500,
                            autoPlayMedia: true,
                            width: "1920",
                            height: 1080,
                            embedded: true,
                            loop: true,
                            transition: 'default',
                            parallaxBackgroundImage: "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'", parallaxBackgroundSize: "2100px 900px",
                            parallaxBackgroundHorizontal: 2,
                            parallaxBackgroundVertical: 50,
                            appearance: {
                                baseclass: 'animated',
                                visibleclass: 'in',
                                hideagain: true,
                                delay: 300,
                                appearevent: 'slidetransitionend',
                                autoappear: false,
                                autoelements: false
                            },
                            plugins: [Appearance]

                        })
                    }
                    catch (err) { console.log(err); }


                }
        }

        initStructures()

    }, []);
    if (userDetails) {
        // if not sportsMan
        if ((role & 8) !== 8) {
            return (
                <div>

                    <h6>{"l'addresse doit être celle d'un sportif"}</h6>
                </div>)
        }
        return (
            <div className="main" style={{ height: "100vh" }}>
                <div className="reveal">
                    <div className="slides">
                        <section
                            data-background-video="/img/abstract4.webm" data-background-repeat="repeat"
                            data-transition="fade-in fade-out"
                            data-autoslide="6000"
                        >

                            <img data-src={userDetails.iconURI} height="250" alt=".." className="card-rounded shadow" />
                            <h1>{userDetails.userName}</h1>


                            <h4>{getEventsString(events)}</h4>
                            <h4>{getMedalCountString(medals)}</h4>

                        </section>
                        <section
                            data-background-video="/img/abstract6.webm" data-background-repeat="repeat"
                            data-transition="zoom"
                            data-autoslide="4000"
                        >
                            <h2 className="r-fit-text">{"Les Médailles"}</h2>
                            <h2 className="r-fit-text">{"Les Médailles partagées par "}{userDetails.userName}</h2>
                        </section>
                        <MedalSlides mdl={medals} web3={_web3} />
                        <section data-background-video="/img/abstract5.webm" data-background-repeat="repeat"
                            data-transition="zoom"
                            data-autoslide="4000"
                        >
                            <h2 className="r-fit-text">{"COMPETITIONS"}</h2>
                            <h2 className="r-fit-text">{userDetails.userName} Participe</h2>
                        </section>
                        <EventSlides evnt={events} />
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            Invalid Address
        </div>
    )

}

