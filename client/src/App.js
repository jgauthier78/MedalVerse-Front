// React
import /*React,*/ { Component, Suspense } from "react";

// Components
import Loading from './components/Loading';
import Gallerie from "./components/Pages/Gallerie"
import LandingPage from "./components/Pages/LandingPage"
import OrganizerMain from "./components/Pages/OrganizerMain";
import AthleteMain from "./components/Pages/AthleteMain";
import RedirectTo from "./components/UIElements/RedirectTo";

// React router
import { BrowserRouter, Route, Routes, UNSAFE_LocationContext } from 'react-router-dom'

// Toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Translation
// import i18n (needs to be bundled ;))
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import './utils/i18n';

// Web3
// For Metamask : User-interactions
import getWeb3 from "./utils/getWeb3";
// For events
import Web3 from 'web3'

// Contracts
import MedalVerseContract from "./contracts/MedalVerse.json";
import ThrowInContract from "./contracts/ThrowIn.json";
// import NFTArtist from "./contracts/NFTArtist.json";

// CONSTS
import { ROLES } from "./utils/roles_CONSTS"

// Utils
import { format_TimeMsToDate } from './utils/dateUtils'
import { truncateString } from './utils/AppUtils'
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
            toastId: 0, // Toasts unique id
            param: 0
        }


    } // constructor

    toast_options = {
        // autoClose: 2000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_LEFT,
        pauseOnHover: true,
        progress: undefined
    };

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
                <ToastContainer autoClose={60000} />
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
                                <AthleteMain AppCallBacks={this.AppCallBacks} userProfile={userProfile} param={this.state.param} />
                            </I18nextProvider>
                        </Suspense>
                        :
                        <RedirectTo to={this.state.redirectTo} resetNavigateTo={this.resetNavigateTo} />
                    } />

                    <Route component={
                        <RedirectTo to="/" resetNavigateTo={this.resetNavigateTo} />
                    } />
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

            // Second instance for contract interaction
            contract = await new web3.eth.Contract(MedalVerseContract.abi, deployedNetwork && deployedNetwork.address);

            // Second instance only for events
            const web3ForEvents = new Web3("wss://rpc-mumbai.maticvigil.com/ws/v1/" + process.env.REACT_APP_MATIC_MUMBAY_INFURA_PROJECT_ID ) // VAR DEFINED IN HEROKU CONFIG https://devcenter.heroku.com/articles/config-vars#managing-config-vars
            const medalVerseContractcontractInstanceForEvents = await new web3ForEvents.eth.Contract(MedalVerseContract.abi, deployedNetwork && deployedNetwork.address);

            if (contract.options.address === null || contract.options.address === undefined) {
                const nullContractWrongNetworkError = { title: "Contract not found", message: "Wrong network ?" }
                // window.location.reload(true);
                throw nullContractWrongNetworkError
            }
            this.setState({ contract: contract, contractEvents: medalVerseContractcontractInstanceForEvents })

        }
        catch (error) {
            // Catch any errors for any of the above operations.
            //err = error
            //console.log(err)
            this.showEvent(error, error, true, true)
        }
        return { contract, err }
    }

    // Get details corresponding to the user address
    initUserDetails = async (account) => {
        let result = { detail: null, err: null }
        try {
            // call the contract method to get infos about user
            if (this.state.contract !== null && this.state.contract !== undefined) {
                result.detail = await this.state.contract.methods.getUserDetails(account).call()
                // console.log("result.detail=" + result.detail)
                // result.detail["account"] = account;
                // console.log("result.detail+account="+result.detail)
                this.setState({ userRole: result.detail.role })
                this.setState({ userDetails: result.detail })
                this.setState({ isConnected: true })
            }
        }
        catch (err) {
            result.err = err
        }
        return result
    }

    // Redirect to the correct page after reading user details from contract
    updateUserDetails = async (val) => {
        let role = this.state.userRole
        if (role & ROLES.ROLE_ORGANIZER) // Organizer
        // this.setState({ redirectTo: "/organizer" })
        {
            let organizations = await this.getOrganizerOrganisations()
            this.setState({
                userOrganizations: organizations,
                redirectTo: "/organizer",
                param: val
            })
        }
        else if (role & ROLES.ROLE_ATHLETE) // Athlete
        {
            let evnts = await this.getAthleteEvents(this.getAccounts())
            let usermedals = await this.getUserMedals(this.getAccounts())
            this.setState({
                userEvents: evnts,
                userMedals: usermedals,
                redirectTo: "/athlete",
                param: val
            })
        }
        else if (role & ROLES.ROLE_AUTHOR) // Author
            this.setState({ redirectTo: "/author" })
        else this.setState({ redirectTo: "/" }) // Not registered
    }

    disconnect = () => {
        this.setState({ userDetails: null, isConnected: false, userRole: 0 })
        this.setState({ redirectTo: "/unknown" })
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
        try {
            // Directly set the state, as the callback gives us a pointer to new account
            this.setState({ accounts: account })
            // read new details from contract
            await this.initUserDetails(account)
            // redirect to the right page
            await this.updateUserDetails()
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            let accountsUpdatedError = { title: "Error updating account", message: "Error occured" }
            this.showEvent(accountsUpdatedError, error, true)
        } // catch
    }


    getAthleteEvents = async (account) => {
        let result = { nbEvents: 0, Event: null }
        try {
            if (this.state.contract !== null && this.state.contract !== undefined) {
                // We get the nb of events the sporsman registered to
                let nbEvents = await this.state.contract.methods.getSportsManEventsNumber(account).call()
                if (nbEvents > 0) {
                    result.nbEvents = nbEvents
                    // We get the list of events the sporsman registered to
                    let eventIndxList = await this.state.contract.methods.getSportsmanEventsSubscriptions(account).call()
                    if (eventIndxList.length > 0) {
                        result.eventList = []
                        result.organisationDesc = []
                        result.encoursEvent = []
                        result.encoursOrganisationDesc = []
                        result.nbEncours = 0
                        result.nbFini = 0
                        result.aVenir = 0

                        // We now populate the structure
                        await Promise.all(eventIndxList.map(async (eventId, idx) => {
                            // console.log(eventIndxList[idx])
                            // let val = await this.state.contract.methods.getEvent(eventIndxList[i]).call()
                            // result.eventList.push(val)
                            result.eventList[idx] = await this.state.contract.methods.getEvent(eventIndxList[idx]).call()
                            // let organisationDesc = await this.state.contract.methods.getOrganizationsList(val.organizedBy, val.
                            //     organizedBy).call()
                            // result.organisationDesc.push(organisationDesc)
                            result.organisationDesc[idx] = await this.state.contract.methods.getOrganizationsList(result.eventList[idx].organizedBy, result.eventList[idx].organizedBy).call()

                        })) // await Promise.all

                        for (let u = 0; u < eventIndxList.length; u++) {
                            if (result.eventList[u].started === true) {
                                if (result.eventList[u].ended === false) {
                                    result.encoursOrganisationDesc.push(result.organisationDesc[u])
                                    result.encoursEvent.push(result.eventList[u])
                                    result.nbEncours++;
                                }
                                else result.nbFini++
                            } else result.aVenir++
                        }
                    }
                }
            } // contract defined
        } // try
        catch (error) {
            // Catch any errors for any of the above operations.
            let getAthleteEventsError = { title: "Error loading", message: "Error occured while loading athlete events" }
            this.showEvent(getAthleteEventsError, error, true)
        } // catch

        return result
    }

    getUserMedals = async (account) => {
        try {
            let result = { nbMedals: 0, nbMedalsInGallery: 0, Medals: [], Gallery: [], uriList: [], nftDesc: [] }
            if (this.state.contract !== null && this.state.contract !== undefined) {
                result.nbMedals = await this.state.contract.methods.getSportsmanMedalCount(account).call()
                // for (let i = 0; i < result.nbMedals; i++) {

                let numbersArray = Array.from(Array(parseInt(result.nbMedals, 10)).keys())
                await Promise.all(numbersArray.map(async (_, idx) => {
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
            } // contract defined
            return result
        } // try
        catch (error) {
            // Catch any errors for any of the above operations.
            let getUserMedalsError = { title: "Error loading", message: "Error occured while loading athlete medals" }
            this.showEvent(getUserMedalsError, error, true)
        } // catch
    }

    getOrganizerOrganisations = async () => {
        try {
            // console.log("getOrganizerOrganisations")
            let account = this.getAccounts()
            //let result = { organizations: null }
            const result = []
            if (this.state.contract !== null && this.state.contract !== undefined) {
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
                                // console.log("getOrganizerOrganisations:eventsList:eventId=" + eventId)
                                let event = await this.getEventData(eventId, organization)
                                //  console.log("getOrganizerOrganisations:Object.entries(event)=" + Object.entries(event) )
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
            } // contract defined
            return result;
        } // try
        catch (error) {
            // Catch any errors for any of the above operations.
            let getOrganizerOrganisationsError = { title: "Error occured", message: "Error loading organizer events" }
            this.showEvent(getOrganizerOrganisationsError, error, true)
        } // catch
    } // getOrganizerOrganisations

    adminSetWinner = async (eventId, athleteAdr) => {
        // console.log("App::adminSetWinner: eventId=" + eventId + " athleteAdr=" + athleteAdr + " this.getAccounts()=" + this.getAccounts())
        try {
            await this.state.contract.methods.adminSetWinner(eventId, athleteAdr).send({ from: this.getAccounts() })
            /// Data refresh : Handled by event
        } // try
        catch (error) {
            // Catch any errors for any of the above operations.
            let adminSetWinnerError = { title: "Error occured", message: "Error setting winner" }
            this.showEvent(adminSetWinnerError, error, true)
        } // catch
    } // adminSetWinner

    adminAddMedal = async (eventId) => {
        // console.log("App::adminAddMedal: eventId=" + eventId + " this.getAccounts()=" + this.getAccounts())
        try {
            // Create NFT
            // await this.createNFT()
            let adressNFT = 0
            await this.state.contract.methods.adminAddMedal(eventId, adressNFT).send({ from: this.getAccounts() })
            // Data refresh : Handled by event
        } // try
        catch (error) {
            // Catch any errors for any of the above operations.
            let adminAddMedalError = { title: "Error occured", message: "Error medalling athlete" }
            this.showEvent(adminAddMedalError, error, true)
        } // catch
    } // adminAddMedal

    createNFT = async (/*Todo params*/) => {
        // console.log("App::createNFT: ")
        try {
            // Create NFT
            await this.state.contract.methods.todo(/*Todo params*/).send({ from: this.getAccounts() })
            // Data refresh : Handled by event
        } // try
        catch (error) {
            // Catch any errors for any of the above operations.
            let createNFTError = { title: "Error occured", message: "Error creating NFT" }
            this.showEvent(createNFTError, error, true)
        } // catch
    } // adminAddMedal

    // -----------------------------------------------------
    // ThrowIn Methods

    // ThrowIn_getInstance : caches contract instances
    ThrowIn_getInstance = async (ThrowInContractAddress) => {
        // console.log("App::ThrowIn_getInstance:ThrowInContractAddress="+ThrowInContractAddress)
        if (this.ThrowIn_getInstance.instances === undefined) {
            this.ThrowIn_getInstance.instances = []
        }
        if (this.ThrowIn_getInstance.instances[ThrowInContractAddress] === undefined) {
            this.ThrowIn_getInstance.instances[ThrowInContractAddress] = await new this.state.web3.eth.Contract(ThrowInContract.abi, ThrowInContractAddress);
        }
        // console.log("this.ThrowIn_getInstance.instances[ThrowInContractAddress]=" + JSON.stringify( this.ThrowIn_getInstance.instances[ThrowInContractAddress] ) )
        return this.ThrowIn_getInstance.instances[ThrowInContractAddress]

        /*
        const medalContract = await new this.state.web3.eth.Contract(ThrowInContract.abi, ThrowInContractAddress);
        // console.log("App::ThrowIn_getInstance:medalContract.options.address="+medalContract.options.address)
        return medalContract
        */
    } // ThrowIn_getInstance

    Event_getState = async (eventId) => {
        try {
            let val = await this.state.contract.methods.getEventCurrentState(eventId).call()
            const status_val = parseInt(val, 10)
            // console.log("Event_getState:status_val=" + status_val)
            return status_val
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            let eventGetStateError = { title: "Error occured", message: "Error getting event state" }
            this.showEvent(eventGetStateError, error, true)
        } // catch
    } // Event_getState

    // 
    Event_changeStateToCompetitionInProgress = async (eventId) => {
        try {
            console.log("App::Event_changeStateToCompetitionInProgress: eventId=" + eventId)
            await this.state.contract.methods.adminStartEvent(eventId).send({ from: this.getAccounts() })
            // Data refresh : Handled by event
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            let eventChangeStateToCompetitionInProgressError = { title: "Error occured", message: "Error promoting event state to 'In progress'" }
            this.showEvent(eventChangeStateToCompetitionInProgressError, error, true)
        } // catch
    } // Event_changeStateToCompetitionInProgress

    Event_changeStateToRewardDistribution = async (eventId) => {
        try {
            console.log("App::Event_changeStateToRewardDistribution: eventId=" + eventId)
            await this.state.contract.methods.adminEndEvent(eventId).send({ from: this.getAccounts() })
            // Data refresh : Handled by event
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            let eventChangeStateToRewardDistributionError = { title: "Error occured", message: "Error promoting event state to 'Rewards distribution'" }
            this.showEvent(eventChangeStateToRewardDistributionError, error, true)
        } // catch
    } // Event_changeStateToRewardDistribution

    Event_setWinner = async (eventId, winnerAddress) => {
        try {
            console.log("App::Event_setWinner: event.eventId=" + eventId + " winnerAddress=" + winnerAddress)
            const connectedAccount = this.getAccounts();
            await this.state.contract.methods.adminSetWinner(eventId, winnerAddress).send({ from: connectedAccount })
            // Data refresh : Handled by event
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            let eventSetWinnerError = { title: "Error occured", message: "Error nominating winner" }
            this.showEvent(eventSetWinnerError, error, true)
        } // catch
    }

    Event_changeStateToRewardDistributed = async (eventId) => {
        try {
            console.log("App::Event_changeStateToRewardDistributed: eventId=" + eventId)
            const connectedAccount = this.getAccounts();
            await this.state.contract.methods.adminGiveMedalToWinner(eventId).send({ from: connectedAccount })
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            let eventChangeStateToRewardDistributedError = { title: "Error occured", message: "Error promoting event state to Rewards distributed" }
            this.showEvent(eventChangeStateToRewardDistributedError, error, true)
        } // catch
    }

    getEventData = async (eventId, organization) => {
        let eventData = await this.state.contract.methods.getEvent(eventId).call()
        // console.log("getEventData:eventId=" + eventId + " eventData:eventId=" +  eventData.eventId)
        // console.log("getEventData:eventData: " + Object.entries(eventData))
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
            organization: organization // -> crée une référence circulaire ; ne pas utiliser JSON.stringify()
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
        // REFRESH DATA
        console.log("REFRESH DATA -> updateOrganizerEvent:eventId=" + eventId)
        let updatedEvent = await this.getEventData(eventId, organization)
        let userOrganizationEvents = organization.events
        for (let userOrgEventIdx = 0; userOrgEventIdx < userOrganizationEvents.length; userOrgEventIdx++) {
            if (organization.events[userOrgEventIdx].eventId === eventId) {
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
        console.log("REFRESH DATA -> updateOrganizationsEventOnEvent:eventId=" + eventId)
        if (organizations === undefined) { console.error("App::updateOrganizationsEventOnEvent:organizations===undefined") }
        if (eventId === undefined) { console.error("App::updateOrganizationsEventOnEvent:eventId===undefined") }

        for (let orgIdx = 0; orgIdx < organizations.length; orgIdx++) {
            let organization = organizations[orgIdx]
            // console.log("organizations.id=" + organization.id)
            let organizationEvents = organization.events
            for (let userOrgEventIdx = 0; userOrgEventIdx < organizationEvents.length; userOrgEventIdx++) {
                let userOrganizationEvent = organizationEvents[userOrgEventIdx]
                // console.log("organizations.eventId=" + userOrganizationEvent.eventId)

                if (eventId === userOrganizationEvent.eventId) {
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
            // console.log("App::handleSaveUserProfile name=" + profile.name)
            return await this.DID_updateProfile(profile)
        }
        catch (error) {
            // Catch any errors for any of the above operations.
            let saveUserProfileError = { title: "Error occured", message: "Error saving user profile" }
            this.showEvent(saveUserProfileError, error, true)
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
    /*
   { title : "Error occured", message: "Something weird happened", level: "warning" }
   { title : "Tudo bom", message: "Descontrair", level: "success" }
    */

    showEvent = (mvEvent, catchedError, bLogToConsole = false, bshowAlertPopup = false) => {
        // const { t } = this.props;
        // Default values
        let newEvent = { level: "error", title: "Error", message: "Error occured", dateTime: format_TimeMsToDate(new Date()) }
        let eventDisplayOptions = this.toast_options

        if (bLogToConsole) {
            console.error(mvEvent);
            console.error(catchedError);
        }
        if (bshowAlertPopup) {
            alert("Error : \n" + mvEvent.title + "\n" + mvEvent.message)
            return
        }
        if (mvEvent.title !== undefined) {
            newEvent.title = mvEvent.title
        }
        if (mvEvent.level !== undefined) {
            newEvent.level = mvEvent.level
        }

        newEvent.message = (mvEvent.message !== undefined && mvEvent.message.length > 0 ? mvEvent.message : "")

        // Extra error info.
        if (catchedError !== null && catchedError !== undefined && catchedError.code !== undefined) {
            // Metamask / Web3 errors
            // https://github.com/MetaMask/eth-rpc-errors/blob/main/src/error-constants.ts
            if (catchedError.code === 4001) {
                newEvent.detail = "User denied message signature" // t("Errors.RPC.4001.message")
                newEvent.additionnalDetails = truncateString(catchedError.message, 500)
            } // 4001
            else if (catchedError.code === 4100) {
                newEvent.detail = "Unauthorized"
            } // 4100
            else if (catchedError.code === 4900) {
                newEvent.detail = "Disconnected"
            } // 4900
            //
            else if (catchedError.code === -32003) {
                newEvent.detail = "Transaction rejected"
            } // -32003
            else if (catchedError.code === -32603) {
                newEvent.detail = "Internal error"
                newEvent.additionnalDetails = truncateString(catchedError.message, 500)
            } // -32603
            //
            else if (catchedError.code === -4900) {
                newEvent.detail = "The provider is disconnected from all chains"
            } // -4900
            else if (catchedError.code === -4901) {
                newEvent.detail = "he provider is disconnected from the specified chain"
            } // -4901
            //
            else {
                newEvent.detail = "Transaction error"
                newEvent.additionnalDetails = truncateString(catchedError.message, 500)
                // error
            } // default
        }

        // Increment toastId
        this.setState((prevState/*, props*/) => {
            return { toastId: prevState.toastId++ }
        })

        switch (newEvent.level) {
            case 'info':
                toast.info(<div style={{ padding: '0px' }}>
                    <p style={{ marginBottom: 0, fontWeight: 'lighter', fontSize: 'small', padding: '0px' }}>{newEvent.dateTime}</p>
                    <p style={{ marginBottom: 0, fontWeight: 'bold', padding: '0px' }}>{newEvent.title}</p>
                    <p style={{ marginBottom: 0, padding: '0px', fontSize: 'small' }}>{newEvent.message}</p>
                    {(newEvent.detail !== null && newEvent.detail !== undefined && newEvent.detail.length !== undefined && newEvent.detail.length > 0)
                        &&
                        <>{newEvent.detail}</>
                    }
                    {(newEvent.additionnalDetails !== null && newEvent.additionnalDetails !== undefined && newEvent.additionnalDetails.length !== undefined && newEvent.detail.length > 0)
                        &&
                        <div className="toastTooltip" style={{ marginBottom: 0, padding: '0px' }} >Details
                            <span className="toastTooltipText">{newEvent.additionnalDetails}</span>
                        </div>
                    }
                </div>
                    ,
                    { ...eventDisplayOptions, autoClose: 10000, toastId: this.props.toastId }
                );
                break;

            case 'success':
                toast.success(<div style={{ padding: '0px' }}>
                    <p style={{ marginBottom: 0, fontWeight: 'lighter', fontSize: 'small', padding: '0px' }}>{newEvent.dateTime}</p>
                    <p style={{ marginBottom: 0, fontWeight: 'bold', padding: '0px' }}>{newEvent.title}</p>
                    <p style={{ marginBottom: 0, padding: '0px', fontSize: 'small' }}>{newEvent.message}</p>
                    {newEvent.detail
                        &&
                        <>{newEvent.detail}</>
                    }
                    {(newEvent.additionnalDetails !== null && newEvent.additionnalDetails !== undefined && newEvent.additionnalDetails.length !== undefined && newEvent.detail.length > 0)
                        &&
                        <div className="toastTooltip" style={{ marginBottom: 0, padding: '0px' }} >Details
                            <span className="toastTooltipText">{newEvent.additionnalDetails}</span>
                        </div>
                    }
                </div>
                    , { ...eventDisplayOptions, autoClose: 10000, toastId: this.props.toastId });
                break;

            case 'warning':
                toast.warn(<div style={{ padding: '0px' }}>
                    <p style={{ marginBottom: 0, fontWeight: 'lighter', fontSize: 'small', padding: '0px' }}>{newEvent.dateTime}</p>
                    <p style={{ marginBottom: 0, fontWeight: 'bold', padding: '0px' }}>{newEvent.title}</p>
                    <p style={{ marginBottom: 0, padding: '0px', fontSize: 'small' }}>{newEvent.message}</p>
                    {newEvent.detail
                        &&
                        <>{newEvent.detail}</>
                    }
                    {(newEvent.additionnalDetails !== null && newEvent.additionnalDetails !== undefined && newEvent.additionnalDetails.length !== undefined && newEvent.detail.length > 0)
                        &&
                        <div className="toastTooltip" style={{ marginBottom: 0, padding: '0px' }} >Details
                            <span className="toastTooltipText">{newEvent.additionnalDetails}</span>
                        </div>
                    }
                </div>
                    , { ...eventDisplayOptions, autoClose: 60000, toastId: this.props.toastId });
                break;

            case 'error':
            default:
                toast.error(<div style={{ padding: '0px' }}>
                    <p style={{ marginBottom: 0, fontWeight: 'lighter', fontSize: 'small', padding: '0px' }}>{newEvent.dateTime}</p>
                    <p style={{ marginBottom: 0, fontWeight: 'bold', padding: '0px' }}>{newEvent.title}</p>
                    <p style={{ marginBottom: 0, padding: '0px', fontSize: 'small' }}>{newEvent.message}</p>
                    {newEvent.detail
                        &&
                        <p style={{ marginBottom: 0, fontWeight: 'bold', padding: '0px' }}>{newEvent.detail}</p>
                    }
                    {(newEvent.additionnalDetails !== null && newEvent.additionnalDetails !== undefined && newEvent.additionnalDetails.length !== undefined && newEvent.detail.length > 0)
                        &&
                        <div className="toastTooltip" style={{ marginBottom: 0, padding: '0px' }} >Details
                            <span className="toastTooltipText">{newEvent.additionnalDetails}</span>
                        </div>
                    }
                </div>
                    , { ...eventDisplayOptions, autoClose: 120000, toastId: this.props.toastId });
                break;
        }

    } // handleError

    // -------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------

    MedalVerse_SubscribeToEvents = (medalVerseContractInstance) => {
        
        if (medalVerseContractInstance === undefined) {
            const error = "MedalVerse_SubscribeEvents:medalVerseContractInstance is undefined"
            console.log(error)
            throw error
        }

        // https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#events-allevents

        if (medalVerseContractInstance.medalVerseContractEvents === undefined) {
            console.log("medalVerseContractInstance.medalVerseContractEvents === undefined")
            const eventsOptions = { fromBlock: 'latest' } // , address: medalVerseContractAddress, topics: []
            // Create event handler
            var medalVerseContractEvents = medalVerseContractInstance.events.allEvents
            (
                { eventsOptions },
                (error, result) => {
                    if (error) {
                        console.error("medalVerseContractInstance: %s error: %s", medalVerseContractInstance.options.address, error);
                    }
                    else {
                        console.log("medalVerseContractInstance: %s result: " + JSON.stringify(result), medalVerseContractInstance.options.address);
                    }
                }
            ); // erc20ContractInstance.events.allEvents

            // Set property to avoid creating event handler twice
            medalVerseContractInstance.medalVerseContractEvents = medalVerseContractEvents;

            medalVerseContractEvents.on('data', event => {
                // 
                // Event
                if (event.event === "eventStatusChanged") {
                    console.log("EVENT -> eventStatusChanged")
                    // console.log("event.returnValues= " + Object.entries(event.returnValues));
                    let userOrganizations = this.state.userOrganizations
                    // REFRESH DATA
                    if (event.returnValues === undefined) {
                        console.error("App::MedalVerse_SetEventHandler:medalVerseContractEvents.on('data':eventStatusChanged:event.returnValues===undefined")
                    } else {
                        // ! eventID != eventId !
                        if (event.returnValues.eventId === undefined) {
                            console.error("eventStatusChanged:No 'eventId' returned")
                        }
                        else {
                            // Update data
                            this.updateOrganizationsEventOnEvent(event.returnValues.eventId, userOrganizations)
                            let eventStatusChanged = { title: "Event updated", level: "success" }
                            this.showEvent(eventStatusChanged, undefined)
                        }
                    }
                }
                // Event
                else if (event.event === "eventWinnerSet") {
                    console.log("EVENT -> eventWinnerSet")
                    // console.log("event.returnValues= " + event.returnValues);
                    let userOrganizations = this.state.userOrganizations
                    // REFRESH DATA
                    if (event.returnValues === undefined) {
                        console.error("App::MedalVerse_SetEventHandler:medalVerseContractEvents.on('data':eventWinnerSet:event.returnValues===undefined")
                    } else {
                        // ! eventID != eventId !
                        if (event.returnValues.eventId === undefined) {
                            console.error("eventWinnerSet:No 'eventId' returned")
                        }
                        else {
                            this.updateOrganizationsEventOnEvent(event.returnValues.eventId, userOrganizations)
                            let eventWinnerSet = { title: "Winner set", level: "success" }
                            this.showEvent(eventWinnerSet, undefined)
                        }
                    }
                }
                // Event
                else if (event.event === "MedalAdded") {
                    console.log("MedalAdded")
                }
                // Event
                else if (event.event === "sportsmanMedalAdded") {
                    console.log("sportsmanMedalAdded")
                }
                // Event
                else if (event.event === "sportsmanUnregisterdEvent") {
                    console.log("sportsmanUnregisterdEvent")
                }
                // Event
                else if (event.event === "sportsmanRegisterdEvent") {
                    console.log("sportsmanRegisterdEvent")
                }
                // Event
                else if (event.event === "sportsmanAdded") {
                    console.log("sportsmanAdded")
                }
                // Unknown Event
                else {
                    console.error("Unknown event : %s", event.event)
                }

            }); // medalVerseContractEvents.on

        } // medalVerseContractInstance.medalVerseContractEvents === undefined

    } // MedalVerse_SubscribeEvents

    // -------------------------------------------------------------------------------------

    MedalVerse_SetEventHandler = () => {
        // console.log("App::MedalVerse_SetEventHandler")
        const medalVerseContractInstance = this.state.contract
        const medalVerseContractcontractInstanceForEvents = this.state.contractEvents

        this.MedalVerse_SubscribeToEvents(medalVerseContractInstance) // Only useful for local node
        this.MedalVerse_SubscribeToEvents(medalVerseContractcontractInstanceForEvents) // Used on Polygon

}; // MedalVerse_SetEventHandler


} // class App

export default App;
