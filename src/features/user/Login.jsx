import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Images/logo.png";
import InputText from "../../components/Input/InputText";
import ErrorText from "../../components/Typography/ErrorText";
import { postApi } from "../../redux/api";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { PermissionContext } from "../../components/AuthLayout/AuthLayout";
import { jwtDecode } from "jwt-decode";
import ConfirmLoginOverride from "../../components/ConfirmOverRideModal";
import { Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Login() {
  const navigate = useNavigate();

  const INITIAL_LOGIN_OBJ = {
    userName: "",
    password: "",
  };

  const INITIAL_ERROR_OBJ = {
    userNameErr: "",
    passwordERR: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(INITIAL_ERROR_OBJ);
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const context = useContext(PermissionContext)


  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (loginObj.userName.trim() === "")
      return setErrorMessage({ ...errorMessage, userNameErr: "UserName is required!" });
    if (loginObj.password.trim() === "")
      return setErrorMessage({ ...errorMessage, passwordERR: "Password is required!" });
    else {
      setLoading(true);
      // Call API to check user credentials and save token in localstorage
      const resp = await postApi('/login', loginObj).then((res) => {
        if (res?.data?.statusCode === 200) {
          localStorage.setItem("accessToken", res?.data?.data);
          const userData = jwtDecode(res?.data?.data);
          
          localStorage.setItem("userData", JSON.stringify({ name: userData?.userName, role: userData?.role }))
          context.permissionHandle(userData?.id, userData?.userName, userData?.role, userData?.code)

          localStorage.setItem("merchantCodes", JSON.stringify(userData?.code));

          const isVendor = userData?.role === "VENDOR" || userData?.role === "VENDOR_OPERATIONS";
          navigate(isVendor ? "/app/vendor-board" : "/app/dashboard");
        }
        else {
          if (res?.error?.error?.response?.status === 409) {
            // NotificationManager.error(res?.error?.message, 409);
            showModal()
          }
          else if (res?.error?.error?.response?.status === 404) {
            NotificationManager.error(res?.error?.message === "User not found" ? "Wrong credentials" : res?.error?.message, 404);
          }
          else {
            NotificationManager.error("Fail to login", 401);
          }
        }
      }).catch((err) => {
        NotificationManager.error(err?.response?.data?.error?.message, err?.response?.status);
      }).finally(() => {

        setLoading(false);
      })

    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  const toggleRememberMe = (e) => {
    // console.log("object");
  };

  //   For open the model
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const handleOk = () => {
    setIsModalOpen(false);
  };

  //   For cancel operation
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const proceedHandler = async () => {
    setLoading(true);
    let updateLoginObj = {
      ...loginObj,
      confirmOverRide: true
    }

    const resp = await postApi('/login', updateLoginObj).then((res) => {
      if (res?.data?.statusCode === 200) {
        localStorage.setItem("accessToken", res?.data?.data);
        const userData = jwtDecode(res?.data?.data);
        localStorage.setItem("userData", JSON.stringify({ name: userData?.userName, role: userData?.role }))
        context.permissionHandle(userData?.id, userData?.userName, userData?.role, userData?.code)

        localStorage.setItem("merchantCodes", JSON.stringify(userData?.code));

        const isVendor = userData?.role === "VENDOR" || userData?.role === "VENDOR_OPERATIONS";
        navigate(isVendor ? "/app/vendor-board" : "/app/dashboard");
      }
      else {
        NotificationManager.error("Fail to login", 401);
      }
    }).catch((err) => {
      NotificationManager.error(err?.response?.data?.error?.message, err?.response?.status);
    }).finally(() => {
      setLoading(false);
    })
  }

  return (
    <>
      <div className="min-h-screen bg-base-200 flex items-center">
        <div className="card mx-auto w-full max-w-5xl  shadow-xl">
          <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
            <div className="">
              {/* <LandingIntro /> */}
              <img src={`${logo}`} alt="logo"></img>
            </div>
            <div className="py-24 px-10">
              <h2 className="text-2xl font-semibold mb-2 text-center ">Login</h2>
              <form onSubmit={(e) => submitForm(e)}>
                <div className="mb-4">
                  <InputText
                    type="userName"
                    defaultValue={loginObj.userName}
                    updateType="userName"
                    containerStyle="mt-4"
                    labelTitle="User Name"
                    updateFormValue={updateFormValue}
                  />
                  {<ErrorText styleClass="mt-8">{errorMessage?.userNameErr}</ErrorText>}

                  <InputText
                    defaultValue={loginObj.password}
                    type={"password"}
                    updateType="password"
                    containerStyle="mt-4"
                    labelTitle="Password"
                    updateFormValue={updateFormValue}
                  />
                  {<ErrorText styleClass="mt-8">{errorMessage?.passwordERR}</ErrorText>}
                </div>
                <div className="mb-4">
                  <input type="checkbox" onClick={toggleRememberMe} />
                  <span> Remember me</span>
                </div>


                <Button
                  htmlType="submit"
                  className={
                    "btn mt-2 w-full bg-[#0b78c2] text-white hover:!bg-[#0b78c2] hover:!text-white hover:border-none"
                  }
                  loading={loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /> : ""}
                >
                  Login
                </Button>

              </form>
            </div>
          </div>
        </div>
        <NotificationContainer />
      </div>
      <ConfirmLoginOverride
        handleCancel={handleCancel}
        handleOk={handleOk}
        isModalOpen={isModalOpen}
        proceedHandler={proceedHandler}
        isLoading={loading}
      />
    </>
  );
}

export default Login;
