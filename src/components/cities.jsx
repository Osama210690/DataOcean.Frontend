import React, { useState, useEffect } from 'react'
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

const Cities = (props) => {
  //#region Form States

  const [formTitle, setFormTitle] = useState('')

  const [cityData, setCityData] = useState([])

  const [countryData, setCountryData] = useState([])

  const [cityFormData, setCityFormData] = useState({
    City_Code: '',
    Country_Code: '',
    City_Name_English: '',
    City_Name_Arabic: '',
  })

  const [formAction, setFormAction] = useState('')

  //#endregion

  //#region Form Actions

  const resetForm = () => {
    let cityFormDataCopy = { ...cityFormData }
    cityFormDataCopy.City_Code = ''
    cityFormDataCopy.City_Name_Arabic = ''
    cityFormDataCopy.City_Name_English = ''
    cityFormDataCopy.Country_Code = ''

    setCityFormData(cityFormDataCopy)

    handleFormShow()
  }

  const onEditCity = (cityCode) => {
    setFormTitle('Edit City')
    setFormAction('Update')

    let selectedCity = cityData.find((x) => x.City_Code === cityCode)

    let cityFormDataCopy = { ...cityFormData }
    cityFormDataCopy.City_Code = selectedCity.City_Code
    cityFormDataCopy.Country_Code = selectedCity.Country.Country_Code
    cityFormDataCopy.City_Name_English = selectedCity.City_Name_English
    cityFormDataCopy.City_Name_Arabic = selectedCity.City_Name_Arabic

    setCityFormData(cityFormDataCopy)

    handleFormShow()
  }

  const onDeleteCity = (cityCode) => {
    handleConfirmationClose()

    let cityDataCopy = cityData.filter((x) => x.City_Code !== cityCode)

    setCityData(cityDataCopy)
  }

  //#endregion

  //#region Form Visibility State
  const [formShow, setFormShow] = useState(false)

  const handleFormClose = () => setFormShow(false)
  const handleFormShow = () => setFormShow(true)

  //#endregion

  //#region Validation Schema

  const schema = yup.object().shape({
    Country_Code: yup.string().required(),
    City_Name_English: yup.string().max(50).required(),
    City_Name_Arabic: yup.string().max(50).required(),
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
    setCityData(localData.cities())
  }, [])

  return (
    <div className="col-lg-8 mt-2">
      <h3>Cities</h3>
      <div className="float-end mb-2">
        <button
          type="button"
          onClick={() => {
            setFormTitle('Create City')
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
              <th>Country </th>
              <th>City Eng</th>
              <th>City Ar</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cityData.map((city) => (
              <tr key={city.City_Code}>
                <td>{city.City_Code}</td>
                <td>{city.Country.Country_Name}</td>
                <td>{city.City_Name_English}</td>
                <td>{city.City_Name_Arabic}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      onEditCity(city.City_Code)
                    }}
                    className="btn btn-secondary m-2"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationKeyValue(city.City_Code)
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
        <div>
          {/* Form Modal */}
          <Modal show={formShow} size="lg" onHide={handleFormClose}>
            <Modal.Header closeButton>
              <Modal.Title>{formTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                  let cityDataCopy = [...cityData]
                  let country = countryData.find(
                    (x) => x.CountryCode === parseInt(values.Country_Code),
                  )
                  if (formAction === 'Create') {
                    cityDataCopy.push({
                      City_Code: 510,
                      City_Name_English: values.City_Name_English,
                      City_Name_Arabic: values.City_Name_Arabic,
                      Country: {
                        Country_Code: values.Country_Code,
                        Country_Name: country.CountryName,
                      },
                    })
                  } else if (formAction === 'Update') {
                    let cityIndex = cityData.findIndex(
                      (x) => x.City_Code === values.City_Code,
                    )
                    cityData[cityIndex].City_Name_English =
                      values.City_Name_English
                    cityData[cityIndex].City_Name_Arabic =
                      values.City_Name_Arabic
                    cityData[cityIndex].Country.Country_Code =
                      values.Country_Code
                    cityData[cityIndex].Country.Country_Name =
                      country.CountryName
                  }

                  setCityData(cityDataCopy)

                  handleFormClose()
                }}
                initialValues={cityFormData}
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
                  <Form
                    noValidate
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                  >
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
                          name="Country_Code"
                          value={values.Country_Code}
                          aria-label="Default select example"
                          isValid={touched.Country_Code && !errors.Country_Code}
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
                        Name English
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          name="City_Name_English"
                          type="text"
                          value={values.City_Name_English}
                          onChange={handleChange}
                          isValid={
                            touched.City_Name_English &&
                            !errors.City_Name_English
                          }
                          isInvalid={!!errors.City_Name_English}
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
                          name="City_Name_Arabic"
                          type="text"
                          value={values.City_Name_Arabic}
                          onChange={handleChange}
                          isValid={
                            touched.City_Name_Arabic && !errors.City_Name_Arabic
                          }
                          isInvalid={!!errors.City_Name_Arabic}
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
            handleAction={onDeleteCity}
            buttonText="Yes"
            modalTitle="Confirmation"
            modalMessage="Are you sure you want to delete this City?"
            modalKeyValue={confirmationKeyValue}
          />
        </div>
      </div>
    </div>
  )
}

export default Cities
