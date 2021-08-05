import React, { useEffect, useState } from "react";
import {
  DataGrid,
  Column,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import localData from "../localData";

const InvoiceDetails = (props) => {
  const [salesDetailData, setSalesDetailData] = useState([]);
  const invoiceMaster = props.data.data;
  useEffect(() => {
    const salesDetails = localData
      .salesDetails()
      .filter((x) => x.InvoiceNo === invoiceMaster.InvoiceNo);

    setSalesDetailData(salesDetails);
  }, []);

  return (
    <>
      {/* <div className="master-detail-caption">
        {`Invoice Date:${invoiceMaster.InvoiceDate}  `}
      </div> */}
      <DataGrid
        dataSource={salesDetailData}
        showBorders={true}
        columnAutoWidth={true}
      >
        <Column dataField="ItemCode" />
        <Column dataField="ItemName" />
        <Column dataField="Price" dataType="number" format="currency" />
        <Column dataField="Qty" dataType="number" />
        <Column dataField="Vat" dataType="number" />
        <Column dataField="TotalAmount" format="currency" />
        <Summary>
          <TotalItem column="Qty" summaryType="sum" />
          <TotalItem column="Vat" summaryType="sum" valueFormat="currency" />
          <TotalItem
            column="TotalAmount"
            summaryType="sum"
            valueFormat="currency"
          />
        </Summary>
      </DataGrid>
    </>
  );
};

export default InvoiceDetails;
