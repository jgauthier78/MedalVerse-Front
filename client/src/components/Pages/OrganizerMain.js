
import NavBar from "../UIElements/NavBar";
import SimpleFooter from "../UIElements/SimpleFooter";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import OrganizerSideBar from "./SideBar/OrganizerSideBar";
import ProfileBandeau from "./ProfileBandeau"
import { Component } from "react";
import { Navigate } from "react-router-dom";
import OrganizerEvents from "./Events/OrganizerEvents";

// import { withTranslation } from 'react-i18next';

class OrganizerMainBeforeTranslation extends Component {

    constructor(props) {
        // console.log("OrganizerMain:" + JSON.stringify(props));
        super(props);

        this.state = {
            nbevents: 0,
            eventsList: null
        }

    }

    async componentDidMount() {
        let result = await this.props.AppCallBacks.getUserEvents()
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
}

const OrganizerMain = OrganizerMainBeforeTranslation;

export default OrganizerMain;