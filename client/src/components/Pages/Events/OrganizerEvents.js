import React, { Component } from "react";
import { Card, Container } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";

import { withTranslation } from 'react-i18next';

/* Translation */
import { useTranslation } from 'react-i18next';

import { format_TimeStampToStartDate, format_TimeStampToEndDate } from "../../../utils/dateUtils";

const CarrousselItem = ({ organizerEvents }) => (
    <div>
        {organizerEvents.map((event, indx) => (
                <div key={indx} className={`carousel-item ${indx === 0 ? "active" : ""}`}>
                <img src={event.organization.logoURI} alt={event.organization.logoURI} className="w-100 d-block" />
                <div className="carousel-caption carrousselCartouche">
                    <h3 className="text-white">{event.organization.name}</h3>
                    <p>{event.description}</p>
                    <p className="text-black">Du {format_TimeStampToStartDate(event.startDate)} au {format_TimeStampToEndDate(event.endDate)}</p>
                </div>
            </div>
        ))}
    </div>
)

const CarrousselButtonItem = ({ organizerEvents }) => (
    <div>
        {organizerEvents.map((event, indx) => (
            <button type="button" key={indx} data-bs-target="#carEvents" data-bs-slide-to={indx} className={indx === 0 ? "active" : ""}></button>
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

// const extractOrganizerEventsFromProfile = (organizerProfile) => {
//     return extractOrganizerEventsFromUserOrganizations(organizerProfile.userOrganizations)
// }
const extractOrganizerEventsFromUserOrganizations = (userOrganizations) => {
     let events = userOrganizations.map( (organization /*, index, array*/) => {
        let newEvents = organization.events.map( (event /*, index, array*/) => {
        // on rattache l'organisation à chaque event
        event.organization=organization
            return event
        })
        return newEvents 
     })
     return events.flat()
 }

const countEvents = (userOrganizations) => {
    // console.log( userOrganizations )
        let events = userOrganizations.map( (organization /*, index, array*/) => {
             return organization.events
        })
        return events.flat().length
    }

class OrganizerEventsBeforeTranslation extends Component {

    render() {

        const { t } = this.props;

        //console.log(this.props.userProfile.userEvents)
        // console.log(this.props)

        if ( countEvents(this.props.userProfile.userOrganizations) <= 0 ) {
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

{
// console.log( countEvents(this.props.userProfile.userOrganizations) )
// console.log( extractOrganizerEventsFromUserOrganizations(this.props.userProfile.userOrganizations)  )
}
    

                        <div className="carousel-indicators">
{
                            <CarrousselButtonItem organizerEvents={extractOrganizerEventsFromUserOrganizations(this.props.userProfile.userOrganizations)} />
}
                        </div>
                        <div className="carousel-inner" >
{
                            <CarrousselItem organizerEvents={extractOrganizerEventsFromUserOrganizations(this.props.userProfile.userOrganizations)} />
}
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