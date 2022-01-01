
import NavBar from "../UIElements/NavBar";
import SimpleFooter from "../UIElements/SimpleFooter";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import SporstmanSideBar from "./SideBar/SportsmanSideBar";
import ProfileBandeau from "./ProfileBandeau"
import { Component } from "react";
import { Navigate } from "react-router-dom";
import EventsSubscribedAthlete from "./Events/EventsSubscribedAthlete"
import MedalAthlete from "./Medals/MedalAthlete"
import GallerieAthlete from "./Medals/GallerieAthlete"
import MedalShow from "./Medals/MedalShow";
class SporstmanMain extends Component {

    constructor(props) {
        super(props);


        this.state = {
            nbevents: 0,
            eventsList: null
        }
    }



    render() {
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
                            <SporstmanSideBar />
                            <Col >



                                <ProfileBandeau AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} />
                                <MedalShow userProfile={this.props.userProfile} />
                                <EventsSubscribedAthlete userProfile={this.props.userProfile} />
                                <MedalAthlete userProfile={this.props.userProfile} AppCallBacks={this.props.AppCallBacks} />
                                <GallerieAthlete userProfile={this.props.userProfile} AppCallBacks={this.props.AppCallBacks} />

                                <SimpleFooter />
                            </Col>

                        </Row>
                    </Row>

                </div>
            </>
        )
    }
}

export default SporstmanMain