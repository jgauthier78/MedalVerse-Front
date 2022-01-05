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
            <Container className="d-flex col-mt-9 col-lg-8 col-xl-8 mt-5 no-opacity mb-6 justify-content-center">
                <div className="Profile-Card p-4 shadow-sm">
                    <div className="d-flex align-items-center">
                        <div className="image">
                            <img src={this.props.userProfile.userDetails.iconURI} className="Card-Image" />
                        </div>
                        <div className="ml-4 w-100">

                            <h5 className="mb-2 mt-0">{this.props.userProfile.userDetails.userName}</h5>


                            <div className=" align-items-center">
                                <Table bordered >
                                    <tbody>
                                        <tr>

                                            <td colSpan="3">
                                                <i className="fa fa-globe mr-2" ></i>

                                                <b>{t("profileBandeau.address")} : </b>{this.props.userProfile.address}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa fa-envelope mr-2" ></i>
                                                <b>{t("profileBandeau.mail")} : </b></td>
                                            <td colSpan="2">{this.props.userProfile.userDetails.email} </td>

                                        </tr>
                                        <tr>
                                            <td>
                                                <i className="fa fa-user mr-2" ></i>
                                                <b>{t("profileBandeau.role")} : </b></td>
                                            <td colSpan="2">{displayRoles(this.props.userProfile.userDetails.role)}</td>
                                        </tr>

                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>



                </div>

            </Container >
        )
    }
}

const ProfileBandeau = withTranslation()(ProfileBandeauBeforeTranslation);

export default ProfileBandeau;