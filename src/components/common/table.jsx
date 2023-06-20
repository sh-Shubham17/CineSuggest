import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

const Table = ({ columns, sortColumn, onSort, data }) => {
  //const { columns, sortColumn, onSort, data } = props;
  //inplace of this line we directly destructure components in arugment we can do this in every function component

  return (
    <table className="table text-light">
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        onSort={onSort}
      />
      <TableBody
        columns={columns}
        data={data}
      />
    </table>
  );
};

export default Table;
