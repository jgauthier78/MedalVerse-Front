/* React */
import { Component } from "react";

/* React - Bootstrap */
import { Row } from 'react-bootstrap';

// React-router
import { Routes, Route, Outlet } from "react-router-dom";

/* Components */
import NavBar from "../UIElements/NavBar";
import SimpleFooter from "../UIElements/SimpleFooter";
import ProfileBandeau from "./ProfileBandeau"
import { EventsByStateLayout, EventsByDateLayout } from "./Events/OrganizerEvents";
import { EventLayout } from "./Events/OrganizerEvent";

/* Utils */
import { extractOrganizerEventsFromProfile, filterActivEvents, filterCurrentEvents, filterEndedEvents, filterIncomingEvents, sortEventsByDate} from "./Events/OrganizerEvents-js";
import NavBarSpacer from "../UIElements/NavBarSpacer";

class OrganizerLayout extends Component
{
    render() {
        return (
            <>
            <div className=" profile-page">
                <Row className="flex-nowrap">
                    <NavBar AppCallBacks={this.props.AppCallBacks} isOrganizer={true} />
                </Row>
                <NavBarSpacer />
                <Row className="g-0">
                    <div id="profil" className=" row g-0">
                            <ProfileBandeau AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} animatedBackground = 'img/abstract7.webm' />
                    </div>
                </Row>
                <Row className="content">
                    <Outlet />
                </Row>
                <SimpleFooter />
            </div>
        </>
        )
    } // render
} // class OrganizerLayout

class OrganizerMainBeforeTranslation extends Component
{
    constructor(props)
    {
        // console.log("OrganizerMain:" + JSON.stringify(props));
        super(props);

        this.state =
        {
            events: null,
            eventsToDisplay: null
        }
    } // constructor

    async componentDidMount()
    {
        // console.log("OrganizerMainBeforeTranslation::componentDidMount")
    }

    render()
    {
        // console.log("OrganizerMainBeforeTranslation::render")
        return(
            <Routes>
                <Route path="/" element={<OrganizerLayout AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} />}>
                    <Route path="eventsByState" element={<EventsByStateLayout currentEvents={filterCurrentEvents( extractOrganizerEventsFromProfile(this.props.userProfile) )} incomingEvents={filterIncomingEvents( extractOrganizerEventsFromProfile(this.props.userProfile) )} endedEvents={filterEndedEvents( extractOrganizerEventsFromProfile(this.props.userProfile) )} />} />
                    <Route path="eventsByDate" element={<EventsByDateLayout activEvents={sortEventsByDate(filterActivEvents( extractOrganizerEventsFromProfile(this.props.userProfile) ))} />} />
                    <Route path="event/:eventId"  element={<EventLayout activEvents={filterActivEvents( extractOrganizerEventsFromProfile(this.props.userProfile) )} AppCallBacks={this.props.AppCallBacks} />} />
                </Route>
            </Routes>
        )
    } // render
} // OrganizerMainBeforeTranslation

const OrganizerMain = OrganizerMainBeforeTranslation;

export default OrganizerMain;