// React
// Components
import React, { Component } from "react";

/* Translation */
import { withTranslation } from 'react-i18next';


/* Bootstrap */
// Css
import 'bootstrap/dist/css/bootstrap.min.css';
// Components
import Container from 'react-bootstrap/Container';

// Smartcontract(s) Interface(s)
import simpleStorageContract from "../contracts/SimpleStorage.json";


/* Utils Web3 */
import { getWeb3, toChecksumAddress } from "../js/getWeb3";

/* Composants React */
import  { Web3Loader } from "./Status";
import  { Alerts } from "./Alerts";
// import { FatalError } from "./AppComponents-Errors";
import { Toolbar } from "./Header";
import { SimpleStorage } from "./SimpleStorage";

/* CSS */
import "../styles/App.css";

/*
// //////////////////////////////////////////////////////////////////////////////////////////
*/
class MainApp extends Component
{
  constructor( props )
  {
    super( props );

    /* Handlers */
    // Init
    this.initEventHandlers = this.initEventHandlers.bind(this);
    // Errors / Events
    this.handleError = this.handleError.bind(this);
    this.showEvent = this.showEvent.bind(this);

    // Smart contracts data
    this.simpleStorage_get = this.simpleStorage_get.bind(this);
    this.simpleStorage_set = this.simpleStorage_set.bind(this);
  } // constructor
  
  /* Component global variables */
  state =
  {
    // Web3
    web3: null,
    // Events
    ethereum : null,
    // Network
    networkId : null,
    // App data
    //  - Account
    connectedAccountAddr: null,
    //  - Contracts
    simpleStorage_ContractInstance : null,
    // Global values
    simpleStorageValue : null,
    // Misc.
    //  - Alerts
    alertsList: []
  };

  // ----------------------------
  
  render()
  {
    // Translation
    return (
      <Container className="vh-100 d-flex flex-column ">

      { !this.state.web3
        &&
          <Web3Loader/>
      }
      {
        this.state.web3
        &&
        <Container fluid>

          <Alerts alertsList={ this.state.alertsList } />

          <Container fluid>
              <Toolbar owner={this.state.owner} connectedAccountAddr={this.state.connectedAccountAddr} />
          </Container>

          <SimpleStorage simpleStorageValue={this.state.simpleStorageValue} simpleStorageSet={this.simpleStorage_set} handleError={this.handleError} simpleStorageGet={this.simpleStorage_get} />

        </Container>
      }

  </Container>
);// return

  } // render()

// ====================================================================================

/**
 * Exécuté à l'instantiation du composant MainApp
 */
  componentDidMount = async () =>
  {
    let networkId = -1 ;
    let simpleStorage_DeployedNetwork = undefined ;
    let errorMsg = "Failed to load web3, accounts, or contract. Check console for details." ; // Message d'erreur d' "urgence" à ne pas traduire
    
    try
    {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Network
      networkId = await web3.eth.net.getId();

    // simpleStorage_ContractInstance
      simpleStorage_DeployedNetwork = simpleStorageContract.networks[ networkId ];

      if (simpleStorage_DeployedNetwork === undefined)
      {
        this.setState(  {
                          web3, 
                          simpleStorage_ContractInstance : undefined,
                          ethereum: window.ethereum,
                          networkId : undefined
                        },
                        this.runMainInit
                      );
      }
      else
      {
        const simpleStorage_ContractInstance =
          new web3.eth.Contract (
                                  simpleStorageContract.abi,
                                  simpleStorage_DeployedNetwork && simpleStorage_DeployedNetwork.address,
                                );

        this.setState(  {
                          web3,
                          simpleStorage_ContractInstance,
                          ethereum: window.ethereum,
                          networkId
                        },
                        this.runMainInit
                      );
      }

    } // try
    catch (error)
    {
      // Catch any errors for any of the above operations.
      switch ( networkId )
      {
        case 42 :
            if ( simpleStorage_DeployedNetwork === undefined )
            {
              errorMsg = "Contract not found.";
            }
          break;
        default :
              errorMsg = "Unsupported network.";
        break;
      } // switch

      alert( errorMsg );
      console.error( error) ;
    }

  }; // componentDidMount

// -------------------------------------

/**
 * Exécuté à la suppression du composant
 */
  componentWillUnmount()
  {

    // TODO : remove event handlers
    // TODO : remove event handlers
    // TODO : remove event handlers
    // TODO : remove event handlers
    // TODO : remove event handlers
  }

/**
 * ***************************************************************
 * Evénements
 * ***************************************************************
 */

