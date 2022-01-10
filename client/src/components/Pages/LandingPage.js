import React, { Fragment, Component } from "react";

import { SimpleModal } from "../Modals"
import { withTranslation } from 'react-i18next';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "../UIElements/NavBar"
import SimpleFooter from "../UIElements/SimpleFooter"

import BandeauTitre from './Landing/BandeauTitre'

// import { Container, Row, Col } from "react-bootstrap";
import CreationFactory from "./Landing/4-CreationFactory";
import FanPlace from "./Landing/5-FanPlace";
import QuatriemeBandeau from "./Landing/QuatriemeBandeau";

/* Icons */
import { Wallet2 } from 'react-bootstrap-icons';

import Spinner from 'react-bootstrap/Spinner'
import BandeauPres from "./Landing/2-BandeauPres";
import TrophyFactory from "./Landing/3-TrophyFactory";
import BandeauGalerie from "./Landing/6-BandeauGalerie";
import BandeauProduits from "./Landing/7-BandeauProduits";
import ProjectTimeline from "./Landing/8-ProjectTimeline";
// import { DID_init, DID_readProfile, DID_updateProfile, DID_showConf } from '../../utils/did'

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

                // await DID_init(this._web3, window.ethereum)
                // DID_showConf();
                // DID_readProfile();

                // getting MedalVerse contract
                result = await this.props.AppCallBacks.initContract()
                if (result.err === null) {
                    this.MedalVerse = result.contract

                    console.log(this._accounts)
                    result = await this.props.AppCallBacks.initUserDetails(this._accounts[0])
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
                <NavBar loginCallBack={this.loginCallBack} AppCallBacks={this.props.AppCallBacks} isLanding="true" />
                <main ref="main">
                    <BandeauTitre AppCallBacks={this.props.AppCallBacks} loginCallBack={this.loginCallBack} />
                    <BandeauPres />
                    <TrophyFactory />
                    <CreationFactory />
                    <FanPlace />
                    <BandeauGalerie />
                    <BandeauProduits />
                    <ProjectTimeline />
                    <QuatriemeBandeau />

                </main>

                <SimpleModal title={<div><Wallet2 style={{ verticalAlign: '-10%' }} /> {t("LandingPage.walletConnect.title")} </div>} messageBody={<div> <Spinner animation="border" size="sm" /> {t("LandingPage.walletConnect.body")}   </div>} show={this.state.show} animation={false} />
                <ToastContainer />
            </Fragment >

        )
    }
}

const LandingPage = withTranslation()(LandingPageWithTranslation);

export default LandingPage