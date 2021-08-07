import React, { useEffect, useState } from "react";
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

const Country = (props) => {
  //#region Form States

  const [formTitle, setFormTitle] = useState("");

  const [countryData, setCountryData] = useState([]);

  const [countryFormData, setCountryFormData] = useState({
    country_Code: "",
    country_Name_English: "",
    country_Name_Arabic: "",
  });

  const [formAction, setFormAction] = useState("");

  //#endregion

  //#region Modal Visibility State
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //#endregion

  //#region Form Actions
  const resetForm = () => {
    let countryFormDataCopy = { ...countryFormData };
    countryFormDataCopy.country_Code = "";
    countryFormDataCopy.country_Name_English = "";
    countryFormDataCopy.country_Name_Arabic = "";

    setCountryFormData(countryFormDataCopy);

    handleShow();
  };

  const getAllCountries = async () => {
    try {
      const result = await countryService.getAllCountries();
      setCountryData(result.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const createCountry = async (values) => {
    try {
      let countryDataCopy = [...countryData];
      let payload = {
        country_Code: 0,
        country_Name_English: values.country_Name_English,
        country_Name_Arabic: values.country_Name_Arabic,
      };
      if (formAction === "Create") {
        await countryService.createCountry(payload).then((result) => {
          countryDataCopy.push({
            country_Code: result.data.country_Code,
            country_Name_English: values.country_Name_English,
            country_Name_Arabic: values.country_Name_Arabic,
          });
        });
      } else if (formAction === "Update") {
        payload.country_Code = values.country_Code;

        await countryService.updateCountry(payload).then((result) => {
          let countryIndex = countryData.findIndex(
            (x) => x.country_Code === result.data.country_Code
          );

          countryDataCopy[countryIndex].country_Name_English =
            values.country_Name_English;
          countryDataCopy[countryIndex].country_Name_Arabic =
            values.country_Name_Arabic;
        });
      }

      setCountryData(countryDataCopy);

      handleClose();
    } catch (error) {
      alert(error);
    }
  };

  const onEditCountry = (country_Code) => {
    setFormTitle("Edit Country");
    setFormAction("Update");

    let selectedCountry = countryData.find(
      (x) => x.country_Code === country_Code
    );

    let countryFormDataCopy = { ...countryFormData };
    countryFormDataCopy.country_Code = selectedCountry.country_Code;
    countryFormDataCopy.country_Name_English =
      selectedCountry.country_Name_English;
    countryFormDataCopy.country_Name_Arabic =
      selectedCountry.country_Name_Arabic;

    setCountryFormData(countryFormDataCopy);

    handleShow();
  };

  const onDeleteCountry = async (country_Code) => {
    try {
      await countryService.deleteCountry(country_Code).then((result) => {
        let countryDataCopy = countryData.filter(
          (x) => x.country_Code !== result.data.country_Code
        );

        setCountryData(countryDataCopy);
        handleConfirmationClose();
      });
    } catch (error) {
      alert(error);
    }
  };

  //#endregion

  //#region Validation Schema

  const schema = yup.object().shape({
    country_Name_English: yup.string().max(50).required(),
    country_Name_Arabic: yup.string().max(50).required(),
  });

  //#endregion

  //#region Confirmation Modal Visibility State
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmationClose = () => setShowConfirmation(false);
  const handleConfirmationShow = () => setShowConfirmation(true);

  const [confirmationKeyValue, setConfirmationKeyValue] = useState("");

  //#endregion

  useEffect(() => {
    getAllCountries();
  }, []);

  return (
    <div className="col-lg-8 mt-2">
      <h3>Country</h3>
      <div className="float-end mb-2">
        <button
          type="button"
          onClick={() => {
            setFormTitle("Create Country");
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
              <th>Name English</th>
              <th>Name Arabic</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {countryData.map((country) => (
              <tr key={country.country_Code}>
                <td>{country.country_Code}</td>
                <td>{country.country_Name_English}</td>
                <td>{country.country_Name_Arabic}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      onEditCountry(country.country_Code);
                    }}
                    className="btn btn-secondary m-2"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationKeyValue(country.country_Code);
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
        {/* Form Modal */}
        <Modal show={show} size="lg" onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{formTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={schema}
              onSubmit={(values, actions) => {
                createCountry(values);
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
                        name="country_Name_English"
                        type="text"
                        value={values.country_Name_English}
                        onChange={handleChange}
                        isValid={
                          touched.country_Name_English &&
                          !errors.country_Name_English
                        }
                        isInvalid={!!errors.country_Name_English}
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
                        name="country_Name_Arabic"
                        type="text"
                        value={values.country_Name_Arabic}
                        onChange={handleChange}
                        isValid={
                          touched.country_Name_Arabic &&
                          !errors.country_Name_Arabic
                        }
                        isInvalid={!!errors.country_Name_Arabic}
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
          handleAction={onDeleteCountry}
          buttonText="Yes"
          modalTitle="Confirmation"
          modalMessage="Are you sure you want to delete this country?"
          modalKeyValue={confirmationKeyValue}
        />
      </div>
    </div>
  );
};

export default Country;