  initEventHandlers = () =>
  {

    // Mise en place du handler pour l'évènement -> changement de compte
    window.ethereum.on("accountsChanged", accounts =>
     {
      this.handleAccountsChangedEvent(accounts)
     });


  // Mise en place du handler pour les évènements du contrat
  // https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#events-allevents
/*
    const { erc20StakingContractInstance } = this.state;

    if ( xxxContractInstance !== undefined )
     {
      var contractXxxxxEvents = xxxContractInstance.events.allEvents
      (
        { fromBlock: 'latest' },
        (error, result) =>
          {
            if (error)
            {
              console.error("xxxContractInstance: %s error:" + xxxContractInstance.options.address + error ) ;
            // debug
            alert(error)
            }
          else
            {
              console.info("xxxContractInstance: %s result:" + xxxContractInstance.options.address + result ) ;
            }
          }
      ); // contractInstanceVoting.events.allEvents


      contractXxxxxEvents.on('data', event =>
        {
          if (event.event === "EventXXX00")
            {
              this.refreshContractsData( ) ;
            }
            else if (event.event === "EventXXX01")
            {
              this.refreshContractsData( ) ;
            }
        }); // contractXxxxxEvents.on
      } // xxxContractInstance !== undefined
*/
  }; // initEventHandlers

/* ****************************
  runMainInit
 *****************************/

runMainInit = async() =>
{
  try{
    await this.refreshUserAccount();
    await this.refreshContractsData();
    this.initEventHandlers();
  } // try
catch (error)
 {
  // Catch any errors for any of the above operations.
  this.handleError( error, true, true )
 } // catch

} // runMainInit


  /*****************************
    refreshContractsData
  *****************************/
  refreshContractsData = async( ) =>
  {
    console.log("refreshContractsData")
    const value = await this.simpleStorage_get() ;

    this.setState( { simpleStorageValue: value } );

  } // refreshContractsData

