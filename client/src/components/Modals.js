/* React */
import React from "react";
// import React, { useState } from "react";

import Modal from 'react-bootstrap/Modal'
// import Button from "react-bootstrap/esm/Button";

// ------------------------------------------------------------------------------------------
/*
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
*/
// ------------

const SimpleModal = ({ title, messageBody, show, animation }) =>
{
  return (
      <Modal show={show} animation={animation}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{messageBody}</Modal.Body>
    </Modal>
  )
} // SimpleModal
/*
function Modal({ title, message, detail, time, variant, id })
{
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const { t } = useTranslation();

    return (
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={this.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={this.handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
      )
} // Modal
*/
// ------------------------------------------------------------------------------------------

export { SimpleModal };