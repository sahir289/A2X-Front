import { LoadingOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
// import { CloseSvg } from "utils/svgs";
import styles from "./index.module.scss";
import { CloseSvg } from "../../utils/constants";

// ConfirmLoginOverride popup
const ConfirmLoginOverride = (props) => {
  // Inits
  const { handleCancel, handleOk, isModalOpen, proceedHandler, isLoading } =
    props;

  //   JSX
  return (
    <Modal
      title={
        <div className={styles["confirm-delete-model"]}>
          <WarningOutlined width={25} />
          <h4 className={styles["confirm-delete-model__title"]}>
            You are currently logged in from another location. If you wish to continue and log out the other session, click Proceed.Otherwise, you can choose to Log Out the session from the other location.
          </h4>
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered={true}
      width={700}
      closeIcon={<CloseSvg />}
      footer={[
        <div key={"wrapper"} className={styles["confirm-delete-model__button"]}>
          <Button
            key="ok"
            className={
              "btn w-[142px] bg-[#0b78c2] text-white hover:!bg-[#0b78c2] hover:!text-white hover:border-none"
            }
            loading={isLoading ? (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            ) : ""}
            onClick={proceedHandler}
          >
            Proceed
          </Button>
          <Button
            key="cancel"
            onClick={handleCancel}
            className={
              "btn w-[142px] hover:!border-black border-black hover:!text-black"
            }
          >
            Cancel
          </Button>
        </div>,
      ]}
    ></Modal>
  );
};

export default ConfirmLoginOverride;
