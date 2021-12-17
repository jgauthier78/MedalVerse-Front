// React + Hooks
import React, { useState /*, useEffect */ } from "react";

/* Translation */
import { useTranslation } from 'react-i18next';

/* Bootstrap */
// Css
// import 'bootstrap/dist/css/bootstrap.min.css';
// Components
//import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/* Icons */
import { Pencil } from 'react-bootstrap-icons';


/* Utils Web3 */
// import { getWeb3, toChecksumAddress /*, isAddress*/ } from "../js/getWeb3";

/* Utils */
// import  { truncateString } from "./AppUtils";

/* CSS spécifiques */

// ------------------------------------------

const SimpleStorage = ( { simpleStorageValue, simpleStorageSet, handleError } ) =>
{
  const { t } = useTranslation();
  const [value, setValue] = useState( "" )
  
  // Value event handler
  const handleOnNewValue = (e) =>
  {
      console.log("SimpleStorage::handleOnNewValue:e.target.value= '"+e.target.value+"'")
      const value = e.target.value
      setValue(value);
  } // handleOnAmountChange

  const onHandleSimpleStorageSetNewValue = async ( ) =>
  {
    console.log("SimpleStorage::onHandleSimpleStorageSetNewValue: value = "+ value ) ;
    try
    {
      console.log("SimpleStorage::onHandleSimpleStorageSetNewValue: value = "+ value ) ;
      if ( value !== undefined )
      {
        await simpleStorageSet( value ) ;
      }
      else
      {
        // TODO : message d'erreur
        // alert( t("erc20VaultContract.app.user.input.amountMustBeGreaterThanZero") );
          // TODO : message d'erreur
          // console.log( t("erc20VaultContract.app.user.input.amountMustBeGreaterThanZero") );
          let error =
          {
            message:   t("erc20VaultContract.app.user.input.amountMustBeGreaterThanZero"),
            level :   "warning",
            title:    t("erc20VaultContract.app.user.input.title.deposit") + t("erc20VaultContract.app.user.input.title.inputError")
          };
          
          throw error;
      } // else
    } // try
    catch (error)
    {
     // Catch any errors for any of the above operations.
     handleError( error, true )
    } // catch

  } // onHandleERC20VaultDeposit
  return (

    <Card style={{ width: '50rem' }} bg="dark" border="light" className="text-light text-center" >
    <Card.Header><strong>{t("simpleStorageContract.title")}</strong></Card.Header>
    <Card.Text>{t("simpleStorageContract.status")}</Card.Text>
    <Card.Text>{t("simpleStorageContract.subtitle")}</Card.Text>
    <Card.Text>{t("simpleStorageContract.notice1")}{t("simpleStorageContract.notice1DefaultValue")}</Card.Text>
    <Card.Text>{t("simpleStorageContract.notice2")}</Card.Text>
    <Card.Text>{t("simpleStorageContract.getValue")}<b>{ simpleStorageValue }</b></Card.Text>
    <Card.Text></Card.Text>
    <Card.Text></Card.Text>
    <Card.Text></Card.Text>
    <Card.Body>
      <Form.Group>
        <Form.Control type="text" id="value"
        value={ value }
        placeholder={t("simpleStorageContract.provideNewValue")} 
        aria-label={t("simpleStorageContract.provideNewValue")} 
        onChange={ handleOnNewValue }
        min="5"
        maxLength="10"
        className="text-dark"
      />
      </Form.Group>
    </Card.Body>
    <Card.Footer >
      <Button variant="info" size="sm"
        disabled={false}
        onClick={ () => onHandleSimpleStorageSetNewValue() }
      >
        <Pencil style={{verticalAlign: '-10%'}}
      /> {t("simpleStorageContract.setValueButton")}

        

      </Button>
    </Card.Footer >
  </Card>


  );
} // SimpleStorage

export { SimpleStorage };