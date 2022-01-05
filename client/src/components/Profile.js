/* React */
import React, { useState /*, useEffect, useRef*/ } from "react";

/* Translation */
import { useTranslation } from 'react-i18next';

// import {useParams} from 'react-router-dom'
/* React - Bootstrap*/
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
// import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Card from 'react-bootstrap/Card';
// import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
// import Accordion from 'react-bootstrap/Accordion'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'

/* Icônes */
import { Check } from 'react-bootstrap-icons';

import "../styles/Main.css"

const Profile = ( { handleSaveProfile, profile }  ) =>
{

  const [ name, setName] = useState( profile.name )

  const onHandleSaveProfile = async ( ) =>
  {
    try
    {
      console.log("Profile::onHandleSaveProfile: name = "+ name );
      await handleSaveProfile( {name:name} ) ;
    } // try
    catch (error)
    {
     // Catch any errors for any of the above operations.
    //  handleError( error, true )
    } // catch
  } // onHandleSaveProfile

  const handleOnNameChange = (e) =>
  {
      console.log("Profile::handleOnNameChange:e.target.value= '"+e.target.value+"'")
      setName( e.target.value );
  } // handleOnNameChange

  const { t } = useTranslation();
  // const params = useParams();

  // console.log( "Profile::params[\"userid\"]="+params["userid"] )
  // Styles
  const textCN = "text-left text-dark text-wrap"
  const textCN_Bold = "text-left text-dark text-wrap fw-bold"

  return (
<Container className="text-dark" variant="bg-dark">

  <Card variant="top" bg="dark" src="../images/backgrounds/black-abstract-wallpaper-4.jpg">
      <Card.Body>

        <Card.Title className={textCN_Bold}> {t("profilePage.title")}</Card.Title>
        <Card.Subtitle className="mb-2 text-dark fw-bold"> { /* t("profilePage.subtitle", { connectedAccountAddr: params["userid"] */}</Card.Subtitle>

        <Card.Text className={textCN} />
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">{t("profilePage.properties.name")}</InputGroup.Text>
          <Form.Control
            placeholder={t("profilePage.placeHolder.name")}
            aria-label={t("profilePage.placeHolder.name")}
            onChange={ handleOnNameChange }
            value={ name }
          />
        </InputGroup>
      </Card.Body>


    <ListGroupItem className="text-dark" variant="dark">
        <Button className="m-1" variant="light" size="sm" onClick={ () => onHandleSaveProfile() } >
            <Check style={{verticalAlign: '-10%'}} /> {t("profilePage.actions.save")}
        </Button>
    </ListGroupItem>


  </Card>
  
</Container>
  )
}

export { Profile };