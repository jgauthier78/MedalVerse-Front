import React, { Component, Suspense } from "react";
import Loading from './components/Loading';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import getWeb3 from "./utils/getWeb3";
import NotFound from "./components/Pages/NotFound"
import Gallerie from "./components/Pages/Gallerie"
import LandingPage from "./components/Pages/LandingPage"
import MedalVerseContract from "./contracts/MedalVerse.json";
import OrganizerMain from "./components/Pages/OrganizerMain";
import AthleteMain from "./components/Pages/AthleteMain";
import RedirectTo from "./components/UIElements/RedirectTo";
import "./styles/Main.css"
import { ROLES } from "./utils/roles_CONSTS"
import { DID_init, DID_readProfile, DID_updateProfile, DID_showConf } from './utils/did'
import { Alerts } from "./components/Alerts";
import ThrowInContract from "./contracts/ThrowIn.json";
import { format_TimeMsToDate } from './utils/dateUtils'
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
            getContract: this.getContract,
            initContract: this.initContract,
            initUserDetails: this.initUserDetails,
            updateUserDetails: this.updateUserDetails,
            resetNavigateTo: this.resetNavigateTo,
            accountsUpdated: this.accountsUpdated,
            getUserEvents: this.getUserEvents,
            getUserMedals: this.getUserMedals,
            getOrganizerOrganisations: this.getOrganizerOrganisations,
            getUserDetails: this.getUserDetails,
            adminSetWinner: this.adminSetWinner,
            adminAddMedal: this.adminAddMedal,
            createNFT: this.createNFT,

            isConnected: this.isConnected,
            // getRoleString: this.getRoleString,
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
            userMedals: null,
            userEvents: null,
            userOrganizations: null,
            // Misc.
            //  - Alerts
            alertsList: []
        }


    }

    setIsConnected = val => this.setState({ isConnected: val })
    isConnected = () => { return this.state.isConnected; }
    getContract = () => { return this.state.contract }

    cloneStruct = (stct) => {
        return JSON.parse(JSON.stringify(stct))
    }
    render() {
        let userProfile = { address: this.state.accounts, userDetails: this.state.userDetails, userEvents: this.state.userEvents, userOrganizations: this.state.userOrganizations, userMedals: this.state.userMedals, web3: this.state.web3 }
        return (
            <BrowserRouter >
                <Alerts alertsList={this.state.alertsList} />
                <Routes>
                    <Route exact path="/Gallerie/:id" element={

                        <Suspense fallback={<Loading />} >
                            <I18nextProvider i18n={i18next}>
                                <Gallerie AppCallBacks={this.AppCallBacks} />
                            </I18nextProvider>
                        </Suspense>
                    }
                    />
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
                    <Route exact path='organizer/*' element={this.state.redirectTo === null ?
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
    initUserDetails = async (account) => {
        let result = { detail: null, err: null }
        try {
            // call the contract method to get infos about user
            result.detail = await this.state.contract.methods.getUserDetails(account).call()
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
        // this.setState({ redirectTo: "/organizer" })
        {
            let organizations = await this.getOrganizerOrganisations()
            this.setState({
                userOrganizations: organizations,
                redirectTo: "/organizer"
            })
        }
        else if (role & ROLES.ROLE_ATHLETE) // Athlete
        {
            let evnts = await this.getUserEvents(this.getAccounts())
            let usermedals = await this.getUserMedals(this.getAccounts())
            this.setState({
                userEvents: evnts,
                userMedals: usermedals,
                redirectTo: "/athlete"
            })
        }
        else if (role & ROLES.ROLE_AUTHOR) // Author
            this.setState({ redirectTo: "/author" })
        else this.setState({ redirectTo: "/" }) // Not registered
    }
    /*
        getRoleString = () => {
            let role = this.state.userRole
            if (role & ROLES.ROLE_ORGANIZER) return "Organisateur"
            else if (role & ROLES.ROLE_ATHLETE) // Sportsman
                return "Sportif"
            else if (role & ROLES.ROLE_AUTHOR) // Author
                return "Auteur"
        }
    */
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
        await this.initUserDetails(account)
        // redirect to the right page
        await this.updateUserDetails()
    }

    /* Retourne la structure complete des évènements auxquels un user appartient */
    // devrait être appelée get(Athlete|Sportsman)Events ?
    getUserEvents = async (account) => {
        let result = { nbEvents: 0, Event: null }
        // We get the nb of events the sporsman registered to
        console.log("+++Ici")
        let nbEvents = await this.state.contract.methods.getSportsManEventsNumber(account).call()
        if (nbEvents > 0) {
            result.nbEvents = nbEvents
            // We get the list of events the sporsman registered to
            let eventIndxList = await this.state.contract.methods.getSportsmanEventsSubscriptions(account).call()
            if (eventIndxList.length > 0) {
                result.eventList = []
                result.organisationDesc = []
                // We now populate the structure
                console.log("+++++Ici")
                for (let i = 0; i < result.nbEvents; i++) {

                    console.log(eventIndxList[i])
                    let val = await this.state.contract.methods.getEvent(eventIndxList[i]).call()

                    result.eventList.push(val)
                    let organisationDesc = await this.state.contract.methods.getOrganizationsList(val.organizedBy, val.
                        organizedBy).call()

                    result.organisationDesc.push(organisationDesc)
                }
            }
        }

        return result;
    }

    getUserMedals = async (account) => {
        let result = { nbMedals: 0, nbMedalsInGallery: 0, Medals: [], Gallery: [], uriList: [] }
        result.nbMedals = await this.state.contract.methods.getSportsmanMedalCount(account).call()
        for (let i = 0; i < result.nbMedals; i++) {

            let medalID = await this.state.contract.methods.getSportsmanMedal(account, i).call()
            let medal = { success: null, org: null, event: null }
            medal.succes = await this.state.contract.methods.getMedal(medalID).call()
            medal.org = await this.state.contract.methods.getOrganizationName(medal.succes.organizationID).call()
            medal.event = await this.state.contract.methods.getEvent(medal.succes.eventID).call()


            let medalContract = await new this.state.web3.eth.Contract(ThrowInContract.abi, medal.succes.throwIn);
            let img = await medalContract.methods.uriToken(1).call()
            result.uriList.push(img)
            result.Medals.push(medal)

            if (medal.succes.isInWinnerGallery) {
                result.nbMedalsInGallery++
                result.Gallery.push(medal)
            }
        }

        return result
    }

    getOrganizerOrganisations = async () => {
        // console.log("getOrganizerOrganisations")
        let account = this.getAccounts()
        //let result = { organizations: null }
        let result = []
        // We get the list of organization the organizer subscribed to uint256[]
        let organisationList = await this.state.contract.methods.getOrganizerOrganisationList(account).call()
        // console.log("organisationList.length=" + organisationList.length)
        if (organisationList.length > 0) {
            // result.organizations = [];
            // For each organization this organizer belongs to

            await Promise.all(organisationList.map(async (organisationId) => {
                // console.log("organisationId=" + organisationId)
                let organization = {};
                // Load ONE organization details
                let organizationList = await this.state.contract.methods.getOrganizationsList(organisationId, organisationId).call()
                // console.log("organizationList="+ JSON.stringify( organizationList ) )
                organization["id"] = organisationId
                organization["name"] = organizationList[0][0]
                organization["description"] = organizationList[0][1]
                organization["logoURI"] = organizationList[0][2]
                organization["activ"] = organizationList[0][3]
                organization["admins"] = []
                organization["events"] = []
                // console.log("organization[]="+ JSON.stringify( organization ) )
                // Load organization admins ids list uint256[]
                let adminsList = await this.state.contract.methods.getAdminList(organisationId).call()
                if (adminsList.length > 0) {
                    // For each admin
                    adminsList.forEach(adminId => {
                        // console.log("adminId=" + adminId)
                        organization["admins"].push({ id: adminId })
                    }); // For each admin
                }
                let eventsList = await this.state.contract.methods.getEventList(organisationId).call()
                // console.log("eventsList.length=" + eventsList.length)
                if (eventsList.length > 0) {
                    await Promise.all(eventsList.map(async (eventId) => {
                        // console.log("eventId=" + eventId)
                        let eventData = await this.state.contract.methods.getEvent(eventId).call()
                        //  console.log("eventData=" + eventData)
                        //  console.log("eventData[0]=" + eventData[0]) 
                        //  console.log("eventData[1]=" + eventData[1]) 
                        //  console.log("eventData[2]=" + eventData[2]) 
                        //  console.log("eventData[3]=" + eventData[3]) 
                        //  console.log("eventData[4]=" + eventData[4]) 
                        //  console.log("eventData[5]=" + eventData[5]) 
                        //  console.log("eventData[6]=" + eventData[6]) 
                        //  console.log("eventData[7]=" + eventData[7]) 
                        //  console.log("eventData[8]=" + eventData[8]) 
                        //  console.log("eventData[9]=" + eventData[9]) 
                        //  console.log("eventData[10]=" + eventData[10]) 
                        //  console.log("eventData[11]=" + eventData[11]) 
                        let event = {
                            eventId: eventData[0],
                            sportCategory: eventData[1],
                            organizedBy: eventData[2],
                            registeredSportsMan: eventData[3],
                            winner: eventData[4],
                            startDate: eventData[5],
                            endDate: eventData[6],
                            medalID: eventData[7],
                            hasMedal: eventData[8],
                            activ: eventData[9],
                            ended: eventData[10],
                            started: eventData[11],
                            // struct EventDesc {
                            // uint256 eventId; // Index of the event in the EventList
                            // uint256 sportCategory; // Category
                            // uint256 organizedBy; // Id of the Organization
                            // address[] registeredSportsMan; //List of sportsman that are participating to the event
                            // address winner; // Winner of the Event
                            // uint256 startDate;
                            // uint256 endDate;
                            // uint256 medalID;
                            // bool hasMedal;
                            // bool activ;
                            // bool ended; // finished ?
                            // bool started; // The event has started
                            // on rattache l'organisation à chaque event pour faciliter le traitement dans les composants
                            // ! crée une référence circulaire !
                            organization: organization
                        }
                        // console.log("event=" + JSON.stringify(event) )
                        organization["events"].push(event)
                    }));
                } // eventsList.length > 0

                // console.log("organization[" + organisationId + "]=" + JSON.stringify(organization))
                // return organization
                //result.organizations.push( organization )
                result.push(organization)
            }));
        }
        return result;
    } // getOrganizerOrganisations

    adminSetWinner = async (eventId, athleteAdr) => {
        console.log("App::adminSetWinner: eventId=" + eventId + " athleteAdr=" + athleteAdr + " this.getAccounts()=" + this.getAccounts())
        try {
            await this.state.contract.methods.adminSetWinner(eventId, athleteAdr).send({ from: this.getAccounts() })
            // Todo
            // Refresh data
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            this.handleError(error, true)
        } // catch
    } // adminSetWinner

    adminAddMedal = async (eventId) => {
        console.log("App::adminAddMedal: eventId=" + eventId + " this.getAccounts()=" + this.getAccounts())
        try {
            // Create NFT
            // await this.createNFT()
            let adressNFT = 0
            await this.state.contract.methods.adminAddMedal(eventId, adressNFT).send({ from: this.getAccounts() })
            // Todo
            // Refresh data
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            this.handleError(error, true)
        } // catch
    } // adminAddMedal

    createNFT = async (/*Todo params*/) => {
        console.log("App::createNFT: ")
        try {
            // Create NFT
            await this.state.contract.methods.todo(/*Todo params*/).send({ from: this.getAccounts() })
            // Todo
            // Refresh data
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            this.handleError(error, true)
        } // catch
    } // adminAddMedal

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



    /* ************************************
      errorHandlers
    
     ************************************* */
    /* -------------------------------
      Smart contract errors
     -------------------------------- */

    handleError = (error, bLogToConsole, bshowAlertPopup) => {
        // const { t } = this.props;
        const { alertsList } = this.state;
        let newAlert = {}

        let now = new Date();
        // newAlert.time = now.toLocaleDateString(t("Formats.date")) + " " +
        //   new Intl.DateTimeFormat(t("Formats.date"), { hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" }).format()
        newAlert.time = format_TimeMsToDate(now)

        if (bLogToConsole) {
            console.error(error);
        }
        if (bshowAlertPopup) {
            //alert(t("Errors.default.title") + "\n" + error)
            alert("Error\n" + error)
            return
        }

        if (error.code !== undefined) {

            //   if (error.code === 4001) {
            //     newAlert.title = t("Errors.4001.title")
            //     newAlert.variant = t("Errors.4001.variant")
            //     newAlert.message = t("Errors.4001.message")
            //   } // 4001
            //   else {
            //     newAlert.title = t("Errors.default.title")
            //     newAlert.variant = t("Errors.default.variant")
            //     newAlert.message = t("Errors.default.message")
            //   } // default

            if (error.message !== undefined) {
                // newAlert.detail = truncateString(error.message, 50)
                newAlert.detail = error.message
            } // switch (error.code)
        }
        else {

            if (error.title !== undefined) {
                newAlert.title = error.title
            }
            else {
                newAlert.title = "Error"//t("Errors.default.title")
            }

            if (error.level !== undefined) {
                newAlert.variant = error.level
            }
            else {
                newAlert.variant = "danger"//t("Errors.default.variant")
            }

            if (error.message !== undefined) {
                newAlert.message = error.message;
            } // error.message !== undefined
            else {
                newAlert.message = "Error"//t("Errors.default.message")
            }
            //  newAlert.detail = truncateString(error, 100)
            newAlert.detail = error.message
        } // else

        const alertsListUpdated = [...alertsList, newAlert]
        this.setState({ alertsList: alertsListUpdated })

    } // handleError

} // class App

export default App;
