import React from 'react'
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap'

const ConfirmModal = ({
  isVisible,
  handleHide,
  handleAction,
  modalTitle,
  modalMessage,
  modalKeyValue,
}) => {
  return (
    <Modal show={isVisible}>
      <Modal.Header closeButton onHide={handleHide}>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{modalMessage}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleHide} variant="secondary">
          No
        </Button>
        <Button
          onClick={() => {
            handleAction(modalKeyValue)
          }}
          variant="danger"
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
