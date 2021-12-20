/* React */
import React, { useState } from "react";

import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

function Alerts( { alertsList } )
{
   return (

    <ToastContainer className="p-3" position={"bottom-end"}>
    {
    alertsList &&
          alertsList.map((alert,idx) =>
            <Alert key={idx} title={alert.title} message={alert.message} detail={alert.detail} time={alert.time} variant={alert.variant} />
          ) // alertsList.map
    }
  </ToastContainer>

) // return

} // Alerts

// ------------------------------------------------------------------------------------------

function Alert({ title, message, detail, time, variant, id })
{
  const [show, setShow] = useState(true);
  // const { t } = useTranslation();

    return (
      <Toast bg={variant} onClose={() => setShow(false)} show={show} animation={true} delay={60000} autohide key={id} > 
        <Toast.Header closeButton={true} >
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">{title}</strong>
          <small>{time}</small>
        </Toast.Header>
      <Toast.Body className={variant === 'Dark' && 'text-white'}>
          {message}
          { detail && <small><hr/>{detail}</small> }
      </Toast.Body>
    </Toast>
      )
} // Alert

// ------------

// ------------------------------------------------------------------------------------------

export { Alerts };