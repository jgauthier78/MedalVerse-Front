import { Component } from "react";
import { Card } from "react-bootstrap";
import { Container, Row, Table } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import CardHeader from "react-bootstrap/esm/CardHeader";

import { ROLES } from "../../utils/roles_CONSTS"
/* Translation */
import { withTranslation } from 'react-i18next';
import { t } from "i18next";

class ProfileBandeauBeforeTranslation extends Component {
roles = (role) => {
    let roles = [];
    if ( this.props.userProfile.userDetails.role & ROLES.ROLE_ORGANIZER ) {
        roles.push(ROLES.ROLE_ORGANIZER)
    }
    if ( this.props.userProfile.userDetails.role & ROLES.ROLE_ATHLETE ) {
        roles.push(ROLES.ROLE_ATHLETE)
    }
    if ( this.props.userProfile.userDetails.role & ROLES.ROLE_AUTHOR ) {
        roles.push(ROLES.ROLE_AUTHOR)
    }
    return roles
}

roleName = (role) => {
    switch (role) {
        case ROLES.ROLE_ORGANIZER:
            return t("profileBandeau.roles.organizer");
        case ROLES.ROLE_ATHLETE:
            return t("profileBandeau.roles.athlete");
        case ROLES.ROLE_AUTHOR:
            return t("profileBandeau.roles.author");
        default:
            return "";
    }
}

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
                                        <td colSpan="2">{this.roles().map( profil => this.roleName(profil) ).reduce( (r, a) => r.concat(a, ", "), [", "]).slice(1, -1)  }</td>
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