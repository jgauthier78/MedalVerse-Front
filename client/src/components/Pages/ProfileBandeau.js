import { Component } from "react";
import { Container, Table } from "react-bootstrap";

// Translation
import { withTranslation } from 'react-i18next';

import BkgVideo from "../UIElements/BkgVideo";

// Tools
import { displayRoles } from "./profileBandeau-js"

class ProfileBandeauBeforeTranslation extends Component {

    render() {
        const { t, animatedBackground = 'img/abstract2.webm' } = this.props;

        return (
            <>

                <Container className="d-flex justify-content-center overflow-hidden position-relative">

                    <BkgVideo videoSource={animatedBackground} options="adapt-Background-Video" />


                    <div className="col-mt-9 col-lg-8 col-xl-8">
                        <div className="Profile-Card p-4 shadow-sm mt-6 mb-8">

                            <div className="d-flex align-items-center">
                                <div className="image">
                                    <img src={this.props.userProfile.userDetails.iconURI} className="Card-Image" alt="user"/>
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
                    </div>
                    {this.props.showTriangle ?
                        <div className="separator separator-bottom separator-skew">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                                version="1.1"
                                viewBox="0 0 2560 100"
                                x="0"
                                y="0"
                            >
                                <polygon
                                    className="fill-gray"
                                    points="2560 0 2560 100 0 100"
                                />
                            </svg>
                        </div>
                        : <></>
                    }
                </Container >
            </>
        )
    }
}

const ProfileBandeau = withTranslation()(ProfileBandeauBeforeTranslation);

export default ProfileBandeau;