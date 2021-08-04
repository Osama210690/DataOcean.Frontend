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

const ItemMaster = (props) => {
  //#region Form States

  const [formTitle, setFormTitle] = useState("");

  const [itemData, setItemData] = useState([]);

  const [itemFormData, setItemFormData] = useState({
    ItemCode: "",
    ItemEnglishName: "",
    ItemNameArabic: "",
    Price: 0.0,
    VatPercentage: 0.0,
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
    ItemEnglishName: yup.string().max(50).required(),
    ItemNameArabic: yup.string().max(50).required(),
    Price: yup.number().required(),
    VatPercentage: yup.number().required(),
  });

  //#endregion

  //#region Confirmation Modal Visibility State
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmationClose = () => setShowConfirmation(false);
  const handleConfirmationShow = () => setShowConfirmation(true);

  const [confirmationKeyValue, setConfirmationKeyValue] = useState("");

  //#endregion

  //#region Form Actions
  const resetForm = () => {
    let itemFormDataCopy = { ...itemFormData };
    itemFormDataCopy.ItemCode = "";
    itemFormDataCopy.ItemEnglishName = "";
    itemFormDataCopy.ItemNameArabic = "";
    itemFormDataCopy.Price = 0.0;
    itemFormDataCopy.VatPercentage = 0.0;

    setItemFormData(itemFormDataCopy);

    handleFormShow();
  };

  const onEditItem = (itemCode) => {
    setFormTitle("Edit Item");
    setFormAction("Update");

    let selectedItem = itemData.find((x) => x.ItemCode === itemCode);

    let itemFormDataCopy = { ...itemFormData };
    itemFormDataCopy.ItemCode = selectedItem.ItemCode;
    itemFormDataCopy.ItemEnglishName = selectedItem.ItemEnglishName;
    itemFormDataCopy.ItemNameArabic = selectedItem.ItemNameArabic;
    itemFormDataCopy.Price = selectedItem.Price;
    itemFormDataCopy.VatPercentage = selectedItem.VatPercentage;

    setItemFormData(itemFormDataCopy);

    handleFormShow();
  };

  const onDeleteItem = (itemCode) => {
    handleConfirmationClose();

    let itemDataCopy = itemData.filter((x) => x.ItemCode !== itemCode);

    setItemData(itemDataCopy);
  };

  //#endregion

  useEffect(() => {
    setItemData(localData.items());
  }, []);

  return (
    <div className="col-lg-6 mt-2">
      <h3>Items</h3>
      <div className="float-end mb-2">
        <button
          type="button"
          onClick={() => {
            setFormTitle("Create Item");
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
              <th>#Code</th>
              <th>Name English</th>
              <th>Name Arabic</th>
              <th>Price</th>
              <th>Vat(%)</th>
            </tr>
          </thead>
          <tbody>
            {itemData.map((item) => (
              <tr key={item.ItemCode}>
                <td>{item.ItemCode}</td>
                <td>{item.ItemEnglishName}</td>
                <td>{item.ItemNameArabic}</td>
                <td>{item.Price}</td>
                <td>{item.VatPercentage}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      onEditItem(item.ItemCode);
                    }}
                    className="btn btn-secondary m-2"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationKeyValue(item.ItemCode);
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
                let itemDataCopy = [...itemData];
                if (formAction === "Create") {
                  itemDataCopy.push({
                    ItemCode: 110,
                    ItemEnglishName: values.ItemEnglishName,
                    ItemNameArabic: values.ItemNameArabic,
                    Price: values.Price,
                    VatPercentage: values.VatPercentage,
                  });
                } else if (formAction === "Update") {
                  let itemIndex = itemData.findIndex(
                    (x) => x.ItemCode === parseInt(values.ItemCode)
                  );

                  itemDataCopy[itemIndex].ItemEnglishName =
                    values.ItemEnglishName;
                  itemDataCopy[itemIndex].ItemNameArabic =
                    values.ItemNameArabic;
                  itemDataCopy[itemIndex].Price = values.Price;
                  itemDataCopy[itemIndex].VatPercentage = values.VatPercentage;
                }
                setItemData(itemDataCopy);
                handleFormClose();
              }}
              initialValues={itemFormData}
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
                        name="ItemEnglishName"
                        type="text"
                        value={values.ItemEnglishName}
                        onChange={handleChange}
                        isValid={
                          touched.ItemEnglishName && !errors.ItemEnglishName
                        }
                        isInvalid={!!errors.ItemEnglishName}
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
                        name="ItemNameArabic"
                        type="text"
                        value={values.ItemNameArabic}
                        onChange={handleChange}
                        isValid={
                          touched.ItemNameArabic && !errors.ItemNameArabic
                        }
                        isInvalid={!!errors.ItemNameArabic}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={2}>
                      Price
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        name="Price"
                        type="text"
                        value={values.Price}
                        onChange={handleChange}
                        isValid={touched.Price && !errors.Price}
                        isInvalid={!!errors.Price}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={2}>
                      Vat(%)
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        name="VatPercentage"
                        type="text"
                        value={values.VatPercentage}
                        onChange={handleChange}
                        isValid={touched.VatPercentage && !errors.VatPercentage}
                        isInvalid={!!errors.VatPercentage}
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
          handleAction={onDeleteItem}
          buttonText="Yes"
          modalTitle="Confirmation"
          modalMessage="Are you sure you want to delete this item?"
          modalKeyValue={confirmationKeyValue}
        />
      </div>
    </div>
  );
};

export default ItemMaster;
