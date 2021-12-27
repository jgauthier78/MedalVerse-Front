
import NavBar from "../UIElements/NavBar";
import SimpleFooter from "../UIElements/SimpleFooter";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import OrganizerSideBar from "./SideBar/OrganizerSideBar";
import ProfileBandeau from "./ProfileBandeau"
import { Component } from "react";

class OrganizerMain extends Component {

    constructor(props) {
        super(props);
        console.log("OrganizerMain:"+JSON.stringify(this.props));

        this.state = {
            nbevents: 0,
            eventsList: null
        }
    
    }

    async componentDidMount() {
        let result = await this.props.AppCallBacks.getUserEvents()
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
                                <p>...</p>


                                <SimpleFooter />
                            </Col>

                        </Row>
                    </Row>

                </div>
            </>
        )
    }
}

export default OrganizerMain