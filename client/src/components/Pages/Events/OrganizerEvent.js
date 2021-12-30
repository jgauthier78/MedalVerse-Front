import React, { Component } from "react";

/* React - Bootstrap*/
// import { Button, Card, Container } from "react-bootstrap";
import { Card, Container, Row, Col, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

import { withTranslation } from 'react-i18next';

import { useParams } from "react-router-dom";

/* Translation */
import { useTranslation } from 'react-i18next';

import { format_TimeStampToStartDate, format_TimeStampToEndDate } from "../../../utils/dateUtils";
/*
const Athletes = ({ registeredAthletes }) => (
    <div>
        {registeredAthletes.map((registeredAthlete, idx) => (
            <li key={idx}>{registeredAthlete}</li>
        ))}
    </div>
)
*/

function EventLayout( { events /*userProfile, event*//*eventId*/} ) {
    //   console.log(events)
    let params = useParams();
    // console.log(params.eventId)
    // return <h1>Event {params.eventId}</h1>;
    const { t } = useTranslation();
    let event = events[params.eventId]

  //  event handler
  const onHandleEventMedal = async ( athleteAdr ) =>
  {
    try
    {
    //   console.log("CarrousselItem::onHandleEventDetails: event.eventId=" + event.eventId + " event.organization.name = " + event.organization.name  );
    //   history.push('event')
    // navigate('../event', {eventId:3} );
    alert("onHandleEventMedal:"+athleteAdr)
    } // try
    catch (error)
    {
        console.error(error)
    } // catch
  } // onHandleEventMedal

  //  event handler
  const onHandleEventClose = async ( eventId ) =>
  {
    try
    {
    //   console.log("CarrousselItem::onHandleEventDetails: event.eventId=" + event.eventId + " event.organization.name = " + event.organization.name  );
    //   history.push('event')
    // navigate('../event', {eventId:3} );
    alert("onHandleEventClose:"+eventId)
    } // try
    catch (error)
    {
        console.error(error)
    } // catch
  } // onHandleEventDetails

    return (
        <Container className="col-md-9 col-lg-8 col-xl-8 mt-4 ">
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between my-auto">
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <img src={event.organization.logoURI} className="profileImage mt-3 shadow" alt="" />
                            <div className="ms-2 c-details">
                                <h5 className="mb-0">{event.organization.description}</h5>
                                <h6>Du {format_TimeStampToStartDate(event.startDate)} au {format_TimeStampToEndDate(event.endDate)}</h6>
                            </div>
                        </div>
                    </div>
              </Card.Header>

              <Card.Body>
                <Card.Title>Actions</Card.Title>
                <Card.Text>
                {
                    // event.activ && event.started && !event.ended 
                    true
                    &&
                    <Button className="ml-1" variant="warning" onClick={() => onHandleEventClose( event.eventId ) }>Close event</Button>
                }
                </Card.Text>
              </Card.Body>

            </Card>

            <Card className="cardProfile shadow-sm ">
                <Card.Body>
                    <Card.Title>{t("OrganizerEvent.athlete.athletes")}</Card.Title>
                    <Card.Text>
                        <Row className="container-fluid mt-4 mb-4">
                        <Table  striped bordered hover >
                            <thead>
                                <tr>
                                    <th>
                                    {t("OrganizerEvent.athlete.address")}
                                    </th>
                                    <th>
                                    {t("OrganizerEvent.athlete.action")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.registeredSportsMan.map((athleteAdr, idx) => (
                                <tr key={idx}>
                                    <td>{athleteAdr} </td>
                                    <td><Button size="sm" onClick={() => onHandleEventMedal( athleteAdr ) } >{t("OrganizerEvent.athlete.actions.medal")}</Button></td>
                                </tr>
                                ))}
                            </tbody>
                        </Table>
                        </Row>
                    </Card.Text>
                </Card.Body>
            </Card>

        </Container>

    ) 

  }

export { EventLayout };