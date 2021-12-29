import React, { Component } from "react";
import { Button, Card, Container } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";

// Router
// import { useHistory } from 'react-router-dom';

// Translation
// Components
import { withTranslation } from 'react-i18next';
// Functions
import { useTranslation } from 'react-i18next';

// Utils
import { format_TimeStampToStartDate, format_TimeStampToEndDate } from "../../../utils/dateUtils";

/*
//             <Athletes registeredAthletes={event.registeredSportsMan} />
const Athletes = ({ registeredAthletes }) => (
    <div>
        {registeredAthletes.map((registeredAthlete, idx) => (
            <li key={idx}>{registeredAthlete}</li>
        ))}
    </div>
)
*/
const CarrousselItem = ({ organizerEvents }) => {
    const { t } = useTranslation();
    // const history = useHistory();
    return(
    <div>
    {organizerEvents.map((event, indx) => (
        <div key={indx} className={`carousel-item ${indx === 0 ? "active" : ""}`}>
            <img src={event.organization.logoURI} alt={event.organization.name} className="w-100 d-block" />
            <div className="carousel-caption ">
                <h3 className="text-white">{event.organization.name}</h3>
                <p>{event.description}</p>
                <p className="text-light bg-dark opacity-75">Du {format_TimeStampToStartDate(event.startDate)} au {format_TimeStampToEndDate(event.endDate)}</p>
                <Button className="btn btn-dark btn-sm"  onClick={() => console.log } >{t("OrganizerEvents.details")}</Button>
                <p/>
            </div>
        </div>
    ))}
    </div>
    )
}

const CarrousselButtonItem = ({ organizerEvents }) => (
    <div>
        {organizerEvents.map((event, indx) => (
            <button type="button" key={indx} data-bs-target="#carEvents" data-bs-slide-to={indx} className={indx === 0 ? "active" : ""}>{event.organization.name}</button>
        ))}
    </div>
)

const NoEvents = () => {
    const { t } = useTranslation();
    return (
    <div>
        {t("OrganizerEvents.noEvent")}
    </div>
    )
}

const extractOrganizerEventsFromProfile = (organizerProfile) => {
     return extractOrganizerEventsFromUserOrganizations(organizerProfile.userOrganizations)
}
// Browse User Organizations, Organization events : return all events
const extractOrganizerEventsFromUserOrganizations = (userOrganizations) => {
    // Browse userOrganizations
    let events = userOrganizations.map( (organization /*, index, array*/) => {
        // Browse organization events
        let newEvents = organization.events.map( (event /*, index, array*/) => {
        // on rattache l'organisation à chaque event
        // event.organization=organization
        return event
        })
    return newEvents 
    })
    // Flatten returned events
    return events.flat()
 }

// Filter criteria
const eventFilterCriteria = (event) => { 
    return (
        event.activ // === true
        // && event.eventId > 1 // test
    )
}

// Filter events
const filterEvents = (events) => {
    return events.filter ( (event /*, index, array*/) => {
        //eventFilter(event)
        // console.log(event)
        return eventFilterCriteria(event)
    })
}


// const countEvents = (userOrganizations) => {
//     // console.log( userOrganizations )
//     let events = userOrganizations.map( (organization /*, index, array*/) => {
//             return organization.events
//     })
//     return events.flat().length
// }

// function reducer(accumulator, currentValue, currentIndex, array){}
// const countEventsReducer = (previousValue, currentOrganization) => {
//     console.log("previousValue="+previousValue)
//     console.log("currentOrganization.events.length="+currentOrganization.events.length)
//     return previousValue + currentOrganization.events.length
// }
// const countEvents = (userOrganizations) => {
//     return userOrganizations.reduce( countEventsReducer, 0 /* initial value */ )
// }




class OrganizerEventsBeforeTranslation extends Component {

    render() {
        const { t } = this.props; // Translation
        
        let events = extractOrganizerEventsFromProfile(this.props.userProfile)
        let eventsToDisplay = filterEvents(events)

        // console.log(this.props)
        // console.log(this.props.userProfile)
        // console.log(events)
        console.log(eventsToDisplay)
        // console.log( "countEvents = " + countEvents(this.props.userProfile.userOrganizations) )

        if ( eventsToDisplay === undefined || eventsToDisplay.length <= 0 ) {
            return (
            <NoEvents/>
            )
        }


        return (
            <Container className="col-md-9 col-lg-8 col-xl-8 mt-4 col-align-items-center">
                <Card className="cardProfile shadow-sm ">
                    <CardHeader>
                        <h6>{t("OrganizerEvents.title")}</h6>
                    </CardHeader>
                    <div id="carEvents" className="carousel slide ml-3 mr-3 mt-3 mb-3" data-bs-ride="carousel">

                        <div className="carousel-indicators">
                            <CarrousselButtonItem organizerEvents={eventsToDisplay} />
                        </div>
                        <div className="carousel-inner" >
                            <CarrousselItem organizerEvents={eventsToDisplay} />
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carEvents" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carEvents" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>

                    </div>
                </Card>
            </Container>
        )
    }
}

const OrganizerEvents = withTranslation()(OrganizerEventsBeforeTranslation);

export default OrganizerEvents;