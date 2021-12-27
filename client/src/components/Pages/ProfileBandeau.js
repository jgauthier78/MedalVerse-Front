import { Component } from "react";
import { Card } from "react-bootstrap";
import { Container, Row, Table } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import CardHeader from "react-bootstrap/esm/CardHeader";

import { withTranslation } from 'react-i18next';
import { displayRoles } from "./profileBandeau-js"

class ProfileBandeauBeforeTranslation extends Component {

    render() {
            const { t } = this.props;

            return (
            <Container className="col-md-10 mt-4 ">
                <Card className="cardProfile shadow-sm ">
                    <CardHeader>
                        <div className="d-flex justify-content-between my-auto">
                            <div className="d-flex flex-row align-items-center justify-content-center">
                                <img src={this.props.userProfile.userDetails.iconURI} className="profileImage mt-3 shadow" alt=""/>
                                <div className="ms-2 c-details">
                                    <h6 className="mb-0">{this.props.userProfile.userDetails.userName}</h6>
                                </div>
                            </div>

                        </div>

                    </CardHeader>
                    <Row className="container-fluid mt-4 mb-4">

                        <Col className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-4 text-white ">
                            <Table bordered >
                                <tbody>
                                    <tr>

                                        <td colSpan="3">{this.props.userProfile.userDetails.account}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Mail</b></td>
                                        <td colSpan="2">{this.props.userProfile.userDetails.email} </td>

                                    </tr>
                                    <tr>
                                        <td><b>{t("profileBandeau.role")}</b></td>
                                        <td colSpan="2">{ displayRoles(this.props.userProfile.userDetails.role) }</td>
                                    </tr>

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card>
            </Container>
        )
    }
}

const ProfileBandeau = withTranslation()(ProfileBandeauBeforeTranslation);

export default ProfileBandeau;