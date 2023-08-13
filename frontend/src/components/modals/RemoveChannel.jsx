import { useSelector, useDispatch } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { isClose } from "../../slices/modalSlice.js";
import { useWSocket } from "../../hooks/index.jsx";

const RemoveChannel = () => {
  const dispatch = useDispatch();
  const wsocket = useWSocket();
  const { t } = useTranslation();

  const { isShow, extraData } = useSelector((state) => state.modalInfo);

  const handleClose = () => {
    dispatch(isClose());
  };

  const handleRemove = () => {
    wsocket.emitRemoveChannel(extraData.id);
    dispatch(isClose());
  };

  return (
    <>
      <Modal
        show={isShow}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("deleteChannel")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="lead">{t("confirm")}</p>
          <div className="d-flex justify-content-end">
            <Button
              className="me-2"
              variant="secondary"
              type="button"
              onClick={handleClose}
            >
              {t("cancel")}
            </Button>
            <button
              className="btn btn-danger"
              variant="primary"
              type="submit"
              onClick={handleRemove}
            >
              {t("delete")}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RemoveChannel;