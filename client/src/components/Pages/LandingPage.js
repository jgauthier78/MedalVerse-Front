import React, { Fragment, Component } from "react";
// import Button from "react-bootstrap/esm/Button";
// import Dialog from 'react-bootstrap-dialog'
import { SimpleModal } from "../Modals"
import { withTranslation } from 'react-i18next';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "../UIElements/NavBar"
import SimpleFooter from "../UIElements/SimpleFooter"

import BandeauTitre from './Landing/BandeauTitre'

// import { Container, Row, Col } from "react-bootstrap";
import SecondBandeau from "./Landing/SecondBandeau";
import TroisiemeBandeau from "./Landing/TroisiemeBandeau";
import QuatriemeBandeau from "./Landing/QuatriemeBandeau";

import { DID_init, DID_readProfile, DID_updateProfile, DID_showConf } from '../../utils/did'

class LandingPageWithTranslation extends Component {

    constructor(props) {
        super(props);

        this.state = { show: false };
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    toast_options = {
        autoClose: 2000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_LEFT,
        pauseOnHover: true,
        progress: 0.2
    };

    closeModal() {
        this.setState({ show: false });
    }

    showModal() {
        this.setState({ show: true });
    }
    /* Callback for the Login Button*/
    loginCallBack = async () => {
        console.log("loginCallBack")
        var _getWeb3 = this.props.AppCallBacks.getWeb3Cnx
        var result
        // We loop so the site is not accessible until everything is set properly
        // this.dialog.show({ body: 'Connection au Wallet' })
        this.showModal();
        let success = true;

        // getWeb3 comes from App
        let erreur = ""
        result = await _getWeb3()
        if (result.err === null) {
            this._web3 = result.web3
            // getting accounts
            this._accounts = await this.props.AppCallBacks.initAccounts()
            if (this._accounts != null) {

                await DID_init(this._web3, window.ethereum)
                DID_showConf();
                DID_readProfile();

                // getting MedalVerse contract
                result = await this.props.AppCallBacks.initContract()
                if (result.err === null) {
                    this.MedalVerse = result.contract

                    result = await this.props.AppCallBacks.initUserDetails()
                    if (result.err === null) {
                        console.log(result.detail)
                    }
                    else {
                        erreur = "Erreur utilisateur"
                    }
                }
            }
            else {
                erreur = "Erreur de récupération de compte"
                success = false
            }

        }
        else {
            erreur = "Erreur de connexion"
            success = false
        }
        // this.dialog.hide();
        this.closeModal();


        if (!success) toast.error(erreur, this.toast_options);
        else this.props.AppCallBacks.updateUserDetails()
    }



    render() {
        const { t } = this.props;
        return (
            <Fragment>
                <NavBar loginCallBack={this.loginCallBack} AppCallBacks={this.props.AppCallBacks} />
                <main ref="main">
                    <BandeauTitre />
                    <SecondBandeau />
                    <TroisiemeBandeau />
                    <QuatriemeBandeau />

                </main>
                <SimpleFooter />
                {/*                <Dialog ref={(el) => { this.dialog = el }} /> */}
                <SimpleModal title={t("LandingPage.walletConnect.title")} messageBody={t("LandingPage.walletConnect.body")} show={this.state.show} animation={false} />

                <ToastContainer />
            </Fragment >

        )
    }
}

const LandingPage = withTranslation()(LandingPageWithTranslation);

export default LandingPage