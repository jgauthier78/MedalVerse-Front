import React, { Component, Suspense } from "react";
import Loading from './components/Loading';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import getWeb3 from "./utils/getWeb3";
import NotFound from "./components/Pages/NotFound"
import LandingPage from "./components/Pages/LandingPage"
import MedalVerseContract from "./contracts/MedalVerse.json";
import OrganizerMain from "./components/Pages/OrganizerMain";
import SporstmanMain from "./components/Pages/SporstmanMain";
import RedirectTo from "./components/UIElements/RedirectTo";
import "./styles/Main.css"

// Translation
// import i18n (needs to be bundled ;))
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import './utils/i18n';

class App extends Component {

    state = {
        web3: null,
        accounts: null,
        contract: null,
        isConnected: false,
        userRole: -1,
        roleUpdated: false,
    }


    setIsConnected = val => this.setState({ isConnected: val })

    render() {

        return (
            <BrowserRouter >
                <Routes>
                    <Route exact path='/' element=
                        {this.state.redirectTo === null ?
                            <Suspense fallback={<Loading />}>
                                <I18nextProvider i18n={i18next}>
                                </I18nextProvider>
                            </Suspense>
                            :
                            <RedirectTo to={this.state.redirectTo} resetNavigateTo={this.resetNavigateTo} />
                        }

                    />
                    <Route exact path='organizer' element={this.state.redirectTo === null ?
                        <I18nextProvider i18n={i18next}>
                        </I18nextProvider>
                        :
                        <RedirectTo to={this.state.redirectTo} resetNavigateTo={this.resetNavigateTo} />
                    } />
                    <Route exact path='sportsman' element={this.state.redirectTo === null ?
                        <I18nextProvider i18n={i18next}>
                        </I18nextProvider>
                        :
                        <RedirectTo to={this.state.redirectTo} resetNavigateTo={this.resetNavigateTo} />
                    } />
                    <Route element={NotFound} />
                </Routes>
            </BrowserRouter >
        )

    }


    // Returns the Web3 provider
    getWeb3Cnx = async () => {
        var web3 = this.state.web3
        var err = null
        if (web3 === null)
            try {
                web3 = await getWeb3();
                this.setState({ web3 })
                let that = this
                window.ethereum.on('accountsChanged', function (accounts) {
                    that.accountsUpdated(accounts)
                })
            }
            catch (error) {
                // Catch any errors for any of the above operations.
                err = error;
            }
        return { web3, err }
    }

    // Initialize the current accounts
    initAccounts = async () => {
        const web3 = this.state.web3
        try {
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            this.setState({ accounts: accounts })
            return accounts
        }
        catch (error) {

            console.error(error);

            return null;
        }
    }

    // Return first account of the list
    getAccounts = () => this.state.accounts[0];

    // Connect to the medalVerse contract
    initContract = async () => {
        const web3 = this.state.web3
        var contract = null, err = null
        try {
            // Use web3 to get the user's accounts.

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = await MedalVerseContract.networks[networkId];

            contract = await new web3.eth.Contract(MedalVerseContract.abi, deployedNetwork && deployedNetwork.address);
            this.setState({ contract: contract })

        }
        catch (error) {
            // Catch any errors for any of the above operations.
            err = error
            console.log(err)
        }
        return { contract, err }
    }

    // Get details corresponding to the user address
    initUserDetails = async () => {
        let result = { detail: null, err: null }
        try {
            // call the contract method to get infos about user
            result.detail = await this.state.contract.methods.getUserDetails(this.getAccounts()).call()
            this.setState({ userRole: result.detail.role })
        }
        catch (err) {
            result.err = err
        }
        return result
    }

    // Redirect to the correct page after reading user details from contract
    updateUserDetails = () => {
        let role = this.state.userRole
        if (role & 4) // Organizer
            this.setState({ redirectTo: "/organizer" })
        else if (role & 8) // Sportsman
            this.setState({ redirectTo: "/sportsman" })
        else if (role & 2) // Author
            this.setState({ redirectTo: "/author" })
        else this.setState({ redirectTo: "/" }) // Not registered
    }

    // We need to reset state after redirecting, otherwise we have an infinite loop
    resetNavigateTo = () => {
        this.setState({ redirectTo: null })
    }

    // The user changed the current account, so we need to update everything
    accountsUpdated = async (account) => {
        // Directly set the state, as the callback gives us a pointer to new account
        this.setState({ accounts: account })
        // read new details from contract
        await this.initUserDetails()
        // redirect to the right page
        this.updateUserDetails()
    }
}

export default App;