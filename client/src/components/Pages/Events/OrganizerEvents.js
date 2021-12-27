import React, { Component } from "react";
import { Card, Container } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";

import { withTranslation } from 'react-i18next';

/* Translation */
import { useTranslation } from 'react-i18next';

const getImageSrcFromEvent = (evnt, i) => {
    return (evnt.organisationDesc[i])[0].logoURI
}
const getOrgNameFromEvent = (evnt, i) => { return (evnt.organisationDesc[i])[0].name }
const getOrgDescFromEvent = (evnt, i) => { return (evnt.organisationDesc[i])[0].description }
const getEventStartDate = (evnt, i) => { return ((evnt.eventList[i])).endDate }
const getEventEndDate = (evnt, i) => { return ((evnt.eventList[i])).startDate }



const CarrousselItem = ({ userEvents }) => (
    <div>
        {userEvents.organisationDesc.map((ogdesc, indx) => (
            <div key={indx} className={`carousel-item ${indx === 0 ? "active" : ""}`}>
                <img src={getImageSrcFromEvent(userEvents, indx)} alt={getImageSrcFromEvent(userEvents, indx)} className="w-100 d-block" />
                <div className="carousel-caption carrousselCartouche">
                    <h3 className="text-white">{getOrgNameFromEvent(userEvents, indx)}</h3>
                    <p>{getOrgDescFromEvent(userEvents, indx)}</p>
                    <p className="text-black">Du {getEventStartDate(userEvents, indx)} au {getEventEndDate(userEvents, indx)}</p>
                </div>
            </div>
        ))}
    </div>
)

const CarrousselButtonItem = ({ userEvents }) => (
    <div>
        {userEvents.organisationDesc.map((ogdesc, indx) => (

            <button type="button" key={indx} data-bs-target="#carEvents" data-bs-slide-to={indx} className={indx == 0 ? "active" : ""}></button>
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

        console.log(this.props.userProfile.userEvents)

        if (this.props.userProfile.userEvents === undefined) {
            return (
            <NoEvents/>
            )
        }

        return (
            <Container className="col-md-9 col-lg-8 col-xl-8 mt-4 col-align-items-center">
                <Card className="cardProfile shadow-sm ">
                    <CardHeader>
                        <h6>Mes Evenements</h6>
                    </CardHeader>
                    <div id="carEvents" className="carousel slide ml-3 mr-3 mt-3 mb-3" data-bs-ride="carousel">

{
/*
                        <div className="carousel-indicators">
                            <CarrousselButtonItem userEvents={this.props.userProfile.userEvents} />
                        </div>
                        <div className="carousel-inner" >
                            <CarrousselItem userEvents={this.props.userProfile.userEvents} />
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carEvents" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carEvents" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
*/
}
                    </div>
                </Card>
            </Container>
        )
    }
}

const OrganizerEvents = withTranslation()(OrganizerEventsBeforeTranslation);

export default OrganizerEvents;