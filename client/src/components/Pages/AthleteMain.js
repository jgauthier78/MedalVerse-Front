
import NavBar from "../UIElements/NavBar";
import SimpleFooter from "../UIElements/SimpleFooter";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
// import SporstmanSideBar from "./SideBar/SportsmanSideBar";
import ProfileBandeau from "./ProfileBandeau"
import { Component } from "react";
import { Navigate } from "react-router-dom";
import EventsSubscribedAthlete from "./Events/EventsSubscribedAthlete"
import MedalAthlete from "./Medals/MedalAthlete"
import GallerieAthlete from "./Medals/GallerieAthlete"
import MedalShow from "./Medals/MedalShow";
// import { Container } from "react-bootstrap";
// import ImageContainer from "../UIElements/ImageContainer";
import TimelineMedals from "./Medals/TimelineMedals";
import EventMaps from "./Events/EventMaps";
import NavBarSpacer from "../UIElements/NavBarSpacer";
// import BkgVideo from "../UIElements/BkgVideo";
import EncourageBandeau from "./Medals/EncourageBandeau";
import EventList from "./Events/EventList";
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

    componentDidMount() {
        window.scroll(0, 0);
    }

    render() {
        if (this.props.AppCallBacks === undefined || this.props.userProfile.userDetails === null) {

            return (<Navigate to="/" />)
        }
        // <SporstmanSideBar setPannel={this.setPannel} />

        return (
            <>
                <div className=" profile-page" >
                    <Row className="flex-nowrap">
                        <NavBar AppCallBacks={this.props.AppCallBacks} isAthlete={true} setPannel={this.setPannel} />
                    </Row>
                    <NavBarSpacer />
                    <Row className="g-0">


                        <Col className="Main-Content">

                            {this.state.curPannel === 0 ?
                                <>
                                    <div id="profil" className=" row g-0">

                                        <ProfileBandeau showTriangle={true} AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} animatedBackground='img/abstract6.webm' />
                                    </div>


                                    <div className=" row g-0">

                                        <EncourageBandeau AppCallBacks={this.props.AppCallBacks} userProfile={this.props.userProfile} />
                                    </div>
                                    <div id="medaille" className="bkg-gradient  ">
                                        <MedalShow userProfile={this.props.userProfile} />
                                    </div>
                                    <section id="timeline" className="   No-Left-Margin ">
                                        <TimelineMedals userProfile={this.props.userProfile} />

                                    </section>


                                </>
                                : <></>
                            }
                            {this.state.curPannel === 1 ?
                                <>

                                    <div className=" row g-0 bg-blue-gradiant Height-800">
                                        <EventList userProfile={this.props.userProfile} />
                                    </div>
                                    <div id="carousel" className=" row g-0 bg-light-gray">
                                        <EventsSubscribedAthlete userProfile={this.props.userProfile} />
                                    </div>
                                    <div className=" row g-0 bg-light-gray">
                                        <h3 >Carte des événements à venir</h3>
                                    </div>
                                    <div id="carte" className=" row g-0 bg-light-gray">
                                        <EventMaps userProfile={this.props.userProfile} />
                                    </div>

                                </>
                                : <></>
                            }
                            {this.state.curPannel === 2 ?
                                <>
                                    <div className="mt-6">
                                        <MedalAthlete userProfile={this.props.userProfile} AppCallBacks={this.props.AppCallBacks} />
                                    </div>
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