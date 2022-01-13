import React, { Component } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";

import { format_Date } from "../../../utils/dateUtils";
import NavigateButton from "../../UIElements/NavigateButton";
// import EventList from "./EventList";


const getImageSrcFromEvent = (evnt, i) => {
    return (evnt.organisationDesc[i])[0].logoURI
}
const getOrgNameFromEvent = (evnt, i) => { return (evnt.encoursOrganisationDesc[i])[0].name }
// const getOrgDescFromEvent = (evnt, i) => { return (evnt.encoursOrganisationDesc[i])[0].description }
const getEventStartDate = (evnt, i) => { return format_Date(((evnt.encoursEvent[i])).endDate) }
const getEventEndDate = (evnt, i) => { return format_Date(((evnt.encoursEvent[i])).startDate) }
// const eventIsActiv = (evnt, i) => {
//     if (evnt.encoursEvent[i].started === false) return true
//     if (evnt.encoursEvent[i].ended === false) return false
//     return false
// }

const CarrousselItem = ({ userEvents }) => {
    let firstElem = true
    return (
        <div>
            {userEvents.encoursEvent.map((ogdesc, indx) => {
                let _active = false
                if (firstElem === true) { firstElem = false; _active = true }
                return (

                    <div key={indx} className={`carousel-item ${_active ? "active" : ""}`}>
                        <img src={getImageSrcFromEvent(userEvents, indx)} alt={getImageSrcFromEvent(userEvents, indx)} className="w-100 d-block carrousselImage" />
                        <div className="carousel-caption carrousselCartouche">
                            <h3 className="text-white">{getOrgNameFromEvent(userEvents, indx)}</h3>

                            <h5 className="text-green"><b>Du {getEventStartDate(userEvents, indx)} au {getEventEndDate(userEvents, indx)}</b></h5>
                        </div>
                    </div>
                )

            }
            )}
        </div>
    )
}

const CarrousselButtonItem = ({ userEvents }) => (
    <>
        <div>
            {userEvents.encoursEvent.map((ogdesc, indx) => {
                return (
                    <button type="button" key={indx} data-bs-target="#carEvents" data-bs-slide-to={indx} className={indx === 0 ? "active" : ""}></button>
                )
            }

            )}
        </div>

    </>
)

class EventsSubscribedAthlete extends Component {

    render() {

        // console.log(this.props.userProfile.userEvents)

        if (this.props.userProfile.userEvents === undefined) {
            return (<></>)
        }

        return (
            <div className=" mt-5 mb-8">
                <div className="">
                    <p className="display-6 text-black text-light ml-8">
                        {"Vous participez à :"}
                    </p>
                </div>
                <Container className="d-flex">
                    <Row className="justify-content-center ">
                        <Col className="col-md-5 col-lg-6 col-xl-6 mt-6 col-align-items-center ">

                            <Card className="cardProfile shadow ">
                                <CardHeader>
                                    <h6 className="NoBreak">{"Mes Evénements:  "}</h6> <span>{this.props.userProfile.userEvents.nbEvents} acitfs</span>
                                </CardHeader>
                                <div id="carEvents" className="carousel slide ml-3 mr-3 mt-3 mb-3" data-bs-ride="carousel">


                                    <div className="carousel-indicators">
                                        <CarrousselButtonItem userEvents={this.props.userProfile.userEvents} />
                                    </div>
                                    <div className="carousel-inner" >
                                        <CarrousselItem userEvents={this.props.userProfile.userEvents} />
                                    </div>
                                    {this.props.userProfile.userEvents.length > 1
                                        &&
                                        <button className="carousel-control-prev" type="button" data-bs-target="#carEvents" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon"></span>
                                        </button>
                                    }
                                    {this.props.userProfile.userEvents.length > 1
                                        &&
                                        <button className="carousel-control-next" type="button" data-bs-target="#carEvents" data-bs-slide="next">
                                            <span className="carousel-control-next-icon"></span>
                                        </button>
                                    }
                                </div>

                                <Card.Footer className="text-muted ">
                                    {this.props.userProfile.userEvents.aVenir} compétitions à venir -
                                    {" " + this.props.userProfile.userEvents.nbFini} sont terminées -
                                    {" " + this.props.userProfile.userEvents.nbEncours} est en cours
                                </Card.Footer>
                            </Card>
                            <NavigateButton linkTo="carte" up="false" options="mt-8" />
                        </Col>
                    </Row>
                </Container>

            </div >
        )
    }
}

export default EventsSubscribedAthlete