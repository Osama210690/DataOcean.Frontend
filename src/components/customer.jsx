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
  FloatingLabel
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
  const [citySelectData, setCitySelectData] = useState([])

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
    MobileNo: yup.number().required() ,
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

  const onEditCustomer = () => {
    setFormTitle('Edit Customer')
    setFormAction('Update')



    handleFormShow()

  }

  const onDeleteCustomer = (customerCode) => {


    let customerDataCopy = customerData.filter(
      (x) => x.CustomerCode !== customerCode,
    )

    setCustomerData(customerDataCopy)

    handleConfirmationClose()


  }

  //#endregion

  useEffect(() => {
    setCountryData(localData.countries())
    setCityData(localData.cities())
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
                      setConfirmationKeyValue(customer.CustomerCode)
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
                
                let customerDataCopy = [...customerData]


                let country = countryData.find(
                  (x) => x.CountryCode === parseInt(values.CountryCode),
                )
                
                let city = cityData.find(
                  (x) => x.City_Code === parseInt(values.City_Code),
                )

                if (formAction === 'Create') {
                  customerDataCopy.push({
                    CustomerCode: 10,
                    EnglishName: values.EnglishName,
                    ArabicName: values.ArabicName,
                    MobileNo: values.MobileNo,
                    Email: values.Email,
                    Country: { CountryCode: country.CountryCode, CountryName: country.CountryName },
                    City: { City_Code: city.City_Code, City_Name_English: city.City_Name_English },
                    AddressLine1: values.AddressLine1,
                    AddressLine2: values.AddressLine2,
                    AddressLine3: values.AddressLine3,
                  })
                } else if (formAction === 'Update') {

                  let customerIndex = customerData.findIndex(
                    (x) => x.CustomerCode === values.CustomerCode,
                  )

                  customerDataCopy[customerIndex].EnglishName =
                  values.EnglishName;
                  customerDataCopy[customerIndex].ArabicName =
                  values.ArabicName;
                  customerDataCopy[customerIndex].MobileNo =
                  values.MobileNo;
                  customerDataCopy[customerIndex].Email =
                  values.Email;
                  customerDataCopy[customerIndex].Country=country;
                  customerDataCopy[customerIndex].City=city;
                  customerDataCopy[customerIndex].AddressLine1 =
                  values.AddressLine1;
                  customerDataCopy[customerIndex].AddressLine2 =
                  values.AddressLine2;
                  customerDataCopy[customerIndex].AddressLine2 =
                  values.AddressLine2;
                 
                }

                setCustomerData(customerDataCopy)

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
                      Country
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Select
                       
                        onChange={(e)=>{

                          const { value } = e.target;
                          console.log(value)
                           handleChange(e)

                          const citiesByCountry = cityData.filter(x=>x.Country.Country_Code===parseInt(value));
                          // console.log(citiesByCountry)
                          setCitySelectData(citiesByCountry);

                        }}
                        
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

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalEmail"
                  >
                    <Form.Label column sm={2}>
                      City
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Select
                        onChange={handleChange}
                        name="City_Code"
                        value={values.City_Code}
                        isValid={touched.City_Code && !errors.City_Code}
                      >
                        <option value="">Select</option>
                        {citySelectData.map((city) => (
                          <option
                            key={city.City_Code}
                            value={city.City_Code}
                          >
                            {city.City_Name_English}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
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
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={2}>
                      Email
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        name="Email"
                        type="text"
                        value={values.Email}
                        onChange={handleChange}
                        isValid={touched.Email && !errors.Email}
                        isInvalid={!!errors.Email}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={2}>
                      Mobile
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        name="MobileNo"
                        type="number"
                        value={values.MobileNo}
                        onChange={handleChange}
                        isValid={touched.MobileNo && !errors.MobileNo}
                        isInvalid={!!errors.MobileNo}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={2}>
                      AddressLine1
                    </Form.Label>
                    <Col sm={10}>
                    <FloatingLabel controlId="AddressLine1" >
                      <Form.Control
                        as="textarea"
                        name="AddressLine1"
                        onChange={handleChange}
                        style={{ height: '60px' }}
                        isValid={touched.AddressLine1 && !errors.AddressLine1}
                        isInvalid={!!errors.AddressLine1}
                      />
                     </FloatingLabel>
                    </Col>
                  </Form.Group>
                 
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={2}>
                      AddressLine2
                    </Form.Label>
                    <Col sm={10}>
                    <FloatingLabel controlId="AddressLine2" >
                      <Form.Control
                        as="textarea"
                        name="AddressLine2"
                        onChange={handleChange}
                        style={{ height: '60px' }}
                        isValid={touched.AddressLine2 && !errors.AddressLine2}
                        isInvalid={!!errors.AddressLine2}
                      />
                     </FloatingLabel>
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={2}>
                      AddressLine3
                    </Form.Label>
                    <Col sm={10}>
                    <FloatingLabel controlId="AddressLine3" >
                      <Form.Control
                        as="textarea"
                        name="AddressLine3"
                        onChange={handleChange}
                        style={{ height: '60px' }}
                        isValid={touched.AddressLine3 && !errors.AddressLine3}
                        isInvalid={!!errors.AddressLine3}
                      />
                     </FloatingLabel>
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
