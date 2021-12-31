import React, { Component } from "react";
import { Button, Card, Container } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";

// Router
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Translation
// Components
import { withTranslation } from 'react-i18next';
// Functions
import { useTranslation } from 'react-i18next';

// Utils
import { format_TimeStampToStartDate, format_TimeStampToEndDate } from "../../../utils/dateUtils";
// import { extractOrganizerEventsFromProfile, extractOrganizerEventsFromUserOrganizations, filterEvents} from "./OrganizerEvents-js";

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

function EventsLayout( {/*userProfile*/ eventsToDisplay} ) {
    //return <h1>Events</h1>;
    // return <OrganizerEvents userProfile={userProfile} />
    return <OrganizerEvents eventsToDisplay={eventsToDisplay} />
  }

const CarrousselItem = ({ organizerEvents }) => {
    // const history = useHistory();
    let navigate = useNavigate();

//  event handler
  const onHandleEventDetails = async ( event ) =>
  {
    try
    {
    //   console.log("CarrousselItem::onHandleEventDetails: event.eventId=" + event.eventId + " event.organization.name = " + event.organization.name  );
    //   history.push('event')
    // navigate('../event', {eventId:3} );
    navigate( `../event/${event.eventId}` );
    } // try
    catch (error)
    {
        console.error(error)
    } // catch
  } // onHandleEventDetails

    const { t } = useTranslation();

    // const history = useHistory();
    return(
    <div>
    {organizerEvents.map((event, indx) => (
        <div key={indx} className={`carousel-item ${indx === 0 ? "active" : ""}`}>
            <img src={event.organization.logoURI} alt={event.organization.name} className="w-100 d-block" />
            <div className="carousel-caption ">
                <h3 className="text-white">{event.organization.name}</h3>
                <div className="text-light bg-dark opacity-75 m-1">{t("OrganizerEvents.from")} {format_TimeStampToStartDate(event.startDate)} {t("OrganizerEvents.to")} {format_TimeStampToEndDate(event.endDate)}</div>
                <Button className="btn btn-dark btn-sm m-2 opacity-75" onClick={() => onHandleEventDetails( event ) } >{t("OrganizerEvents.details")}</Button>
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

class OrganizerEventsBeforeTranslation extends Component {

    render() {
        const { t } = this.props; // Translation
        const { eventsToDisplay } = this.props
        
        // let events = extractOrganizerEventsFromProfile(this.props.userProfile)
        // let eventsToDisplay = filterEvents(events)

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

// export default OrganizerEvents;
export { EventsLayout, OrganizerEvents };