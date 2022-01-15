/* React */
import { Component } from "react";

/* React - Bootstrap */
import { Row } from 'react-bootstrap';

// React-router
import { Routes, Route, Outlet, useLocation
 } from "react-router-dom";

/* Components */
import NavBar from "../UIElements/NavBar";
import SimpleFooter from "../UIElements/SimpleFooter";
import ProfileBandeau from "./ProfileBandeau"
import { OnlyCurrentEventsLayout, EventsByStateLayout, EventsByDateLayout } from "./Events/OrganizerEvents";
import { EventLayout } from "./Events/OrganizerEvent";

// Translation
// import { withTranslation } from 'react-i18next'; // Components
// import { useTranslation } from 'react-i18next'; // Functions

/* Utils */
import { extractOrganizerEventsFromProfile, filterValidEvents, filterCurrentEvents, filterEndedEvents, filterIncomingEvents, sortEventsByDate } from "./Events/OrganizerEvents-js";
import { NavBarSpacer } from "../UIElements/Spacers";

class OrganizerLayout extends Component {
    componentDidMount() {
        window.scroll(0, 0);
    }

    render() {
        return (
            <>
                <div className=" profile-page">
                    <Row className="flex-nowrap">
                        <NavBar AppCallBacks={this.props.AppCallBacks} isOrganizer={true} />
                    </Row>
                    <NavBarSpacer />
                    <Row className="g-0">
                        <OrganizerProfile AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} animatedBackground='img/abstract7.webm'></OrganizerProfile>
                    </Row>
                    <Row className="content bkg-gradient">
                        <Outlet />
                        <SimpleFooter />
                    </Row>
                </div>
            </>
        )
    } // render
} // class OrganizerLayout

const OrganizerProfile = ( {AppCallBacks, userProfile, animatedBackground} ) =>
{
    // const { t } = useTranslation();
    let location = useLocation();
    // debugger
    // console.log("location="+Object.entries(location))
    return (
        <>
            {location.pathname==="/organizer"
            &&
            <Row className="g-0">
                <div id="profil" className=" row g-0">
                    <ProfileBandeau AppCallBacks={AppCallBacks} userProfile={userProfile} animatedBackground='img/abstract7.webm' />
                </div>
            </Row>
            }
            {location.pathname==="/organizer"
            &&
            <Row className="content bkg-gradient">
                <OnlyCurrentEventsLayout events={filterCurrentEvents(extractOrganizerEventsFromProfile(userProfile))} />
            </Row>
            }
        </>
        )
}


class OrganizerMainBeforeTranslation extends Component {
    constructor(props) {
        // console.log("OrganizerMain:" + JSON.stringify(props));
        super(props);

        this.state =
        {
            events: null,
            eventsToDisplay: null
        }
    } // constructor

    async componentDidMount() {
        // console.log("OrganizerMainBeforeTranslation::componentDidMount")
    }

    render() {
        // console.log("OrganizerMainBeforeTranslation::render")
        return (
            <Routes>
                <Route path="/" element={<OrganizerLayout AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} />}>
                    <Route path="onlyCurrentEvents" element={<OnlyCurrentEventsLayout events={filterCurrentEvents(extractOrganizerEventsFromProfile(this.props.userProfile))} />} />
                    <Route path="allEventsByState" element={<EventsByStateLayout currentEvents={filterCurrentEvents(extractOrganizerEventsFromProfile(this.props.userProfile))} incomingEvents={filterIncomingEvents(extractOrganizerEventsFromProfile(this.props.userProfile))} endedEvents={filterEndedEvents(extractOrganizerEventsFromProfile(this.props.userProfile))} />} />
                    <Route path="allEventsByDate" element={<EventsByDateLayout activEvents={sortEventsByDate(filterValidEvents(extractOrganizerEventsFromProfile(this.props.userProfile)))} />} />
                    <Route path="event/:eventId" element={<EventLayout activEvents={filterValidEvents(extractOrganizerEventsFromProfile(this.props.userProfile))} AppCallBacks={this.props.AppCallBacks} />} />
                </Route>
            </Routes>
        )
    } // render
} // OrganizerMainBeforeTranslation

const OrganizerMain = OrganizerMainBeforeTranslation;

export default OrganizerMain;