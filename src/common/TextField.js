import React from "react";
import classnames from "classnames";

function TextField({ label, error, className, ...other }) {
  return (
    <div className="form-group row">
      <label className="col-sm-3 font-weight-bold">{label}</label>
      <span className="col-sm-9">
        <input className={classnames("form-control", className, { "is-invalid": error })} {...other} />
        {error && <div className="text-danger">{error}</div>}
      </span>
    </div>
  );
}

export default TextField;
