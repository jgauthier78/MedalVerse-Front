/* React - Hooks*/
import /*React,*/ { /*useState,*/ useEffect/*, useRef*/, useCallback } from "react";

/* React - Bootstrap*/
import { Card, Container, Table } from "react-bootstrap";

import Button from 'react-bootstrap/Button';

import { useParams } from "react-router-dom";

/* Translation */
import { useTranslation } from 'react-i18next';

import { format_TimeStampToStartDate, format_TimeStampToEndDate } from "../../../utils/dateUtils";

import { ZERO_ADDRESS_STRING, MEDALVERSE_STATES_VALUES } from "../../../utils/consts";

/* Icons */
import { Trophy } from 'react-bootstrap-icons';

/*
const Athletes = ({ registeredAthletes }) => (
    <div>
        {registeredAthletes.map((registeredAthlete, idx) => (
            <li key={idx}>{registeredAthlete}</li>
        ))}
    </div>
)
*/
function EventLayout( { events, AppCallBacks /*userProfile*/ } )
{
    let params = useParams();
    const { t } = useTranslation();
    // console.log("params.eventId="+params.eventId)
    let event = events[params.eventId-1] // Event id starts at 1 : remove 1 to find it in the array

    const init = useCallback( async() => {
        // console.log(">init")
        await AppCallBacks.MedalVerse_SetEventHandler(event.eventId)
        // console.log("init<")
      }, /*[NO dependencies]*/)

    useEffect(
        () =>
        {   
            // console.log("useEffect:call init()");
            init()
        },
        [init/*NO dependencies*/]);

      


/*
    //  event handler
    const onHandleEventMedalWinner = async (eventId, athleteAdr) => {
        try {
            console.log("onHandleEventMedalWinner: eventId=" + eventId + " , athleteAdr= " + athleteAdr)
            await AppCallBacks.adminSetWinner(eventId, athleteAdr)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // onHandleEventMedalWinner
*/
    //  event handler
    /*
    const ThrowIn_getStatus = async (ThrowInContractAddress) => {
        console.log("EventLayout::ThrowIn_getStatus:ThrowInContractAddress="+ThrowInContractAddress)
        try {
            let status = await AppCallBacks.ThrowIn_getStatus(ThrowInContractAddress)
            console.log("status = "+status)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // ThrowIn_getStatus
    */

    const onHandle_setWinner = async (winnerAddress) => {
        try {
            console.log("EventLayout::onHandle_changeStateToCompetitionInProgress")
            await AppCallBacks.Event_setWinner(event.eventId, winnerAddress)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // onHandle_setWinner

    const onHandle_changeStateToCompetitionInProgress = async () => {
        try {
            console.log("EventLayout::onHandle_changeStateToCompetitionInProgress")
            await AppCallBacks.Event_changeStateToCompetitionInProgress(event.eventId)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // onHandle_changeStateToCompetitionInProgress

    // event handler
    const onHandle_changeStateToRewardDistribution = async () => {
        try {
            console.log("EventLayout::onHandle_changeStateToRewardDistribution")
            await AppCallBacks.Event_changeStateToRewardDistribution(event.eventId)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // onHandle_changeStateToRewardDistribution

    // event handler
    const onHandle_changeStateToRewardDistributed = async () => {
        try {
            console.log("EventLayout::onHandle_changeStateToRewardDistributed")
            await AppCallBacks.Event_changeStateToRewardDistributed(event.eventId)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // onHandle_changeStateToRewardDistributed

    return (
        <Container className="col-md-9 col-lg-8 col-xl-8 mt-4 ">
            <Card border="secondary">
                <Card.Header>
                    <div className="d-flex justify-content-between my-auto">
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <img src={event.organization.logoURI} className="profileImage mt-3 shadow" alt="" />
                            <div className="ms-2 c-details">
                                <h5 className="mb-0">{event.organization.description}</h5>
                                <h5 className="mb-0">{event.eventDescription}</h5>
                                <h6>{t("OrganizerEvent.from")} {format_TimeStampToStartDate(event.startDate)} {t("OrganizerEvent.to")} {format_TimeStampToEndDate(event.endDate)}</h6>
                            </div>
                            <div className="ms-2 c-details">
                                <h6>{t(`MedalVerse.event.states.${event.stateOfCompetition}`)}</h6>
                                <h6>event.stateOfCompetition={event.stateOfCompetition}</h6>
                            </div>
                        </div>
                    </div>
                </Card.Header>

                <Card.Body>
                    <Card.Title>Actions</Card.Title>
                    <Card.Text>
                        {event.stateOfCompetition === MEDALVERSE_STATES_VALUES.STATE_00_REGISTRATIONOFPARTICIPANTS
                         &&
                        <Button className="ml-1" variant="warning" onClick={() => onHandle_changeStateToCompetitionInProgress()}>{t("OrganizerEvent.actions.changeStateToCompetitionInProgress")}</Button>
                        }
                        {event.stateOfCompetition === MEDALVERSE_STATES_VALUES.STATUS_01_COMPETITIONINPROGRESS
                         &&
                        <Button className="ml-1" variant="warning" onClick={() => onHandle_changeStateToRewardDistribution()}>{t("OrganizerEvent.actions.changeStateToRewardDistribution")} <Trophy style={{ verticalAlign: '-10%' }} /></Button>
                        }
                        {event.stateOfCompetition === MEDALVERSE_STATES_VALUES.STATUS_02_REWARDDISTRIBUTION
                        &&
                        event.winner !== ZERO_ADDRESS_STRING // Display button : Reward distribution state AND event has a winner
                        &&
                        <Button className="ml-1" variant="warning" onClick={() =>  onHandle_changeStateToRewardDistributed()}>{t("OrganizerEvent.actions.changeStateToRewardDistributed")}</Button>
                        }
                    </Card.Text>
                </Card.Body>

            </Card>
            <br />
            <Card border="secondary" className="cardProfile shadow-sm ">
                <Card.Header as="h5">{t("OrganizerEvent.athlete.athletes")}</Card.Header>
                <Card.Body>
                    <Card.Title>{t("OrganizerEvent.athlete.competitors")}</Card.Title>
                    <Table striped bordered hover variant="secondary" size="sm">
                        <thead>
                            <tr>
                                <th>{t("OrganizerEvent.athlete.won")}</th>
                                <th>{t("OrganizerEvent.athlete.address")}</th>
                                <th>{t("OrganizerEvent.athlete.action")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {event.registeredSportsMan.map((athleteAdr, idx) => (
                                <tr key={idx}>
                                    <td>{(event.winner === athleteAdr ? <Trophy style={{ verticalAlign: '-10%' }} /> : "")} </td>
                                    <td>{athleteAdr} </td>
                                    {event.stateOfCompetition === MEDALVERSE_STATES_VALUES.STATUS_02_REWARDDISTRIBUTION
                                        &&
                                     event.winner === ZERO_ADDRESS_STRING && // event.winner !== athleteAdr && // Display button : Reward distribution state AND event has no winner
                                        <td>
                                            <Button className="ml-1" variant="warning" onClick={() =>  onHandle_setWinner(athleteAdr)}><Trophy style={{ verticalAlign: '-10%' }} /> {t("OrganizerEvent.athlete.actions.setWinner")}</Button>
                                        </td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>

    )

}

export { EventLayout };