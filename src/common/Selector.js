import React from "react";
import classnames from "classnames";

function Selector({ label, error, className, children, ...other }) {
  return (
    <div className="form-group row">
      <label className="col-sm-3 font-weight-bold">{label}</label>
      <span className="col-sm-9">
        <select className={classnames("form-control", className, { "is-invalid": error })} {...other}>
          {children}
        </select>
        {error && <div className="text-danger">{error}</div>}
      </span>
    </div>
  );
}

export default Selector;
