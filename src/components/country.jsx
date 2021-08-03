import React, { useEffect, useState } from 'react'
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
import localData from '../localData'
import * as yup from 'yup'
import { Formik } from 'formik'
import ConfirmModal from './common/confirmModal'

const Country = (props) => {
  //#region Form States

  const [formTitle, setFormTitle] = useState('')

  const [countryData, setCountryData] = useState([])

  const [countryFormData, setCountryFormData] = useState({
    CountryCode: '',
    CountryNameEng: '',
    CountryNameAr: '',
  })

  const [formAction, setFormAction] = useState('')

  //#endregion

  // Modal Visibility State
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  //#endregion

  //#region Form Actions
  const resetForm = () => {
    let countryFormDataCopy = { ...countryFormData }
    countryFormDataCopy.CountryCode = ''
    countryFormDataCopy.CountryNameEng = ''
    countryFormDataCopy.CountryNameAr = ''

    setCountryFormData(countryFormDataCopy)

    handleShow()
  }

  const onEditCountry = (countryCode) => {
    setFormTitle('Edit Country')
    setFormAction('Update')

    let selectedCountry = countryData.find((x) => x.CountryCode == countryCode)

    let countryFormDataCopy = { ...countryFormData }
    countryFormDataCopy.CountryCode = selectedCountry.CountryCode
    countryFormDataCopy.CountryNameEng = selectedCountry.CountryName
    countryFormDataCopy.CountryNameAr = selectedCountry.CountryNameArabic

    setCountryFormData(countryFormDataCopy)

    handleShow()
  }

  const onDeleteCountry = (countryCode) => {
    handleConfirmationClose()

    let countryDataCopy = countryData.filter(
      (x) => x.CountryCode !== countryCode,
    )

    setCountryData(countryDataCopy)
  }

  //#endregion

  //#region Validation Schema

  const schema = yup.object().shape({
    CountryNameEng: yup.string().max(50).required(),
    CountryNameAr: yup.string().max(50).required(),
  })

  //#endregion

  //#region Confirmation Modal Visibility State
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleConfirmationClose = () => setShowConfirmation(false)
  const handleConfirmationShow = () => setShowConfirmation(true)

  const [confirmationKeyValue, setConfirmationKeyValue] = useState('')

  //#endregion

  useEffect(() => {
    setCountryData(localData.countries())
  }, [])

  return (
    <div className="col-lg-8 mt-2">
      <h3>Country</h3>
      <div className="float-end mb-2">
        <button
          type="button"
          onClick={() => {
            setFormTitle('Create Country')
            setFormAction('Create')
            resetForm()
          }}
          className="btn btn-primary"
        >
          Create
        </button>
      </div>

      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name English</th>
              <th>Name Arabic</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {countryData.map((country) => (
              <tr key={country.CountryCode}>
                <td>{country.CountryCode}</td>
                <td>{country.CountryName}</td>
                <td>{country.CountryNameArabic}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      onEditCountry(country.CountryCode)
                    }}
                    className="btn btn-secondary m-2"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationKeyValue(country.CountryCode)
                      handleConfirmationShow()
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div>
        {/* Form Modal */}
        <Modal show={show} size="lg" onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{formTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={schema}
              onSubmit={(values, actions) => {
                let countryDataCopy = [...countryData]
                if (formAction === 'Create') {
                  countryDataCopy.push({
                    CountryCode: 103,
                    CountryName: values.CountryNameEng,
                    CountryNameArabic: values.CountryNameAr,
                  })
                } else if (formAction === 'Update') {
                  let countryIndex = countryData.findIndex(
                    (x) => x.CountryCode === values.CountryCode,
                  )
                  countryDataCopy[countryIndex].CountryName =
                    values.CountryNameEng
                  countryDataCopy[countryIndex].CountryNameArabic =
                    values.CountryNameAr
                }

                setCountryData(countryDataCopy)

                handleClose()
              }}
              initialValues={countryFormData}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                handleReset,
                values,
                touched,
                isValid,
                errors,
              }) => (
                <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalEmail"
                  >
                    <Form.Label column sm={2}>
                      Name English
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        name="CountryNameEng"
                        type="text"
                        value={values.CountryNameEng}
                        onChange={handleChange}
                        isValid={
                          touched.CountryNameEng && !errors.CountryNameEng
                        }
                        isInvalid={!!errors.CountryNameEng}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={2}>
                      Name Arabic
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        name="CountryNameAr"
                        type="text"
                        value={values.CountryNameAr}
                        onChange={handleChange}
                        isValid={touched.CountryNameAr && !errors.CountryNameAr}
                        isInvalid={!!errors.CountryNameAr}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Col sm={{ span: 10, offset: 2 }}>
                      <Button className="btn btn-primary" type="submit">
                        {formAction === 'Create' ? 'Submit' : 'Update'}
                      </Button>

                      <Button className="btn btn-secondary m-2" type="reset">
                        Reset
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

        {/* Confirmation Modal */}
        <ConfirmModal
          isVisible={showConfirmation}
          handleShow={handleConfirmationShow}
          handleHide={handleConfirmationClose}
          handleAction={onDeleteCountry}
          buttonText="Yes"
          modalTitle="Confirmation"
          modalMessage="Are you sure you want to delete this country?"
          modalKeyValue={confirmationKeyValue}
        />
      </div>
    </div>
  )
}

export default Country
