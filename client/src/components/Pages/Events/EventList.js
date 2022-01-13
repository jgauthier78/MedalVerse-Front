import { format_Date } from "../../../utils/dateUtils";
import React, { Component } from "react";
import { /*Card,*/ Col, Container, Row } from "react-bootstrap";
// import CardHeader from "react-bootstrap/esm/CardHeader";
import NavigateButton from "../../UIElements/NavigateButton";

const getImageSrcFromEvent = (evnt, i) => { return (evnt.organisationDesc[i])[0].logoURI }
const getOrgNameFromEvent = (evnt, i) => { return (evnt.organisationDesc[i])[0].name }
const getEventStartDate = (evnt, i) => { return format_Date(((evnt.eventList[i])).endDate) }
const getEventDesc = (evnt, i) => { return evnt.eventList[i].eventDescription }
const getEventEndDate = (evnt, i) => { return format_Date(((evnt.eventList[i])).startDate) }
const eventIsActiv = (evnt, i) => {
    if (evnt.eventList[i].started === false) return "A venir"
    if (evnt.eventList[i].ended === false) return "En Cours"
    return "Terminé"
}

const TableEventItems = ({ userEvents }) => (
    <>
        {userEvents.organisationDesc.map((ogdesc, indx) => (
            <tr key={indx}>
                <td>{indx}</td>
                <td>{getOrgNameFromEvent(userEvents, indx)}</td>
                <td>{getEventDesc(userEvents, indx)}</td>
                <td>Du {getEventStartDate(userEvents, indx)} au {getEventEndDate(userEvents, indx)}</td>
                <td>{eventIsActiv(userEvents, indx)}</td>
                <td>
                    <img src={getImageSrcFromEvent(userEvents, indx)} alt={getImageSrcFromEvent(userEvents, indx)} className=" d-block " />
                </td>
            </tr>
        ))}
    </>
)

class EventList extends Component {
    render() {

        return (
            <div className=" mt-4 mb-8">

                <Container className="d-flex justify-content-center" >
                    <Row className=" " >
                        <Col className=" mt-8 align-items-center ">
                            <h3>Vos Evénements</h3>

                            <div className="mt-4">
                                <div className="tableFixHead mb-2">

                                    <table className="table bordered" >
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">{"Fédération"}</th>
                                                <th scope="col">{"Evénement"}</th>
                                                <th scope="col">{"Date"}</th>
                                                <th scope="col">{"En Cours"}</th>
                                                <th scope="col">{"Image"}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <TableEventItems userEvents={this.props.userProfile.userEvents} />
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <NavigateButton linkTo="carousel" up="false" options="mt-8" />
                        </Col>
                    </Row>
                </Container>

            </div>
        )
    }
}

export default EventList