import React from "react";
import classnames from "classnames";

function SortControl({ children, isSelected, isAsc, ...other }) {
  return (
    <a className="btn btn-link font-weight-bold p-0" {...other}>
      {isSelected ? (
        <i className={classnames("fas", { "fa-sort-up": isAsc }, { "fa-sort-down": !isAsc }, "mr-2")} />
      ) : (
        <i className="fas fa-sort mr-2" />
      )}
      {children}
    </a>
  );
}

export default SortControl;
