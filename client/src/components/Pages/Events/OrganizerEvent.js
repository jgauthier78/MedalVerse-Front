/* React - Bootstrap*/
import { Card, Container, Table } from "react-bootstrap";

import Button from 'react-bootstrap/Button';

import { useParams } from "react-router-dom";

/* Translation */
import { useTranslation } from 'react-i18next';

import { format_TimeStampToStartDate, format_TimeStampToEndDate } from "../../../utils/dateUtils";

import { ZERO_ADDRESS_STRING, THROWIN_STATUSES_VALUES } from "../../../utils/consts";

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
function EventLayout({ events, AppCallBacks /*userProfile, event*//*eventId*/ }) {
    let params = useParams();
    const { t } = useTranslation();
    let event = events[params.eventId]
    // console.log("params.eventId="+params.eventId)

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

    // event handler
    const onHandle_ThrowIn_changeStatusToRegistrationOfParticipants = async (ThrowInContractAddress) => {
        try {
            console.log("EventLayout::onHandle_ThrowIn_changeStatusToRegistrationOfParticipants:ThrowInContractAddress="+ThrowInContractAddress)
            await AppCallBacks.ThrowIn_changeStatusToRegistrationOfParticipants(ThrowInContractAddress)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // onHandle_ThrowIn_changeStatusToRegistrationOfParticipants

    // event handler
    const onHandle_ThrowIn_changeStatusToCompetitionInProgress = async (ThrowInContractAddress) => {
        try {
            console.log("EventLayout::ThrowIn_changeStatusToCompetitionInProgress:ThrowInContractAddress="+ThrowInContractAddress)
            await AppCallBacks.ThrowIn_changeStatusToCompetitionInProgress(ThrowInContractAddress)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // onHandle_ThrowIn_changeStatusToCompetitionInProgress

    // event handler
    const onHandle_ThrowIn_changeStatusToRewardDistribution = async (ThrowInContractAddress) => {
        try {
            console.log("EventLayout::onHandle_ThrowIn_changeStatusToRewardDistribution:ThrowInContractAddress="+ThrowInContractAddress)
            await AppCallBacks.ThrowIn_changeStatusToRewardDistribution(ThrowInContractAddress)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // onHandle_ThrowIn_changeStatusToRewardDistribution

    // event handler
    const onHandle_ThrowIn_changeStatusToCompetitionPreparation = async (ThrowInContractAddress) => {
        try {
            console.log("EventLayout::ThrowIn_changeStatusToCompetitionPreparation:ThrowInContractAddress="+ThrowInContractAddress)
            await AppCallBacks.ThrowIn_changeStatusToCompetitionPreparation(ThrowInContractAddress)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // ThrowIn_changeStatusToRewardExposed



    //  event handler
    const onHandleEventAddMedal = async (eventId) => {
        try {
            console.log("EventLayout::onHandleEventAddMedal: eventId="+eventId)
            await AppCallBacks.adminAddMedal(eventId)
        } // try
        catch (error) {
            console.error(error)
        } // catch
    } // onHandleEventAddMedal

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
<h6>{event.throwIn.status}</h6>
                                <h6>{t(`ThrowIn.statuses.${event.throwIn.status}`)}</h6>
                            </div>
                        </div>
                    </div>
                </Card.Header>

                <Card.Body>
                    <Card.Title>Actions</Card.Title>
                    <Card.Text>
                        {/*
                        //event.activ && event.started && event.ended 
                        <Button className="ml-1" variant="warning" onClick={() => ThrowIn_getStatus(event.throwIn.address)}>{"ThrowIn_getStatus"}</Button>
                        */}

                        {event.throwIn.status === THROWIN_STATUSES_VALUES.STATUS_00_COMPETITIONPREPARATION
                            &&
                        <Button className="ml-1" variant="warning" onClick={() => onHandle_ThrowIn_changeStatusToRegistrationOfParticipants(event.throwIn.address)}>{"ThrowIn_changeStatusToRegistrationOfParticipants"}</Button>
                        }
                        {event.throwIn.status === THROWIN_STATUSES_VALUES.STATUS_01_REGISTRATIONOFPARTICIPANTS
                            &&
                        <Button className="ml-1" variant="warning" onClick={() => onHandle_ThrowIn_changeStatusToCompetitionInProgress(event.throwIn.address)}>{"ThrowIn_changeStatusToCompetitionInProgress"}</Button>
                        }
                        {event.throwIn.status === THROWIN_STATUSES_VALUES.STATUS_02_COMPETITIONINPROGRESS
                            &&
                        <Button className="ml-1" variant="warning" onClick={() => onHandle_ThrowIn_changeStatusToRewardDistribution(event.throwIn.address)}>{"ThrowIn_changeStatusToRewardDistribution"}</Button>
                        }
                        {event.throwIn.status === THROWIN_STATUSES_VALUES.STATUS_03_REWARDDISTRIBUTION
                            &&
                        <Button className="ml-1" variant="warning" onClick={() => onHandle_ThrowIn_changeStatusToCompetitionPreparation(event.throwIn.address)}>{"ThrowIn_changeStatusToCompetitionPreparation"}</Button>
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
                                    {event.winner === ZERO_ADDRESS_STRING && // event.winner !== athleteAdr && // Display button : event has no winner
                                        <td><Button variant="warning" size="sm" onClick={() => onHandleEventMedalWinner(event.eventId, athleteAdr)} >{t("OrganizerEvent.athlete.actions.setWinner")}</Button></td>
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