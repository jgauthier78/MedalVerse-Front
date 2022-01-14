// React
import { Component } from "react";

// React - Bootstrap
// Components
import { Button, Card, Container } from "react-bootstrap";
import { Col, Row } from 'react-bootstrap';

import CardHeader from "react-bootstrap/esm/CardHeader";

// React-Router
import { useNavigate } from 'react-router-dom';

// Translation
import { withTranslation } from 'react-i18next'; // Components
import { useTranslation } from 'react-i18next'; // Functions

// Utils
import { format_TimeStampToStartDate, format_TimeStampToEndDate } from "../../../utils/dateUtils";

const OnlyCurrentEventsLayout = ( {currentEvents} ) =>
{
    const { t } = useTranslation();
    return (
        <Container>
            <OrganizerEventsCarousel eventsToDisplay={currentEvents}  prefix="curr" bg="primary">{t("OrganizerEvents.titleCurrentEvents")}</OrganizerEventsCarousel>
        </Container>
    )
}

const EventsByStateLayout = ( {currentEvents, incomingEvents, endedEvents} ) =>
{
    const { t } = useTranslation();
    return (
        <Container>
            <OrganizerEventsCarousel eventsToDisplay={currentEvents}  prefix="curr" bg="primary">{t("OrganizerEvents.titleCurrentEvents")}</OrganizerEventsCarousel>
            <OrganizerEventsCarousel eventsToDisplay={incomingEvents} prefix="next" bg="warning">{t("OrganizerEvents.titleUpcomingEvents")}</OrganizerEventsCarousel>
            <OrganizerEventsCarousel eventsToDisplay={endedEvents}    prefix="prev" bg="secondary">{t("OrganizerEvents.titlePreviousEvents")}</OrganizerEventsCarousel>
        </Container>
    )
}

const EventsByDateLayout = ( {activEvents} ) =>
{
    const { t } = useTranslation();
    return (
        <Container>
            <br/>
            <OrganizerEventsByDate activEvents={activEvents} >{t("OrganizerEvents.titleEventsByDate")}</OrganizerEventsByDate>
        </Container>
    )
}

const CarrousselItem = ({ organizerEvents }) =>
{
    let navigate = useNavigate();

    // Display event details
    const onHandleDisplayEventDetails = async ( event ) =>
    {
        try
        {
            console.log("CarrousselItem::onHandleDisplayEventDetails:event.eventId="+event.eventId)
            navigate( `../event/${event.eventId}` );
        } // try
        catch (error)
        {
            console.error(error)
        } // catch
    } // onHandleDisplayEventDetails

    const { t } = useTranslation();

    return (
    <Container>
    {organizerEvents.map((event, indx) => (
        <div key={indx} className={`carousel-item ${indx === 0 ? "active" : ""}`}>
            <img src={event.organization.logoURI} alt={event.organization.name} className="w-100 d-block" />
            <div className="carousel-caption bg-dark opacity-50">
                <h3 className="text-white ">{event.organization.name}</h3>
                <h3 className="text-white ">{event.eventDescription}</h3>
                <div className="text-light m-1">{t("OrganizerEvents.from")} {format_TimeStampToStartDate(event.startDate)} {t("OrganizerEvents.to")} {format_TimeStampToEndDate(event.endDate)}</div>
                <Button className="btn btn-light btn-sm m-2 opacity-100" onClick={() => onHandleDisplayEventDetails( event ) } >{t("OrganizerEvents.details")}</Button>
            </div>
        </div>
    ))}
    </Container>
    )
}

const CarrousselButtonItem = ({ organizerEvents }) => (
    <div>
        {organizerEvents.map((event, indx) => (
            <button type="button" key={indx} data-bs-target="#carEvents" data-bs-slide-to={indx} className={indx === 0 ? "active" : ""}></button>
        ))}
    </div>
)