  /* -------------------------------------------------------------
  refreshUserAccount
  ------------------------------------------------------------- */
  refreshUserAccount = async() =>
  {
    try
    {
      const { web3 } = this.state
      // Use web3 to get the user's accounts.
      // Mise à jour des données de l'utilisateur connecté
      const connectedAccountsAddrs = await web3.eth.getAccounts();
      const connectedAccountAddr = toChecksumAddress( connectedAccountsAddrs[0] )
      this.setState( { connectedAccountAddr } )
    } // try
    catch (error)
    {
      // Catch any errors for any of the above operations.
      this.handleError( error, true )
    } // catch
  }; // refreshUserAccount

/* ************************************
  errorHandlers

 ************************************* */
/* -------------------------------
  Smart contract errors
 -------------------------------- */
 
handleError = (error, bLogToConsole, bshowAlertPopup) =>
{
  const { t } = this.props;
  const { alertsList } = this.state;
  let newAlert = {}

  let now = new Date( );
  newAlert.time= now.toLocaleDateString( t("Formats.date") ) + " " +
     new Intl.DateTimeFormat( t("Formats.date"), {hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short"} ).format(  )

  if (bLogToConsole)
  {
    console.error(error);
  }
  if (bshowAlertPopup)
  {
    alert( t("Errors.default.title") + "\n" + error)
    return
  }

  if (error.code !== undefined)
  {

   if (error.code === 4001)
    {
     newAlert.title = t("Errors.4001.title")
     newAlert.variant = t("Errors.4001.variant")
     newAlert.message = t("Errors.4001.message")
    } // 4001
   else
    {
     newAlert.title = t("Errors.default.title")
     newAlert.variant = t("Errors.default.variant")
     newAlert.message = t("Errors.default.message")
    } // default

     if (error.message !== undefined)
     {
      // newAlert.detail = truncateString(error.message, 50)
      newAlert.detail = error.message
    } // switch (error.code)
   }
 else
 {
     
     if (error.title !== undefined)
     {
      newAlert.title = error.title
     }
     else
     {
      newAlert.title = t("Errors.default.title")
    }

     if (error.level !== undefined)
     {
      newAlert.variant = error.level
     }
     else
     {
      newAlert.variant = t("Errors.default.variant")
    }

     if (error.message !== undefined)
     {
      newAlert.message = error.message;
     } // error.message !== undefined
     else
     {
      newAlert.message = t("Errors.default.message")
     }
    //  newAlert.detail = truncateString(error, 100)
    newAlert.detail = error.message
  } // else

 const alertsListUpdated = [...alertsList, newAlert ]
 this.setState({ alertsList: alertsListUpdated })

} // handleError

// ---------------------

showEvent = ( event, bLogToConsole, bshowAlertPopup) =>
{
  const { t } = this.props;
  const { alertsList } = this.state;
  let newAlert = {}

  let now = new Date( );
  newAlert.time= now.toLocaleDateString( t("Formats.date") ) + " " +
     new Intl.DateTimeFormat( t("Formats.date"), {hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short"} ).format(  )

  if (bLogToConsole)
  {
    console.error(event);
  }
  if (bshowAlertPopup)
  {
    alert( t("Errors.default.title") + "\n" + event)
    return
  }

     if (event.title !== undefined)
     {
      newAlert.title = event.title
     }
     else
     {
      newAlert.title = t("Errors.default.title")
    }

     if (event.level !== undefined)
     {
      newAlert.variant = event.level
     }
     else
     {
      newAlert.variant = t("Errors.default.variant")
    }

     if (event.message !== undefined)
     {
      newAlert.message = event.message;
     } // event.message !== undefined
     else
     {
      newAlert.message = t("Errors.default.message")
     }
    //  newAlert.detail = truncateString(error, 100)

    if (event.detail !== undefined)
    {
     newAlert.detail = event.detail;
    } // event.detail !== undefined

  const alertsListUpdated = [...alertsList, newAlert ]
  this.setState({ alertsList: alertsListUpdated })

  } // showEvent


// //////////////////////////////////////////////////////////////////////////////////////////

/*
==================================================
  Smart contracts interaction methods
==================================================
*/

/*
-----------------------
 SimpleStorage contract
-----------------------
*/

/*
 Reads/Calls
*/
simpleStorage_get = async( ) =>
{
  let value = undefined;
  try
   {
    const { simpleStorage_ContractInstance } = this.state ;

    if ( simpleStorage_ContractInstance !== undefined )
    {
      value = await simpleStorage_ContractInstance.methods.get().call() ;
    } // simpleStorage_ContractInstance!==undefined

   } // try
  catch (error)
   {
    // Catch any errors for any of the above operations.
    this.handleError( error, true )
   } // catch
   return value ;

} // simpleStorage_get

/*
 Writes/Sends
*/
/**
 * 
 * @param {value} la valeur a enregister
 */
simpleStorage_set = async( value ) =>
  {
    console.log("MainApp::simpleStorage_set: value = "+ value ) ;
    try
     {
      const
        {
          simpleStorage_ContractInstance, // contrat
          connectedAccountAddr // compte
        } = this.state ;

      if ( simpleStorage_ContractInstance !== undefined )
      {
        await simpleStorage_ContractInstance.methods.set( value ).send( { from: connectedAccountAddr } ) ;
      } // simpleStorage_ContractInstance!==undefined
  
      // Update display :
      // handled by events
     } // try
    catch (error)
     {
      // Catch any errors for any of the above operations.
      this.handleError( error, true )
     } // catch
  } // erc20StakingContract_createNewErc20Vault

// -------------------------------------------------------------------------------------

// //////////////////////////////////////////////////////////////////////////////////////////

} // class MainApp extends Component


const MainAppTranslated = withTranslation()(MainApp);

export default MainAppTranslated;