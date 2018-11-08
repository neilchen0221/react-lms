import React from "react";

function ConfirmDialog({ id, handleConfirm, title, body }) {
  return (
    <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{body}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
            <button type="button" className="btn btn-success" data-dismiss="modal" onClick={handleConfirm}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
