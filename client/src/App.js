import React, { Component, Suspense } from "react";
import Loading from './components/Loading';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import getWeb3 from "./utils/getWeb3";
import NotFound from "./components/Pages/NotFound"
import LandingPage from "./components/Pages/LandingPage"
import MedalVerseContract from "./contracts/MedalVerse.json";
import OrganizerMain from "./components/Pages/OrganizerMain";
import AthleteMain from "./components/Pages/AthleteMain";
import RedirectTo from "./components/UIElements/RedirectTo";
import "./styles/Main.css"
import { ROLES } from "./utils/roles_CONSTS"
import { DID_init, DID_readProfile, DID_updateProfile, DID_showConf } from './utils/did'

// Translation
// import i18n (needs to be bundled ;))
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import './utils/i18n';

class App extends Component {

    constructor(props) {
        super(props)
        this.handleSaveUserProfile = this.handleSaveUserProfile.bind(this);
        this.handleOrganizerSaveProfile = this.handleOrganizerSaveProfile.bind(this);



        this.DID_init = this.DID_init.bind(this);
        this.DID_showConf = this.DID_showConf.bind(this);
        this.DID_readProfile = this.DID_readProfile.bind(this);
        this.DID_updateProfile = this.DID_updateProfile.bind(this);

        this.AppCallBacks =
        {
            setIsConnected: this.setIsConnected,
            getWeb3Cnx: this.getWeb3Cnx,
            initAccounts: this.initAccounts,
            getAccounts: this.getAccounts,
            initContract: this.initContract,
            initUserDetails: this.initUserDetails,
            updateUserDetails: this.updateUserDetails,
            resetNavigateTo: this.resetNavigateTo,
            accountsUpdated: this.accountsUpdated,
            getUserEvents: this.getUserEvents,
            getUserDetails: this.getUserDetails,
            isConnected: this.isConnected,
            getRoleString: this.getRoleString,
            disconnect: this.disconnect,

            DID_init: this.DID_init,
            DID_showConf: this.DID_showConf,
            DID_readProfile: this.DID_readProfile,
            DID_updateProfile: this.DID_updateProfile
        }

        this.state = {
            web3: null,
            accounts: null,
            contract: null,
            isConnected: false,
            userRole: -1,
            roleUpdated: false,
            redirectTo: null,
            userDetails: null,
            userEvents: null
        }


    }

    setIsConnected = val => this.setState({ isConnected: val })
    isConnected = () => { return this.state.isConnected; }

    render() {
        let userProfile = { address: this.state.accounts, userDetails: this.state.userDetails, userEvents: this.state.userEvents }
        return (
            <BrowserRouter >
                <Routes>
                    <Route exact path='/' element=
                        {this.state.redirectTo === null ?
                            <Suspense fallback={<Loading />}>
                                <I18nextProvider i18n={i18next}>
                                    <LandingPage AppCallBacks={this.AppCallBacks} userProfile={userProfile} />
                                </I18nextProvider>
                            </Suspense>
                            :
                            <RedirectTo to={this.state.redirectTo} resetNavigateTo={this.resetNavigateTo} />
                        }

                    />
                    <Route exact path='organizer' element={this.state.redirectTo === null ?
                        <I18nextProvider i18n={i18next}>
                            <OrganizerMain AppCallBacks={this.AppCallBacks} userProfile={userProfile} />
                        </I18nextProvider>
                        :
                        <RedirectTo to={this.state.redirectTo} resetNavigateTo={this.resetNavigateTo} />
                    } />
                    <Route exact path='athlete' element={this.state.redirectTo === null ?
                        <Suspense fallback={<Loading />}>
                            <I18nextProvider i18n={i18next}>
                                <AthleteMain AppCallBacks={this.AppCallBacks} userProfile={userProfile} />
                            </I18nextProvider>
                        </Suspense>
                        :
                        <RedirectTo to={this.state.redirectTo} resetNavigateTo={this.resetNavigateTo} />
                    } />
                    <Route element={NotFound} />
                </Routes>
            </BrowserRouter >
        )

    } // render