const NoEventToDisplay = (props) =>
{
    const { t } = useTranslation();

    return (
    <Container className="col-md-9 col-lg-8 col-xl-8 mt-4 col-align-items-center">
        <Card className="cardProfile shadow-sm">
            <CardHeader className={`bg-${props.bg}`}>
                <h6>{props.children}</h6>
            </CardHeader>
            <Container>
                {t("OrganizerEvents.noEvent")}
            </Container>

        </Card>
    </Container>
    )
}

class OrganizerEventsCarouselBeforeTranslation extends Component
{
    render()
    {
        // console.log("this.props.prefix"+this.props.prefix);
        // const { t } = this.props; // Translation
        const { eventsToDisplay } = this.props
        // console.log(eventsToDisplay)

        if ( eventsToDisplay === undefined || eventsToDisplay.length <= 0 )
        {
            return (
                <NoEventToDisplay bg={this.props.bg}>{this.props.children}</NoEventToDisplay>
            )
        }

        return (
            <Container className="col-md-9 col-lg-8 col-xl-8 mt-4 col-align-items-center">
                <Card className="cardProfile shadow-sm ">
                    <CardHeader className={`bg-${this.props.bg}`}>
                        <h6>{this.props.children}</h6>
                    </CardHeader>

                    <div id={`${this.props.prefix}carEvents`} className="carousel slide ml-3 mr-3 mt-3 mb-3" data-bs-ride="carousel">

                        <div className="carousel-indicators">
                            <CarrousselButtonItem organizerEvents={eventsToDisplay} />
                        </div>
                        <div className="carousel-inner" >
                            <CarrousselItem organizerEvents={eventsToDisplay} />
                        </div>
                        {eventsToDisplay.length > 1
                        &&
                        <button className="carousel-control-prev" type="button" data-bs-target={`#${this.props.prefix}carEvents`} data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        }
                        {eventsToDisplay.length > 1
                        &&
                        <button className="carousel-control-next" type="button" data-bs-target={`#${this.props.prefix}carEvents`} data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
                        }

                    </div>
                </Card>
            </Container>
        )
    } // render
} // class OrganizerEventsBeforeTranslation

const OrganizerEventsByDate = ({ activEvents, children }) =>
{
    if ( activEvents === undefined || activEvents.length <= 0 )
    return (
        <NoEventToDisplay>{children}</NoEventToDisplay>
        )

    return (
    
        <EventsByDate activEvents={activEvents} />
        )
}

const Event = ({ event }) =>
{
    const { t } = useTranslation();
    let navigate = useNavigate();

    const onHandleDisplayEventDetails = async ( event ) =>
    {
        try
        {
            // console.log("CarrousselItem::onHandleDisplayEventDetails:event.eventId="+event.eventId)
            navigate( `../event/${event.eventId}` );
        } // try
        catch (error)
        {
            console.error(error)
        } // catch
    } // onHandleDisplayEventDetails
    return (
        <Container fluid>
            <Card style={{ width: '18rem' }}>
            <Card.Header>{t("OrganizerEvents.from")} {format_TimeStampToStartDate(event.startDate)} {t("OrganizerEvents.to")} {format_TimeStampToEndDate(event.endDate)}</Card.Header>
            <Card.Img variant="top" src={event.organization.logoURI} />
            <Card.Body> 
                <Card.Title>{event.organization.name}</Card.Title>
                <Card.Text>{event.eventDescription}</Card.Text>
                <Button className="btn btn-light btn-sm m-2 opacity-100" onClick={() => onHandleDisplayEventDetails( event ) } >{t("OrganizerEvents.details")}</Button>
            </Card.Body>
            </Card>
        </Container>
    )
}

const EventsByDate = ({ activEvents }) =>
{

    // Display event details

    return (
    <Container>
        <Row xs={1} md={4} xl={8} className="g-8">
        {activEvents.map((event, indx) => (
             <Col key={indx} >
                <Event event={event}/>
            </Col>
        ))}
        </Row>
        <br/>
    </Container>
    )
}

const OrganizerEventsCarousel = withTranslation()(OrganizerEventsCarouselBeforeTranslation);

export { EventsByStateLayout, EventsByDateLayout, OnlyCurrentEventsLayout };