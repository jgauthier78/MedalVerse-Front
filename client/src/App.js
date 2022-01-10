// React
import /*React,*/ { Component, Suspense } from "react";

// Components
import Loading from './components/Loading';
import NotFound from "./components/Pages/NotFound"
import Gallerie from "./components/Pages/Gallerie"
import LandingPage from "./components/Pages/LandingPage"
import OrganizerMain from "./components/Pages/OrganizerMain";
import AthleteMain from "./components/Pages/AthleteMain";
import RedirectTo from "./components/UIElements/RedirectTo";
import { Alerts } from "./components/Alerts";

// React router
import { BrowserRouter, Route, Routes } from 'react-router-dom'


// Translation
// import i18n (needs to be bundled ;))
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import './utils/i18n';

// Web3
import getWeb3 from "./utils/getWeb3";

// Contracts
import MedalVerseContract from "./contracts/MedalVerse.json";
import ThrowInContract from "./contracts/ThrowIn.json";
// import NFTArtist from "./contracts/NFTArtist.json";

// CONSTS
import { ROLES } from "./utils/roles_CONSTS"

// Utils
import { format_TimeMsToDate } from './utils/dateUtils'
import { DID_init, DID_readProfile, DID_updateProfile, DID_showConf } from './utils/did'

// CSS
import "./styles/Main.css"

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
            getAthleteEvents: this.getAthleteEvents,
            getUserMedals: this.getUserMedals,
            getOrganizerOrganisations: this.getOrganizerOrganisations,
            getUserDetails: this.getUserDetails,
            adminSetWinner: this.adminSetWinner,
            adminAddMedal: this.adminAddMedal,
            createNFT: this.createNFT,

            isConnected: this.isConnected,
            disconnect: this.disconnect,

            Event_getState: this.Event_getState,
            Event_changeStateToCompetitionInProgress: this.Event_changeStateToCompetitionInProgress,
            Event_changeStateToRewardDistribution: this.Event_changeStateToRewardDistribution,
            Event_setWinner: this.Event_setWinner,
            Event_changeStateToRewardDistributed: this.Event_changeStateToRewardDistributed,

            DID_init: this.DID_init,
            DID_showConf: this.DID_showConf,
            DID_readProfile: this.DID_readProfile,
            DID_updateProfile: this.DID_updateProfile,

            MedalVerse_SetEventHandler: this.MedalVerse_SetEventHandler,
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
            // console.log("result.detail=" + result.detail)
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
            let evnts = await this.getAthleteEvents(this.getAccounts())
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
    getAthleteEvents = async (account) => {
        let result = { nbEvents: 0, Event: null }
        // We get the nb of events the sporsman registered to
        let nbEvents = await this.state.contract.methods.getSportsManEventsNumber(account).call()
        if (nbEvents > 0)
        {
            result.nbEvents = nbEvents
            // We get the list of events the sporsman registered to
            let eventIndxList = await this.state.contract.methods.getSportsmanEventsSubscriptions(account).call()
            if (eventIndxList.length > 0)
            {
                result.eventList = []
                result.organisationDesc = []
                // We now populate the structure
                await Promise.all(eventIndxList.map(async (eventId, idx) =>
                {
                    // console.log(eventIndxList[idx])
                    // let val = await this.state.contract.methods.getEvent(eventIndxList[i]).call()
                    // result.eventList.push(val)
                    result.eventList[idx] = await this.state.contract.methods.getEvent(eventIndxList[idx]).call()
                    // let organisationDesc = await this.state.contract.methods.getOrganizationsList(val.organizedBy, val.
                    //     organizedBy).call()
                    // result.organisationDesc.push(organisationDesc)
                    result.organisationDesc[idx] = await this.state.contract.methods.getOrganizationsList(result.eventList[idx].organizedBy, result.eventList[idx].organizedBy).call()
                })) // await Promise.all
            }
        }
        return result;
    }

    getUserMedals = async (account) => {
        let result = { nbMedals: 0, nbMedalsInGallery: 0, Medals: [], Gallery: [], uriList: [], nftDesc: [] }
        result.nbMedals = await this.state.contract.methods.getSportsmanMedalCount(account).call()
        // for (let i = 0; i < result.nbMedals; i++) {

        let numbersArray = Array.from( Array( parseInt(result.nbMedals, 10) ).keys())
        await Promise.all(numbersArray.map(async (_, idx) =>
        {
            let medalID = await this.state.contract.methods.getSportsmanMedal(account, idx).call()
            let medal = { success: null, org: null, event: null }
            medal.succes = await this.state.contract.methods.getMedal(medalID).call()
            medal.org = await this.state.contract.methods.getOrganizationName(medal.succes.organizationID).call()
            medal.event = await this.state.contract.methods.getEvent(medal.succes.eventID).call()
            let medalContract = await new this.state.web3.eth.Contract(ThrowInContract.abi, medal.succes.throwIn);

            // We get the list of winners for the medal
            let allWinners = await medalContract.methods.getAllWinners().call()
            // console.log("--------------")
            // console.log(allWinners)
            // console.log("--------------")
            let { 0: winnersString, 1: yearsOfVictory } = allWinners
            let nfdesc = {
                name: await medalContract.methods.name().call(),
                symbol: await medalContract.methods.symbol().call(),
                orgName: await medalContract.methods.getOrganizationName().call(),
                winnersString,
                yearsOfVictory,

            }
            result.nftDesc.push(nfdesc)
            // We get the uri of the medal
            let img = await medalContract.methods.uriToken(1).call()
            result.uriList.push(img)
            result.Medals.push(medal)

            if (medal.succes.isInWinnerGallery) {
                result.nbMedalsInGallery++
                result.Gallery.push(medal)
            }
        })) // await Promise.all
        return result
    }

    getOrganizerOrganisations = async () => {
        // console.log("getOrganizerOrganisations")
        let account = this.getAccounts()
        //let result = { organizations: null }
        const result = []
        // We get the list of organization the organizer subscribed to uint256[]
        let organisationList = await this.state.contract.methods.getOrganizerOrganisationList(account).call()
        // console.log("organisationList.length=" + organisationList.length)
        if (organisationList.length > 0) {
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
                        // console.log("eventsList:eventId=" + eventId)
                        let eventData = await this.state.contract.methods.getEvent(eventId).call()
                        // console.log("eventData:eventId=" + eventData.eventId)
                        let event = {
                            eventId: eventData.eventId,
                            sportCategory: eventData.sportCategory,
                            organizedBy: eventData.organizedBy,
                            registeredSportsMan: eventData.registeredSportsMan,
                            winner: eventData.winner,
                            startDate: eventData.startDate,
                            endDate: eventData.startDate,
                            medalID: eventData.medalID,
                            eventDescription: eventData.eventDescription,
                            hasMedal: eventData.hasMedal,
                            activ: eventData.activ,
                            ended: eventData.ended,
                            started: eventData.started,
                            stateOfCompetition: await this.Event_getState(eventId), // eventData.stateOfCompetition, <- undefined
                            // -> crée une référence circulaire
                            organization: organization
                        }
                        //  console.log("event="+JSON.stringify(event))
                        //  console.log("stateOfCompetition="+event.stateOfCompetition)
                        // Medal data
                        let throwIn = {}
                        let medalData = await this.state.contract.methods.getMedal(event.medalID).call()
                        // ThrowIn contract data
                        throwIn.address = medalData.throwIn
                        throwIn.winner = medalData.winner
                        throwIn.isInWinnerGallery = medalData.isInWinnerGallery
                        // throwIn.status = await this.ThrowIn_getStatus(throwIn.address)
                        // console.log("throwIn.status ="+throwIn.status )
                        // Set
                        event.throwIn = throwIn

                        // Add event to organization
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
        // console.log("App::adminSetWinner: eventId=" + eventId + " athleteAdr=" + athleteAdr + " this.getAccounts()=" + this.getAccounts())
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
        // console.log("App::adminAddMedal: eventId=" + eventId + " this.getAccounts()=" + this.getAccounts())
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
        // console.log("App::createNFT: ")
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

    // -----------------------------------------------------
    // ThrowIn Methods

    // ThrowIn_getInstance : caches contract instances
    ThrowIn_getInstance = async (ThrowInContractAddress) => {
        // console.log("App::ThrowIn_getInstance:ThrowInContractAddress="+ThrowInContractAddress)
        if (this.ThrowIn_getInstance.instances === undefined) {
            // console.log("ThrowIn_getInstance.instances === undefined")
            this.ThrowIn_getInstance.instances = []
        }
        // console.log("this.ThrowIn_getInstance.instances="+this.ThrowIn_getInstance.instances)
        // console.log("this.ThrowIn_getInstance.instances[ThrowInContractAddress]="+this.ThrowIn_getInstance.instances[ThrowInContractAddress])
        if (this.ThrowIn_getInstance.instances[ThrowInContractAddress] === undefined) {
            // console.log("UNDEFINED INSTANCE")
            // console.log("create instance")
            this.ThrowIn_getInstance.instances[ThrowInContractAddress] = await new this.state.web3.eth.Contract(ThrowInContract.abi, ThrowInContractAddress);
        }
        // else
        // {
        //     console.log("INSTANCE en 'cache'")
        // }

        // console.log("this.ThrowIn_getInstance.instances[ThrowInContractAddress]=" + JSON.stringify( this.ThrowIn_getInstance.instances[ThrowInContractAddress] ) )
        return this.ThrowIn_getInstance.instances[ThrowInContractAddress]

        /*
        const medalContract = await new this.state.web3.eth.Contract(ThrowInContract.abi, ThrowInContractAddress);
        // console.log("App::ThrowIn_getInstance:medalContract.options.address="+medalContract.options.address)
        return medalContract
        */
    }

    Event_getState = async (eventId) => {
        let val = await this.state.contract.methods.getEventCurrentState(eventId).call()
        const status_val = parseInt(val, 10)
        // console.log("Event_getState:status_val=" + status_val)
        return status_val
    }

    // 
    Event_changeStateToCompetitionInProgress = async (eventId) => {
        // console.log("App::Event_changeStateToCompetitionInProgress: eventId=" + eventId)
        await this.state.contract.methods.adminStartEvent(eventId).send({ from: this.getAccounts() })
        // Event
    }

    Event_changeStateToRewardDistribution = async (eventId) => {
        // console.log("App::Event_changeStateToRewardDistribution: eventId=" + eventId)
        await this.state.contract.methods.adminEndEvent(eventId).send({ from: this.getAccounts() })
        // Event
    }

    Event_setWinner = async (eventId, winnerAddress) => {
        console.log("App::Event_setWinner: event.eventId=" + eventId+" winnerAddress="+winnerAddress)
        const connectedAccount = this.getAccounts();
        await this.state.contract.methods.adminSetWinner(eventId, winnerAddress).send({ from: connectedAccount })
    }

    Event_changeStateToRewardDistributed = async (eventId) => {
        console.log("App::Event_changeStateToRewardDistributed: eventId=" + eventId)
        const connectedAccount = this.getAccounts();
        await this.state.contract.methods.adminGiveMedalToWinner(eventId).send({ from: connectedAccount })
    }

    getEventData = async (eventId, organization) => {

        // Update event
        let eventData = await this.state.contract.methods.getEvent(eventId).call()
        // console.log("eventData:eventId=" + eventData.eventId)
        let event = {
            eventId: eventData.eventId,
            sportCategory: eventData.sportCategory,
            organizedBy: eventData.organizedBy,
            registeredSportsMan: eventData.registeredSportsMan,
            winner: eventData.winner,
            startDate: eventData.startDate,
            endDate: eventData.startDate,
            medalID: eventData.medalID,
            eventDescription: eventData.eventDescription,
            hasMedal: eventData.hasMedal,
            activ: eventData.activ,
            ended: eventData.ended,
            started: eventData.started,
            stateOfCompetition: await this.Event_getState(eventId), // eventData.stateOfCompetition, <- undefined
            // -> crée une référence circulaire
            organization: organization
            }

        //  console.log("stateOfCompetition="+event.stateOfCompetition)
        // Medal data
        let throwIn = {}
        let medalData = await this.state.contract.methods.getMedal(event.medalID).call()
        // ThrowIn contract data
        throwIn.address = medalData.throwIn
        throwIn.winner = medalData.winner
        throwIn.isInWinnerGallery = medalData.isInWinnerGallery
        // throwIn.status = await this.ThrowIn_getStatus(throwIn.address)
        // console.log("throwIn.status ="+throwIn.status )
        // Set
        event.throwIn = throwIn

        return event
    } // getEventData

    updateOrganizerEvent = async (eventId, organization) => {
        let updatedEvent = await this.getEventData(eventId, organization)
        let userOrganizationEvents = organization.events
        for (let userOrgEventIdx=0; userOrgEventIdx < userOrganizationEvents.length; userOrgEventIdx++)
        {
            if (organization.events[userOrgEventIdx].eventId === eventId)
            {
                organization.events[userOrgEventIdx] = updatedEvent
                break
            } // if
        } // for
        // Update state
        let userOrganizations = this.state.userOrganizations        
        const newUserOrganizations = [...userOrganizations]
        this.setState({ userOrganizations: newUserOrganizations })
    }

    updateOrganizationsEventOnEvent = async (eventId, organizations) => {
        // REFRESH DATA
        console.log("eventId=" + eventId)

        if (organizations===undefined)
        { console.error("App::updateOrganizationsEventOnEvent:organizations===undefined") }
        if (eventId===undefined)
        { console.error("App::updateOrganizationsEventOnEvent:eventId===undefined") }

        for (let orgIdx=0; orgIdx < organizations.length; orgIdx++)
        {
            let organization = organizations[orgIdx]
            console.log("organizations.id=" + organization.id)
            let organizationEvents = organization.events
            for (let userOrgEventIdx=0; userOrgEventIdx < organizationEvents.length; userOrgEventIdx++)
            {
                let userOrganizationEvent = organizationEvents[userOrgEventIdx]
                console.log("organizations.eventId=" + userOrganizationEvent.eventId)

                if (eventId===userOrganizationEvent.eventId)
                {
                    // Update event
                    this.updateOrganizerEvent(userOrganizationEvent.eventId, organization)
                    break
                } // eventId===userOrganizationEvent.eventId
            } // for userOrgEventIdx
        } // for organizations
            
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

    // -------------------------------------------------------------------------------------

    MedalVerse_SetEventHandler = (_eventID) => {
        // console.log("App::MedalVerse_SetEventHandler:_eventID=" + _eventID)
        // const connectedAccountAddr = this.getAccounts()
        const medalVerseContractInstance = this.state.contract
        //   const { t } = this.props;

        let eventID = parseInt(_eventID)
        if (isNaN(eventID)) {
            const error = "MedalVerse_SetEventHandler:eventID is not a number"
            console.log(error)
            throw error
        }
        if (medalVerseContractInstance === undefined) {
            const error = "MedalVerse_SetEventHandler:medalVerseContractInstance is undefined"
            console.log(error)
            throw error
        }


        // Mise en place du handler pour les évènements du contrat
        // https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#events-allevents

        if (medalVerseContractInstance.medalVerseContractEvents === undefined) {
            var medalVerseContractEvents = medalVerseContractInstance.events.allEvents
                (
                    { fromBlock: 'latest' },
                    (error, result) => {
                        if (error) {
                            console.error("medalVerseContractInstance: %s error: %s", medalVerseContractInstance.options.address, error);
                            alert(error)
                        }
                        else {
                            console.log("medalVerseContractInstance: %s result: " + JSON.stringify(result), medalVerseContractInstance.options.address);
                        }
                    }
                ); // erc20ContractInstance.events.allEvents

            // Set property to avoid creating event handler twice
            medalVerseContractInstance.medalVerseContractEvents = medalVerseContractEvents;

            medalVerseContractEvents.on('data', event => {
                // alert("event.event=" + event.event)
                // Event
                if (event.event === "eventStatusChanged")
                {
                    console.log("eventStatusChanged")
                    console.log("event.returnValues= " + event.returnValues);
                    let userOrganizations = this.state.userOrganizations
                    // REFRESH DATA
                    if (event.returnValues===undefined)
                    { console.error("App::MedalVerse_SetEventHandler:medalVerseContractEvents.on('data':eventStatusChanged:event.returnValues===undefined") }
                    this.updateOrganizationsEventOnEvent( event.returnValues.eventID, userOrganizations)
                }
                else if ( event.event === "eventWinnerSet" )
                {
                    console.log("eventStatusChanged")
                    console.log("event.returnValues= " + event.returnValues);
                    let userOrganizations = this.state.userOrganizations
                    // REFRESH DATA
                    if (event.returnValues===undefined)
                    { console.error("App::MedalVerse_SetEventHandler:medalVerseContractEvents.on('data':eventWinnerSet:event.returnValues===undefined") }
                    this.updateOrganizationsEventOnEvent( event.returnValues.eventID, userOrganizations)
                }
                else if ( event.event === "MedalAdded" )
                {
                    console.log("MedalAdded")
                }
                else if ( event.event === "sportsmanMedalAdded" )
                {
                    console.log("sportsmanMedalAdded")
                }
                else if ( event.event === "sportsmanUnregisterdEvent" )
                {
                    console.log("sportsmanUnregisterdEvent")
                }
                else if ( event.event === "sportsmanRegisterdEvent" )
                {
                    console.log("sportsmanRegisterdEvent")
                }
                else if ( event.event === "sportsmanAdded" )
                {
                    console.log("sportsmanAdded")
                }
                else
                {
                    console.error("Unknown event : %s", event.event)
                }

            }); // medalVerseContractEvents.on

        } // erc20ContractInstance.medalVerseContractEvents === undefined

    }; // MedalVerse_SetEventHandler


} // class App

export default App;
