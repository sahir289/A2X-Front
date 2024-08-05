import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Images/logo.png";
import InputText from "../../components/Input/InputText";
import ErrorText from "../../components/Typography/ErrorText";
import { postApi } from "../../redux/api";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { PermissionContext } from "../../components/AuthLayout/AuthLayout";
import { jwtDecode } from "jwt-decode";

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

  const contex=useContext(PermissionContext)



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
      const resp =await  postApi('/login', loginObj).then((res) => {
        if (res?.data?.statusCode===200){
        localStorage.setItem("accessToken", res?.data?.data);
        const userData = jwtDecode(res?.data?.data);
        contex.permissionHandle(userData?.id, userData?.userName, userData?.role)
        navigate("/app/dashboard");

        }
        else{
          NotificationManager.error("Fail to login",401);
        }
      }).catch((err) => {
        NotificationManager.error(err?.response?.data?.error?.message,err?.response?.status );
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

  return (
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


              <button
                type="submit"
                className={
                  "btn mt-2 w-full btn-primary " + (loading ? " loading" : "")
                }
              >
                Login
              </button>

            </form>
          </div>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
}

export default Login;
