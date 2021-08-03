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

const Customer = (props) => {
  //#region Form States

  const [formTitle, setFormTitle] = useState('')

  const [countryData, setCountryData] = useState([])
  const [cityData, setCityData] = useState([])
  const [customerData, setCustomerData] = useState([])

  const [customerFormData, setCustomerFormData] = useState({
    CustomerCode: '',
    EnglishName: '',
    ArabicName: '',
    MobileNo: '',
    Email: '',
    CountryCode: '',
    City_Code: '',
    AddressLine1: '',
    AddressLine2: '',
    AddressLine3: '',
  })

  const [formAction, setFormAction] = useState('')

  //#endregion

  //#region Modal Visibility State
  const [formShow, setFormShow] = useState(false)

  const handleFormClose = () => setFormShow(false)
  const handleFormShow = () => setFormShow(true)

  //#endregion

  //#region Validation Schema

  const schema = yup.object().shape({
    EnglishName: yup.string().max(50).required(),
    ArabicName: yup.string().max(50).required(),
    MobileNo: yup.number().required().positive().integer().max(10),
    Email: yup.string().email().max(50).required(),
    CountryCode: yup.string().max(4).required(),
    City_Code: yup.string().max(4).required(),
    AddressLine1: yup.string().max(250).required(),
    AddressLine2: yup.string().max(250).required(),
    AddressLine3: yup.string().max(250).required(),
  })

  //#endregion

  //#region Confirmation Modal Visibility State
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleConfirmationClose = () => setShowConfirmation(false)
  const handleConfirmationShow = () => setShowConfirmation(true)

  const [confirmationKeyValue, setConfirmationKeyValue] = useState('')

  //#endregion

  //#region Form Actions
  const resetForm = () => {
    let customerFormDataCopy = { ...customerFormData }
    customerFormDataCopy.CountryCode = ''
    customerFormDataCopy.City_Code = ''
    customerFormDataCopy.EnglishName = ''
    customerFormDataCopy.ArabicName = ''
    customerFormDataCopy.AddressLine1 = ''
    customerFormDataCopy.AddressLine2 = ''
    customerFormDataCopy.AddressLine3 = ''
    customerFormDataCopy.Email = ''
    customerFormDataCopy.MobileNo = ''

    setCustomerFormData(customerFormDataCopy)

    handleFormShow()
  }

  const onEditCustomer = () => {}

  const onDeleteCustomer = () => {}

  //#endregion

  useEffect(() => {
    setCountryData(localData.countries())
    setCustomerData(localData.customers())
  }, [])

  return (
    <div className="col-lg mt-2">
      <h3>Customer</h3>
      <div className="float-end mb-2">
        <button
          type="button"
          onClick={() => {
            setFormTitle('Create Customer')
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
              <th>Email</th>
              <th>Mobile</th>
              <th>Country</th>
              <th>City</th>
              <th>AddressLine1</th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerData.map((customer) => (
              <tr key={customer.CustomerCode}>
                <td>{customer.CustomerCode}</td>
                <td>{customer.EnglishName}</td>
                <td>{customer.ArabicName}</td>
                <td>{customer.Email}</td>
                <td>{customer.MobileNo}</td>
                <td>{customer.Country.CountryName}</td>
                <td>{customer.City.City_Name_English}</td>
                <td>{customer.AddressLine1}</td>

                <td>
                  <button
                    type="button"
                    onClick={() => {
                      onEditCustomer(customer.CountryCode)
                    }}
                    className="btn btn-secondary m-2"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationKeyValue(customer.CountryCode)
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
        <Modal show={formShow} size="lg" onHide={handleFormClose}>
          <Modal.Header closeButton>
            <Modal.Title>{formTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={schema}
              onSubmit={(values, actions) => {
                handleFormClose()
              }}
              initialValues={customerFormData}
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
                        name="EnglishName"
                        type="text"
                        value={values.EnglishName}
                        onChange={handleChange}
                        isValid={touched.EnglishName && !errors.EnglishName}
                        isInvalid={!!errors.EnglishName}
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
                        name="ArabicName"
                        type="text"
                        value={values.ArabicName}
                        onChange={handleChange}
                        isValid={touched.ArabicName && !errors.ArabicName}
                        isInvalid={!!errors.ArabicName}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalEmail"
                  >
                    <Form.Label column sm={2}>
                      Country
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Select
                        onChange={handleChange}
                        name="CountryCode"
                        value={values.CountryCode}
                        isValid={touched.CountryCode && !errors.CountryCode}
                      >
                        <option value="">Select</option>
                        {countryData.map((country) => (
                          <option
                            key={country.CountryCode}
                            value={country.CountryCode}
                          >
                            {country.CountryName}
                          </option>
                        ))}
                      </Form.Select>
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
          handleAction={onDeleteCustomer}
          buttonText="Yes"
          modalTitle="Confirmation"
          modalMessage="Are you sure you want to delete this country?"
          modalKeyValue={confirmationKeyValue}
        />
      </div>
    </div>
  )
}

export default Customer
