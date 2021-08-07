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
  FloatingLabel,
} from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";
import ConfirmModal from "./common/confirmModal";
import countryService from "../services/countryService";
import cityService from "../services/cityService";
import customerService from "../services/customerService";

const Customer = (props) => {
  //#region Form States

  const [formTitle, setFormTitle] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [citySelectData, setCitySelectData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  const [customerFormData, setCustomerFormData] = useState({
    customer_Code: "",
    name_English: "",
    name_Arabic: "",
    mobile_No: "",
    email: "",
    country_Code: "",
    city_Code: "",
    address_Line1: "",
    address_Line2: "",
    address_Line3: "",
  });

  const [formAction, setFormAction] = useState("");

  //#endregion

  //#region Modal Visibility State
  const [formShow, setFormShow] = useState(false);

  const handleFormClose = () => setFormShow(false);
  const handleFormShow = () => setFormShow(true);

  //#endregion

  //#region Validation Schema

  const schema = yup.object().shape({
    name_English: yup.string().max(50).required(),
    name_Arabic: yup.string().max(50).required(),
    mobile_No: yup.string().required(),
    email: yup.string().email().max(50).required(),
    country_Code: yup.string().max(4).required(),
    city_Code: yup.string().max(4).required(),
    address_Line1: yup.string().max(250).required(),
    address_Line2: yup.string().max(250).required(),
    address_Line3: yup.string().max(250).required(),
  });

  //#endregion

  //#region Confirmation Modal Visibility State
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmationClose = () => setShowConfirmation(false);
  const handleConfirmationShow = () => setShowConfirmation(true);

  const [confirmationKeyValue, setConfirmationKeyValue] = useState("");

  //#endregion

  //#region Form Actions

  const getAllCountries = async () => {
    try {
      const result = await countryService.getAllCountries();

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

  const getAllCustomers = async () => {
    try {
      const result = await customerService.getAllCustomer();
      setCustomerData(result.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const resetForm = () => {
    let customerFormDataCopy = { ...customerFormData };
    customerFormDataCopy.country_Code = "";
    customerFormDataCopy.city_Code = "";
    customerFormDataCopy.name_English = "";
    customerFormDataCopy.name_Arabic = "";
    customerFormDataCopy.address_Line1 = "";
    customerFormDataCopy.address_Line2 = "";
    customerFormDataCopy.address_Line3 = "";
    customerFormDataCopy.email = "";
    customerFormDataCopy.mobile_No = "";

    setCustomerFormData(customerFormDataCopy);

    handleFormShow();
  };

  const onEditCustomer = (customer_Code) => {
    setFormTitle("Edit Customer");
    setFormAction("Update");

    //Getting the selected customer
    const customer = customerData.find(
      (x) => x.customer_Code === parseInt(customer_Code)
    );

    //getting the city from country code
    const citiesByCountry = cityData.filter(
      (x) => x.country.country_Code === customer.country.country_Code
    );

    //updating city state from dropdown
    setCitySelectData(citiesByCountry);

    //Mapping form to edit customer
    const customerFormDataCopy = { ...customerFormData };
    customerFormDataCopy.customer_Code = customer.customer_Code;
    customerFormDataCopy.country_Code = customer.country.country_Code;
    customerFormDataCopy.city_Code = customer.city.city_Code;
    customerFormDataCopy.name_English = customer.name_English;
    customerFormDataCopy.name_Arabic = customer.name_Arabic;
    customerFormDataCopy.address_Line1 = customer.address_Line1;
    customerFormDataCopy.address_Line2 = customer.address_Line2;
    customerFormDataCopy.address_Line3 = customer.address_Line3;
    customerFormDataCopy.email = customer.email;
    customerFormDataCopy.mobile_No = customer.mobile_No;

    setCustomerFormData(customerFormDataCopy);

    handleFormShow();
  };

  const onDeleteCustomer = async (customerCode) => {
    await customerService.deleteCustomer(customerCode).then((result) => {
      let customerDataCopy = customerData.filter(
        (x) => x.customer_Code !== result.data.customer_Code
      );

      setCustomerData(customerDataCopy);

      handleConfirmationClose();
    });
  };

  const createCustomer = async (values) => {
    try {
      let customerDataCopy = [...customerData];

      let country = countryData.find(
        (x) => x.country_Code === parseInt(values.country_Code)
      );

      let city = cityData.find(
        (x) => x.city_Code === parseInt(values.city_Code)
      );

      let payload = {
        customer_Code: 0,
        name_English: values.name_English,
        name_Arabic: values.name_Arabic,
        mobile_No: values.mobile_No,
        email: values.email,
        country: {
          country_Code: country.country_Code,
          country_Name_English: country.country_Name_English,
        },
        city: {
          city_Code: city.city_Code,
          city_Name_English: city.city_Name_English,
        },
        address_Line1: values.address_Line1,
        address_Line2: values.address_Line2,
        address_Line3: values.address_Line3,
      };

      if (formAction === "Create") {
        await customerService.createCustomer(payload).then((result) => {
          payload.customer_Code = result.data.customer_Code;
          customerDataCopy.push(payload);
        });
      } else if (formAction === "Update") {
        payload.customer_Code = values.customer_Code;

        await customerService.updateCustomer(payload).then((result) => {
          let customerIndex = customerData.findIndex(
            (x) => x.customer_Code === parseInt(result.data.customer_Code)
          );

          customerDataCopy[customerIndex].name_English = values.name_English;
          customerDataCopy[customerIndex].name_Arabic = values.name_Arabic;
          customerDataCopy[customerIndex].mobile_No = values.mobile_No;
          customerDataCopy[customerIndex].email = values.email;
          customerDataCopy[customerIndex].Country = country;
          customerDataCopy[customerIndex].City = city;
          customerDataCopy[customerIndex].address_Line1 = values.address_Line1;
          customerDataCopy[customerIndex].address_Line2 = values.address_Line2;
          customerDataCopy[customerIndex].address_Line3 = values.address_Line3;
        });
      }

      setCustomerData(customerDataCopy);

      handleFormClose();
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion

  useEffect(() => {
    getAllCustomers().then(() => {
      getAllCountries().then(() => {
        getAllCities();
      });
    });
  }, []);

  return (
    <div className="col-lg mt-2">
      <h3>Customers</h3>
      <div className="float-end mb-2">
        <button
          type="button"
          onClick={() => {
            setFormTitle("Create Customer");
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
              <th>email</th>
              <th>Mobile</th>
              <th>Country</th>
              <th>City</th>
              <th>Address Line1</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerData.map((customer) => (
              <tr key={customer.customer_Code}>
                <td>{customer.customer_Code}</td>
                <td>{customer.name_English}</td>
                <td>{customer.name_Arabic}</td>
                <td>{customer.email}</td>
                <td>{customer.mobile_No}</td>
                <td>{customer.country.country_Name_English}</td>
                <td>{customer.city.city_Name_English}</td>
                <td>{customer.address_Line1}</td>

                <td>
                  <button
                    type="button"
                    onClick={() => {
                      onEditCustomer(customer.customer_Code);
                    }}
                    className="btn btn-secondary m-2"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationKeyValue(customer.customer_Code);
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
        <Modal show={formShow} size="lg" onHide={handleFormClose}>
          <Modal.Header closeButton>
            <Modal.Title>{formTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={schema}
              onSubmit={(values, actions) => {
                createCustomer(values);
              }}
              onReset={(values) => {
                //getting the city from country code
                const citiesByCountry = cityData.filter(
                  (x) => x.country.country_Code === values.country_Code
                );

                //updating city state from dropdown
                setCitySelectData(citiesByCountry);
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
                    controlId="formHorizontalemail"
                  >
                    <Form.Label column sm={2}>
                      Country
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Select
                        onChange={(e) => {
                          const { value } = e.target;
                          console.log(value);
                          handleChange(e);

                          const citiesByCountry = cityData.filter(
                            (x) => x.country.country_Code === parseInt(value)
                          );
                          // console.log(citiesByCountry)
                          setCitySelectData(citiesByCountry);
                        }}
                        name="country_Code"
                        value={values.country_Code}
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
                    controlId="formHorizontalemail"
                  >
                    <Form.Label column sm={2}>
                      City
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Select
                        onChange={handleChange}
                        name="city_Code"
                        value={values.city_Code}
                        isValid={touched.city_Code && !errors.city_Code}
                      >
                        <option value="">Select</option>
                        {citySelectData.map((city) => (
                          <option key={city.city_Code} value={city.city_Code}>
                            {city.city_Name_English}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalemail"
                  >
                    <Form.Label column sm={2}>
                      Name English
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        name="name_English"
                        type="text"
                        value={values.name_English}
                        onChange={handleChange}
                        isValid={touched.name_English && !errors.name_English}
                        isInvalid={!!errors.name_English}
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
                        name="name_Arabic"
                        type="text"
                        value={values.name_Arabic}
                        onChange={handleChange}
                        isValid={touched.name_Arabic && !errors.name_Arabic}
                        isInvalid={!!errors.name_Arabic}
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
                        name="email"
                        type="text"
                        value={values.email}
                        onChange={handleChange}
                        isValid={touched.email && !errors.email}
                        isInvalid={!!errors.email}
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
                        name="mobile_No"
                        type="text"
                        value={values.mobile_No}
                        onChange={handleChange}
                        isValid={touched.mobile_No && !errors.mobile_No}
                        isInvalid={!!errors.mobile_No}
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
                      <FloatingLabel controlId="address_Line1">
                        <Form.Control
                          as="textarea"
                          name="address_Line1"
                          onChange={handleChange}
                          style={{ height: "60px" }}
                          isValid={
                            touched.address_Line1 && !errors.address_Line1
                          }
                          isInvalid={!!errors.address_Line1}
                          value={values.address_Line1}
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
                      AddressLine 2
                    </Form.Label>
                    <Col sm={10}>
                      <FloatingLabel controlId="address_Line2">
                        <Form.Control
                          as="textarea"
                          name="address_Line2"
                          onChange={handleChange}
                          style={{ height: "60px" }}
                          isValid={
                            touched.address_Line2 && !errors.address_Line2
                          }
                          isInvalid={!!errors.address_Line2}
                          value={values.address_Line2}
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
                      Address Line3
                    </Form.Label>
                    <Col sm={10}>
                      <FloatingLabel controlId="address_Line3">
                        <Form.Control
                          as="textarea"
                          name="address_Line3"
                          onChange={handleChange}
                          style={{ height: "60px" }}
                          isValid={
                            touched.address_Line3 && !errors.address_Line3
                          }
                          isInvalid={!!errors.address_Line3}
                          value={values.address_Line3}
                        />
                      </FloatingLabel>
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
          handleAction={onDeleteCustomer}
          buttonText="Yes"
          modalTitle="Confirmation"
          modalMessage="Are you sure you want to delete this country?"
          modalKeyValue={confirmationKeyValue}
        />
      </div>
    </div>
  );
};

export default Customer;
