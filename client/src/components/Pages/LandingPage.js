import React, { Fragment, Component } from "react";
import Button from "react-bootstrap/esm/Button";
import Dialog from 'react-bootstrap-dialog'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "../UIElements/NavBar"
import SimpleFooter from "../UIElements/SimpleFooter"

import BandeauTitre from './Landing/BandeauTitre'

import { Container, Row, Col } from "react-bootstrap";
import SecondBandeau from "./Landing/SecondBandeau";
import TroisiemeBandeau from "./Landing/TroisiemeBandeau";
import QuatriemeBandeau from "./Landing/QuatriemeBandeau";



class LandingPage extends Component {

    toast_options = {

        autoClose: 2000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_LEFT,
        pauseOnHover: true,
        progress: 0.2
    };

    /* Callback for the Login Button*/
    loginCallBack = async () => {
        var _getWeb3 = this.props.getWeb3Cnx
        var result
        // We loop so the site is not accessible until everything is set properly
        this.dialog.show({ body: 'Connection au Wallet' })
        let success = true;

        // getWeb3 comes from App
        let erreur = ""
        result = await _getWeb3()
        if (result.err === null) {
            this._web3 = result.web3
            // getting accounts
            this._accounts = await this.props.initAccounts()
            if (this._accounts != null) {
                // getting MedalVerse contract
                result = await this.props.initContract()
                if (result.err === null) {
                    this.MedalVerse = result.contract

                    result = await this.props.initUserDetails()
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
        this.dialog.hide();
        if (!success) toast.error(erreur, this.toast_options);
        else this.props.updateUserDetails()
    }



    render() {
        return (
            <Fragment>
                <NavBar loginCallBack={this.loginCallBack} />
                <main ref="main">
                    <BandeauTitre />
                    <SecondBandeau />
                    <TroisiemeBandeau />
                    <QuatriemeBandeau />

                </main>
                <SimpleFooter />

                <Dialog ref={(el) => { this.dialog = el }} />
                <ToastContainer />
            </Fragment >

        )
    }
}

export default LandingPage