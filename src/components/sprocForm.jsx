import React, { useEffect, useState } from "react";
import Joi from "joi-browser";
import sprocService from "../services/sprocService";
import { Modal, Button, Table } from "react-bootstrap";

const SprocForm = (props) => {
  const [allSprocData, setAllSprocData] = useState([]);
  const [sprocData, setSprocData] = useState([]);
  const [sprocErrors, setSprocErrors] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    allStoredProcedures();
  }, []);

  const allStoredProcedures = async () => {
    const result = await sprocService.loadStoredProcedures();

    setAllSprocData(result.data);
  };

  const executeProcedure = async (dbConfigId, spConfigId) => {
    const result = await sprocService
      .executeStoredProcedure(dbConfigId, spConfigId)
      .then((response) => {
        handleShow();

        console.log(response.data);
        setSprocData(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="col-lg-4 mt-2">
      <h3>Procedures</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>SPID</th>
            <th>SpName</th>
            <th>DbName</th>
            <th>Server</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allSprocData.map((sproc) => (
            <tr>
              <td>{sproc.SpId}</td>
              <td>{sproc.SpName}</td>
              <td>{sproc.dbname}</td>
              <td>{sproc.Server}</td>
              <td>{sproc.Password}</td>
              <td>
                {
                  <li
                    onClick={() => {
                      executeProcedure(sproc.DbConfigId, sproc.SpId);
                    }}
                    className="list-group-item list-group-item-action active"
                  >
                    View
                  </li>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> Heading </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {sprocData.map((sproc) => (
                  <tr>
                    <td>{Object.values(sproc)[0]}</td>
                    <td>{Object.values(sproc)[1]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
};

export default SprocForm;
