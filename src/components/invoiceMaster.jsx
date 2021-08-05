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
import DataGrid, {
  Column,
  MasterDetail,
  Summary,
  TotalItem,
  Selection,
  GroupPanel,
  Grouping,
  Export,
} from "devextreme-react/data-grid";
import invoiceDetails from "./invoiceDetails";

const InvoiceMaster = (props) => {
  return (
    <>
      <div className="col-lg-8 mt-2">
        <h3>Invoice</h3>
      </div>
      <div>
        <DataGrid
          id="grid-container"
          dataSource={localData.salesMaster()}
          keyExpr="InvoiceNo"
          showBorders={true}
        >
          <Selection mode="multiple" />
          <GroupPanel visible={true} />
          <Grouping autoExpandAll={true} />

          <Column dataField="InvoiceNo" width={70} caption="#No" />
          <Column dataField="InvoiceDate" dataType="date" />
          <Column dataField="CustomerName" />
          <Column dataField="Remarks" width={170} />
          <Column
            dataField="TotalSalesInvAmt"
            width={125}
            caption="SalesTotal"
          />
          <Column
            dataField="TotalVatAmt"
            dataType="number"
            caption="VatTotal"
            format="currency"
          />
          <Column dataField="NetTotal" dataType="number" format="currency" />

          <MasterDetail enabled={true} component={invoiceDetails} />
          <Summary>
            <TotalItem
              column="TotalSalesInvAmt"
              summaryType="sum"
              valueFormat="currency"
            />
            <TotalItem
              column="TotalVatAmt"
              summaryType="sum"
              valueFormat="currency"
            />
            <TotalItem
              column="NetTotal"
              summaryType="sum"
              valueFormat="currency"
            />
          </Summary>
        </DataGrid>
      </div>
    </>
  );
};

export default InvoiceMaster;
