import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import localData from "../localData";
import * as yup from "yup";
import { Formik } from "formik";
import ConfirmModal from "./common/confirmModal";
import countryService from "../services/countryService";
import cityService from "../services/cityService";

const Cities = (props) => {
  //#region Form States

  const [formTitle, setFormTitle] = useState("");

  const [cityData, setCityData] = useState([]);

  const [countryData, setCountryData] = useState([]);

  const [cityFormData, setCityFormData] = useState({
    city_Code: "",
    country_Code: "",
    city_Name_English: "",
    city_Name_Arabic: "",
  });

  const [formAction, setFormAction] = useState("");

  //#endregion

  //#region Form Actions

  const resetForm = () => {
    let cityFormDataCopy = { ...cityFormData };
    cityFormDataCopy.city_Code = "";
    cityFormDataCopy.city_Name_Arabic = "";
    cityFormDataCopy.city_Name_English = "";
    cityFormDataCopy.country_Code = "";

    setCityFormData(cityFormDataCopy);

    handleFormShow();
  };

  const getAllCountries = async () => {
    try {
      const result = await countryService.getAllCountries();

      console.log("countries", result.data);
      setCountryData(result.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const getAllCities = async () => {
    try {
      const result = await cityService.getAllCities();
      setCityData(result.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const onEditCity = (cityCode) => {
    setFormTitle("Edit City");
    setFormAction("Update");

    let selectedCity = cityData.find((x) => x.city_Code === cityCode);

    let cityFormDataCopy = { ...cityFormData };
    cityFormDataCopy.city_Code = selectedCity.city_Code;
    cityFormDataCopy.country_Code = selectedCity.country.country_Code;
    cityFormDataCopy.city_Name_English = selectedCity.city_Name_English;
    cityFormDataCopy.city_Name_Arabic = selectedCity.city_Name_Arabic;

    setCityFormData(cityFormDataCopy);

    handleFormShow();
  };

  const onDeleteCity = async (city_Code) => {
    await cityService.deleteCity(city_Code).then((result) => {
      let cityDataCopy = cityData.filter(
        (x) => x.city_Code !== result.data.city_Code
      );
      setCityData(cityDataCopy);

      handleConfirmationClose();
    });
  };

  const createCity = async (values) => {
    try {
      let cityDataCopy = [...cityData];
      let country = countryData.find(
        (x) => x.country_Code === parseInt(values.country_Code)
      );

      // let payload = {
      //   city_Code: 0,
      //   country: { country_Code: values.country_Code },
      //   city_Name_English: values.city_Name_English,
      //   city_Name_Arabic: values.city_Name_Arabic,
      // };

      let payload = {
        city_Code: 0,
        city_Name_English: values.city_Name_English,
        city_Name_Arabic: values.city_Name_Arabic,
        country: {
          country_Code: values.country_Code,
          country_Name_English: country.country_Name_English,
          country_Name_Arabic: country.city_Name_Arabic,
        },
      };

      if (formAction === "Create") {
        await cityService.createCity(payload).then((result) => {
          payload.city_Code = result.data.city_Code;

          cityDataCopy.push(payload);
        });
      } else if (formAction === "Update") {
        let cityIndex = cityData.findIndex(
          (x) => x.city_Code === values.city_Code
        );
        cityDataCopy[cityIndex].city_Code = values.city_Code;
        cityDataCopy[cityIndex].city_Name_English = values.city_Name_English;
        cityDataCopy[cityIndex].city_Name_Arabic = values.city_Name_Arabic;
        cityDataCopy[cityIndex].country.country_Code = values.country_Code;
        cityDataCopy[cityIndex].country.country_Name_English =
          country.country_Name_English;
        cityDataCopy[cityIndex].country.country_Name_Arabic =
          country.country_Name_Arabic;
      }

      setCityData(cityDataCopy);

      handleFormClose();
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion

  //#region Form Visibility State
  const [formShow, setFormShow] = useState(false);

  const handleFormClose = () => setFormShow(false);
  const handleFormShow = () => setFormShow(true);

  //#endregion

  //#region Validation Schema

  const schema = yup.object().shape({
    country_Code: yup.string().required(),
    city_Name_English: yup.string().max(50).required(),
    city_Name_Arabic: yup.string().max(50).required(),
  });

  //#endregion

  //#region Confirmation Modal Visibility State
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmationClose = () => setShowConfirmation(false);
  const handleConfirmationShow = () => setShowConfirmation(true);

  const [confirmationKeyValue, setConfirmationKeyValue] = useState("");

  //#endregion

  useEffect(() => {
    getAllCountries().then(() => {
      getAllCities();
    });
  }, []);

  return (
    <div className="col-lg-8 mt-2">
      <h3>Cities</h3>
      <div className="float-end mb-2">
        <button
          type="button"
          onClick={() => {
            setFormTitle("Create City");
            setFormAction("Create");
            resetForm();
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
              <tr key={city.city_Code}>
                <td>{city.city_Code}</td>
                <td>{city.country.country_Name_English}</td>
                <td>{city.city_Name_English}</td>
                <td>{city.city_Name_Arabic}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      onEditCity(city.city_Code);
                    }}
                    className="btn btn-secondary m-2"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationKeyValue(city.city_Code);
                      handleConfirmationShow();
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
                  createCity(values);
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
                          name="country_Code"
                          value={values.country_Code}
                          aria-label="Default select example"
                          isValid={touched.country_Code && !errors.country_Code}
                        >
                          <option value="">Select</option>
                          {countryData.map((country) => (
                            <option
                              key={country.country_Code}
                              value={country.country_Code}
                            >
                              {country.country_Name_English}
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
                          name="city_Name_English"
                          type="text"
                          value={values.city_Name_English}
                          onChange={handleChange}
                          isValid={
                            touched.city_Name_English &&
                            !errors.city_Name_English
                          }
                          isInvalid={!!errors.city_Name_English}
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
                          name="city_Name_Arabic"
                          type="text"
                          value={values.city_Name_Arabic}
                          onChange={handleChange}
                          isValid={
                            touched.city_Name_Arabic && !errors.city_Name_Arabic
                          }
                          isInvalid={!!errors.city_Name_Arabic}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Col sm={{ span: 10, offset: 2 }}>
                        <Button className="btn btn-primary" type="submit">
                          {formAction === "Create" ? "Submit" : "Update"}
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
  );
};

export default Cities;