    // Returns the Web3 provider
    getWeb3Cnx = async () => {
        var web3 = this.state.web3
        var err = null
        if (web3 === null)
            try {
                web3 = await getWeb3();
                this.setState({ web3 })
                let that = this
                window.ethereum.on('accountsChanged', async function (accounts) {
                    await that.accountsUpdated(accounts)
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
            console.log("result.detail=" + result.detail)
            // result.detail["account"] = account;
            // console.log("result.detail+account="+result.detail)
            this.setState({ userRole: result.detail.role })
            this.setState({ userDetails: result.detail })
            this.setState({ isConnected: true })

        }
        catch (err) {
            result.err = err
        }
        return result
    }

    // Redirect to the correct page after reading user details from contract
    updateUserDetails = async () => {
        let role = this.state.userRole
        if (role & ROLES.ROLE_ORGANIZER) // Organizer
            this.setState({ redirectTo: "/organizer" })
        else if (role & ROLES.ROLE_ATHLETE) // Athlete
        {
            let evnts = await this.getUserEvents()
            this.setState({
                userEvents: evnts,
                redirectTo: "/athlete"
            })
        }
        else if (role & ROLES.ROLE_AUTHOR) // Author
            this.setState({ redirectTo: "/author" })
        else this.setState({ redirectTo: "/" }) // Not registered
    }

    getRoleString = () => {
        let role = this.state.userRole
        if (role & ROLES.ROLE_ORGANIZER) return "Organisateur"
        else if (role & ROLES.ROLE_ATHLETE) // Sportsman
            return "Sportif"
        else if (role & ROLES.ROLE_AUTHOR) // Author
            return "Auteur"
    }
    disconnect = () => {
        this.setState({ userDetails: null, isConnected: false, userRole: 0 })
        this.setState({ redirectTo: "/" })
    }

    getUserDetails = () => {
        return this.state.userDetails
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
        await this.updateUserDetails()
    }

    /* Retourne la structure complete des évènements auxquels un user appartient */
    getUserEvents = async () => {
        let account = this.getAccounts()
        let result = { nbEvents: 0, Event: null }
        // We get the nb of events the sporsman registered to
        result.nbEvents = await this.state.contract.methods.getSportsManEventsNumber(account).call()
        if (result.nbEvents > 0) {
            // We get the list of events the sporsman registered to
            let eventIndxList = await this.state.contract.methods.getSportsmanEventsSubscriptions(account).call()
            if (eventIndxList.length > 0) {
                result.eventList = []
                result.organisationDesc = []
                // We now populate the structure
                for (let i = 0; i < result.nbEvents; i++) {
                    let val = await this.state.contract.methods.getEvent(eventIndxList[i]).call()
                    result.eventList.push(val)
                    let organisationDesc = await this.state.contract.methods.getOrganizationsList(val.organizedBy, val.organizedBy).call()
                    result.organisationDesc.push(organisationDesc)
                }
                return result
            }

        }
        return null;
    }

    DID_init = async () => {
        await DID_init(this.state.web3, window.ethereum)
    } // DID_init

    DID_showConf = () => {
        DID_showConf();
    } // DID_showConf

    DID_readProfile = async () => {
        await DID_readProfile()
    } // DID_readProfile

    DID_updateProfile = async (data) => {
        await DID_updateProfile(data)
    } // DID_updateProfile

    /*
                await DID_init(this._web3, window.ethereum)
                DID_showConf();
                DID_readProfile();

*/
    handleSaveUserProfile = async (profile) => {
        try {
            console.log("App::handleSaveUserProfile name=" + profile.name)
            return await this.DID_updateProfile(profile)
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            this.handleError(error, true)
        } // catch

    } // handleSaveUserProfile

    handleOrganizerSaveProfile = async (profile) => {
        this.handleSaveUserProfile(profile)
    } // handleOrganizerSaveProfile

}

export default App;