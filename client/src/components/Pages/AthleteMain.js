
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
import { Container } from "react-bootstrap";
import ImageContainer from "../UIElements/ImageContainer";
import TimelineMedals from "./Medals/TimelineMedals";
class SporstmanMain extends Component {

    constructor(props) {
        super(props);


        this.state = {
            nbevents: 0,
            eventsList: null,
            curPannel: 0
        }
    }

    setPannel = (u) => {
        this.setState({ curPannel: u })
    }



    render() {
        if (this.props.AppCallBacks === undefined || this.props.userProfile.userDetails === null) {

            return (<Navigate to="/" />)
        }

        return (
            <>
                <div className=" profile-page" >
                    <Row className="flex-nowrap">
                        <NavBar AppCallBacks={this.props.AppCallBacks} />
                    </Row>
                    <Row className="g-0">

                        <SporstmanSideBar setPannel={this.setPannel} />
                        <Col className="Main-Content">


                            {this.state.curPannel === 0 ?
                                <>
                                    <ImageContainer options=" row g-0">
                                        <ProfileBandeau AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} />
                                    </ImageContainer>
                                    <section className="ss-style-triangles  row No-Left-Margin mt">
                                        <MedalShow userProfile={this.props.userProfile} />
                                    </section>
                                    <TimelineMedals userProfile={this.props.userProfile} />

                                </>
                                : <></>
                            }
                            {this.state.curPannel === 1 ?
                                <>
                                    <EventsSubscribedAthlete userProfile={this.props.userProfile} />
                                </>
                                : <></>
                            }
                            {this.state.curPannel === 2 ?
                                <>
                                    <MedalAthlete userProfile={this.props.userProfile} AppCallBacks={this.props.AppCallBacks} />
                                    <GallerieAthlete userProfile={this.props.userProfile} AppCallBacks={this.props.AppCallBacks} />
                                </>
                                : <></>}
                            <SimpleFooter />
                        </Col>

                    </Row>

                </div>
            </>
        )
    }
}

export default SporstmanMain