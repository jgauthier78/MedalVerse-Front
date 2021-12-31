import { useParams } from "react-router-dom"
import { useEffect, useState } from 'react'
import Reveal from "reveal.js"
import { Markdown } from "reveal.js/plugin/markdown/markdown"
import "reveal.js/dist/reveal.css"
import "reveal.js/dist/theme/black.css"
import Appearance from "reveal.js-appearance/plugin/appearance/appearance"
import { format_Date } from "../../utils/dateUtils";

let getRoleString = (role) => {
    let val = ""
    if (role & 8) val = "Sportif"
    if (role & 4) { if (val.length) val += ","; val += " Oganisateur" }

    return val
}

function getEventsString(evnts) {
    if (evnts && evnts.nbEvents > 0)
        return (<p>{"Participe à " + evnts.nbEvents + " événements"}</p>)
    return (<></>)
}
function getMedalCountString(medal) {
    if (medal && medal.nbMedals > 0)
        return (<><p>et</p>
            <p>{"déjà " + medal.nbMedals + " médaille(s)"}</p>
        </>)
    return (<></>)
}



const getImageSrcFromEvent = (evnt, i) => {
    return (evnt.organisationDesc[i])[0].logoURI
}
const getOrgNameFromEvent = (evnt, i) => { return (evnt.organisationDesc[i])[0].name }
const getOrgDescFromEvent = (evnt, i) => { return (evnt.organisationDesc[i])[0].description }
const getEventStartDate = (evnt, i) => { return format_Date(((evnt.eventList[i])).endDate) }
const getEventEndDate = (evnt, i) => { return format_Date(((evnt.eventList[i])).startDate) }

const MedalSlides = ({ web3, mdl }) => {

    if (!mdl || mdl.nbMedalsInGallery == 0) return (<></>)
    console.log("-------------------------")
    console.log(mdl)
    return (
        <>
            {
                mdl.Gallery.map((ml, indx) => {
                    return (

                        < section data-transition="slide" key={indx} >
                            <img src={mdl.uriList[0]} style={{ width: 128 + 'px', height: "auto" }} />
                            <h4>{ml.org} </h4>
                            <h6>{(format_Date(ml.event.endDate)).toString()}</h6>

                        </section>
                    )
                })
            }
        </>
    )
}

const EventSlides = ({ evnt }) => {
    if (!evnt || evnt.organisationDesc.length == 0) return (<></>)
    return (
        <>
            {evnt.organisationDesc.map((ogdesc, indx) => (
                < section data-transition="slide" key={indx} >

                    <img src={getImageSrcFromEvent(evnt, indx)} alt={getImageSrcFromEvent(evnt, indx)} className="w-100 d-block carrousselImage" />
                    <h3 >{getOrgNameFromEvent(evnt, indx)}</h3>
                    <p>{getOrgDescFromEvent(evnt, indx)}</p>
                    <h5 >Du {getEventStartDate(evnt, indx)} au {getEventEndDate(evnt, indx)}
                    </h5>


                </section>
            ))}
        </>
    )
}

export default function Gallerie({ AppCallBacks }) {
    const { id } = useParams()
    const [_web3, setWeb3] = useState(null);
    const [userDetails, setDetails] = useState(null);
    const [contract, setContract] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [role, setRole] = useState(0);
    const [incorrect, setIncorrect] = useState(false);
    const [events, setEvents] = useState(null)
    const [medals, setMedals] = useState(null)




    useEffect(() => {
        async function initStructures() {
            if (AppCallBacks != null)
                if (!initialized) {
                    try {
                        if (!AppCallBacks.isConnected()) setWeb3(await AppCallBacks.getWeb3Cnx())

                        setContract(await AppCallBacks.initContract())

                        let details = await AppCallBacks.initUserDetails(id)
                        console.log(details.detail)
                        setDetails(details.detail)
                        setRole(details.detail.role)
                        setInitialized(true);
                        if (details.detail.role & 8) {
                            let evnts = await AppCallBacks.getUserEvents(id)
                            setEvents(evnts)
                            console.log(evnts)
                            let medl = await AppCallBacks.getUserMedals(id)
                            setMedals(medl)
                        }
                        await Reveal.initialize({
                            autoSlide: 2500,
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
                    catch (err) { setIncorrect(true) }


                }
        }

        initStructures()

    }, []);
    if (userDetails) {
        // if not sportsMan
        if (role & 8 != 8) {
            return (
                <div>

                    <h6>{"l'addresse doit être celle d'un sportif"}</h6>
                </div>)
        }
        return (
            <div className="main" style={{ height: 1024 + 'px' }}>
                <div className="reveal">
                    <div className="slides">
                        <section data-transition="slide">

                            <img data-src={userDetails.iconURI} height="150" className="card-rounded shadow" />
                            <h3>{userDetails.userName}</h3>

                            <h5>{getRoleString(role)}</h5>
                            {getEventsString(events)}
                            {getMedalCountString(medals)}

                        </section>
                        <section data-transition="slide">{"Les Médailles"}</section>
                        <MedalSlides mdl={medals} web3={_web3} />
                        <section data-transition="slide">{"Participe A"}</section>
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

