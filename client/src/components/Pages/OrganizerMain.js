
import NavBar from "../UIElements/NavBar";
import SimpleFooter from "../UIElements/SimpleFooter";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import OrganizerSideBar from "./SideBar/OrganizerSideBar";
import ProfileBandeau from "./ProfileBandeau"
import { Component } from "react";
import Container from 'react-bootstrap/Container';
// import { Navigate } from "react-router-dom";
import { EventsLayout /*, OrganizerEvents */ } from "./Events/OrganizerEvents";
import { extractOrganizerEventsFromProfile, filterEvents} from "./Events/OrganizerEvents-js";

import { EventLayout } from "./Events/OrganizerEvent";


import {
    Routes,
    Route,
    // Link,
    Outlet
  } from "react-router-dom";

//   import { useParams } from "react-router-dom";

// import { withTranslation } from 'react-i18next';

class OrganizerLayout extends Component {

    constructor(props) {
        // console.log("OrganizerLayout:" + props);
        super(props);
    }

    render() {
        return (
            <>
            <div className="container-fluid profile-page">
                <Row className="flex-nowrap">
                    <NavBar AppCallBacks={this.props.AppCallBacks} />
                </Row>
                <Row className="flex-nowrap">
                    <Row>
                        <OrganizerSideBar />
                        <Col >
                            <ProfileBandeau AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} />
{/*}
                            <OrganizerEvents userProfile={this.props.userProfile} />
        {*/}
                            <Row className="content">
                                <Outlet />
                            </Row>

                            <SimpleFooter />
                        </Col>
                    </Row>
                </Row>
            </div>
        </>
        )

    }

/*
    renderOld() {
        if (this.props.AppCallBacks === undefined || this.props.userProfile.userDetails === null) {
        return (<Navigate to="/" />)
    }
    return (
        <>
            <div className="container-fluid profile-page">
                <Row className="flex-nowrap">
                    <NavBar AppCallBacks={this.props.AppCallBacks} />
                </Row>
                <Row className="flex-nowrap">
                    <Row>
                        <OrganizerSideBar />
                        <Col >
                            <ProfileBandeau AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} />
                            <OrganizerEvents userProfile={this.props.userProfile} />
                            <SimpleFooter />
                        </Col>

                    </Row>
                </Row>

            </div>
        </>
        )
    }
*/

} // class OrganizerLayout

/*
function Layout() {
    return (
      <div>
        <h1>Welcome to the app!</h1>
        <nav>
          <Link to="invoices">Invoices</Link> |{" "}
          <Link to="dashboard">Dashboard</Link>
        </nav>
        <div className="content">
          <Outlet />
        </div>
      </div>
    );
  }
*/
/*
  function Events( {userProfile} ) {
    //return <h1>Events</h1>;
    return <OrganizerEvents userProfile={userProfile} />
  }
*/
/*
  function EventLayout(
       //{userProfile, event*//*eventId} 
    ) {
    // const {state} = useLocation();
    // const { id, color } = state; // Read values passed on state
    // const { username } = useParams();
    //   console.log(event)
    let params = useParams();
    console.log(params.eventId)
    return <h1>Event {params.eventId}</h1>;
  }
*/
/*
  function OrganizerLayout( {AppCallBacks,userProfile} ) {
    console.log(props)
    return (
        <>
        <div className="container-fluid profile-page">
            <Row className="flex-nowrap">
                <NavBar  connectedAccountAddr, loginCallBack, options, AppCallBacks  AppCallBacks={AppCallBacks} />
            </Row>
            <Row className="flex-nowrap">
                <Row>
                    <OrganizerSideBar />
                    <Col >
                        <ProfileBandeau AppCallBacks={props.AppCallBacks} userProfile={props.userProfile} />

                        <OrganizerEvents userProfile={props.userProfile} />

                        <SimpleFooter />
                    </Col>

                </Row>
            </Row>

        </div>
    </>
    );
  }
*/
class OrganizerMainBeforeTranslation extends Component {

    constructor(props) {
        // console.log("OrganizerMain:" + JSON.stringify(props));
        super(props);

        this.state = {
            // nbevents: 0,
            // eventsList: null,
            events: null,
            eventsToDisplay: null
        }

    }

    async componentDidMount() {
        // let result = await this.props.AppCallBacks.getUserEvents()
        let events = extractOrganizerEventsFromProfile(this.props.userProfile)
        let eventsToDisplay = filterEvents(events)
        this.setState( { events, eventsToDisplay } )

    }

    render() {
        // return(
        //     <Routes>
        //         <Route path="/" element={<Layout />}>
        //             <Route path="invoices" element={<Invoices />} />
        //             <Route path="dashboard" element={<Dashboard />} />
        //         </Route>
        //     </Routes>
        // )
        return(
            <Routes>
                <Route path="/" element={<OrganizerLayout AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} />}>
{/*}
                    <Route path="events" element={<OrganizerEvents userProfile={this.props.userProfile} />} />
{*/}
                    <Route path="events" element={<EventsLayout  eventsToDisplay={this.state.eventsToDisplay} />} />
                    <Route path="event/:eventId"  element={<EventLayout events={this.state.eventsToDisplay} AppCallBacks={this.props.AppCallBacks} />} />
                </Route>
            </Routes>
        )
    }
/*
    renderOld() {
        if (this.props.AppCallBacks === undefined || this.props.userProfile.userDetails === null) {
            return (<Navigate to="/" />)
        }
        return (
            <>
                <div className="container-fluid profile-page">
                    <Row className="flex-nowrap">
                        <NavBar AppCallBacks={this.props.AppCallBacks} />
                    </Row>
                    <Row className="flex-nowrap">
                        <Row>
                            <OrganizerSideBar />
                            <Col >
                                <ProfileBandeau AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} />

                                <OrganizerEvents userProfile={this.props.userProfile} />

                                <SimpleFooter />
                            </Col>

                        </Row>
                    </Row>

                </div>
            </>
        )
    }
*/
}

const OrganizerMain = OrganizerMainBeforeTranslation;

export default OrganizerMain;