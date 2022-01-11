// React + Hooks
import React, { useState, useEffect, useRef, useCallback } from "react";

/* Translation */
import { useTranslation } from 'react-i18next';

/* Bootstrap */
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/* Icons */
import { Pencil } from 'react-bootstrap-icons';

// ------------------------------------------

const SimpleStorage = ( { simpleStorageValue, simpleStorageSet, handleError, simpleStorageGet } ) =>
{
  const { t } = useTranslation();
  const [ newValue, setNewValue ] = useState( "" )

  const [ currentvalue, setCurrentValue ] = useState( simpleStorageValue )

  let intervalRef = useRef();

  // ----------------------------------------

const updateValue = useCallback( async() => {
  let val = await simpleStorageGet( ) ;
  console.log("updateValue:simpleStorageGet=" + val)
  setCurrentValue(val);
}, [simpleStorageGet])

  // ----------------------------------------

  useEffect
  (
    () =>
    {
      // actions
      setCurrentValue(simpleStorageValue);
      intervalRef.current = setInterval( updateValue, 10000);
      // cleanup/unmount
      return () => clearInterval( intervalRef.current ) ;
    }, [simpleStorageValue, simpleStorageGet, updateValue] // dependencies
  );
  
  // ----------------------------------------

  // Value event handler
  const handleOnNewValue = (e) =>
  {
      console.log("SimpleStorage::handleOnNewValue:e.target.value= '"+e.target.value+"'")
      const value = e.target.value
      setNewValue( value );
  } // handleOnAmountChange

  // ----------------------------------------

  const onHandleSimpleStorageSetNewValue = async ( ) =>
  {
    console.log("SimpleStorage::onHandleSimpleStorageSetNewValue: value = "+ newValue ) ;
    try
    {
      if ( newValue !== undefined )
      {
        await simpleStorageSet( newValue ) ;
        await updateValue() ;
      }
      else
      {
        // TODO : message d'erreur
          let error =
          {
            message:   t("simpleStorageContract.errors.setNewValue.message"),
            level :   "simpleStorageContract.errors.setNewValue.level",
            title:    t("simpleStorageContract.errors.setNewValue.title")
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

  // ----------------------------------------
  // render

  return (

    <Card style={{ width: '50rem' }} bg="dark" border="light" className="text-light text-center" >
    <Card.Header><strong>{t("simpleStorageContract.title")}</strong></Card.Header>
    <Card.Text>{t("simpleStorageContract.status")}</Card.Text>
    <Card.Text>{t("simpleStorageContract.subtitle")}</Card.Text>
    <Card.Text>{t("simpleStorageContract.notice1")}{t("simpleStorageContract.notice1DefaultValue")}</Card.Text>
    <Card.Text>{t("simpleStorageContract.notice2")}</Card.Text>
    <Card.Text>{t("simpleStorageContract.getValue")}<b> { /*simpleStorageValue*/ currentvalue }</b></Card.Text>
    <Card.Text></Card.Text>
    <Card.Text></Card.Text>
    <Card.Text></Card.Text>
    <Card.Body>
      <Form.Group>
        <Form.Control type="text" id="value"
        value={ newValue }
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