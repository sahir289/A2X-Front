import Modal from 'antd/es/modal/Modal'
import React, { useEffect, useState } from 'react'
import { NotificationManager } from 'react-notifications'
import { getApi, postApi } from '../../../redux/api'
import InputText from '../../Input/InputText'
import SelectDropdown from '../../Input/SelectDropdown'
import ErrorText from '../../Typography/ErrorText'

const AddUserModal = (props) => {

  const { isAddUserModalOpen, handleOk, handleCancel, fetchUsersData } = props
  const INITIAL_USER_OBJ = {
    userName: "",
    password: "",
    fullName:"",
    role:"MERCHANT",
    code:""
  };

  const INITIAL_ERROR_OBJ = {
    userNameERR: "",
    passwordERR: "",
    fullNameERR: "",
    roleERR: "",
    merchantCodeERR: ""
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(INITIAL_ERROR_OBJ);
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);
  const [merchantCodeOptions, setMerchantCodeOptions] = useState([])

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (userObj.fullName.trim() === "")
      return setErrorMessage({ ...errorMessage, fullNameERR: "Full Name is required!" });
    if (userObj.userName.trim() === "")
      return setErrorMessage({ ...errorMessage, userNameERR: "UserName is required!" });
    if (userObj.password.trim() === "")
      return setErrorMessage({ ...errorMessage, passwordERR: "Password is required!" });
    if (userObj.role.trim() === "")
      return setErrorMessage({ ...errorMessage, roleERR: "Role is required!" });
    if ((userObj.role.trim() === "MERCHANT" || userObj.role.trim() === "OPERATIONS") && userObj.code.trim() === "")
      return setErrorMessage({ ...errorMessage, merchantCodeERR: "Merchant Code is required!" });

    else {

      // if (userObj.role !== "MERCHANT" || userObj.role !== "OPERATIONS") {
      //   delete userObj['code']
      // }
      // console.log("USER", finalData)
      // Call API to check user credentials and save token in localstorage
      setLoading(true);
      postApi('/create-user', userObj)
        .then((res) => {
          // localStorage.setItem("accessToken", res?.data?.data);
          // navigate("/app/dashboard");
          if (res.error) {

            setLoading(false);
            NotificationManager.error(res.error.message, "Error");
            return;
          }
          fetchUsersData()
          setLoading(false);
          handleCancel()
        })
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setUserObj({ ...userObj, [updateType]: value });
  };

  useEffect(()=>{
    if(isAddUserModalOpen){
    setErrorMessage(INITIAL_ERROR_OBJ)
    setUserObj(INITIAL_USER_OBJ)
    }
  }, [isAddUserModalOpen])

  const fetchMerchantData = async () => {
    const merchantApiRes = await getApi('/getall-merchant');
    if (merchantApiRes.error) {
      console.log(merchantApiRes.error)
      return
    }

    const dropdownOptions = merchantApiRes?.data?.data?.merchants?.map(merchant => ({
      label: merchant.code,
      value: merchant.code
    }));
    setMerchantCodeOptions(dropdownOptions)
  }

  useEffect(() => {
    fetchMerchantData()
  }, [])
  return (
    <>
      <Modal title="Add User" open={isAddUserModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <InputText
          type="text"
          defaultValue={userObj.fullName}
          updateType="fullName"
          containerStyle="mt-4"
          labelTitle="Full Name"
          updateFormValue={updateFormValue}
        />
        {<ErrorText styleClass="mt-8">{errorMessage?.fullNameERR}</ErrorText>}
        <InputText
          type="text"
          defaultValue={userObj.userName}
          updateType="userName"
          containerStyle="mt-4"
          labelTitle="User Name"
          updateFormValue={updateFormValue}
        />
        {<ErrorText styleClass="mt-8">{errorMessage?.userNameERR}</ErrorText>}
        <InputText
          type="password"
          defaultValue={userObj.password}
          updateType="password"
          containerStyle="mt-4"
          labelTitle="Password"
          updateFormValue={updateFormValue}
        />
        {<ErrorText styleClass="mt-8">{errorMessage?.passwordERR}</ErrorText>}
        <SelectDropdown
          defaultValue={userObj.role}
          updateType="role"
          containerStyle="mt-4"
          labelTitle="Role"
          options={[
            // { label: 'vendor', value: 'VENDOR' },
            { label: 'merchant', value: 'MERCHANT' },
            { label: 'customerService', value: 'CUSTOMER_SERVICE' },
            { label: 'transactions', value: 'TRANSACTIONS' },
            { label: 'operations', value: 'OPERATIONS' },
            { label: 'admin', value: 'ADMIN' }
          ]}
          updateFormValue={updateFormValue}
        />
        {<ErrorText styleClass="mt-8">{errorMessage?.roleERR}</ErrorText>}
        {(userObj?.role === "MERCHANT" || userObj?.role === "OPERATIONS") && <> <SelectDropdown
          defaultValue={userObj.code}
          updateType="code"
          containerStyle="mt-4"
          labelTitle="Merchant Code"
          options={merchantCodeOptions}
          updateFormValue={updateFormValue}
        />

          {<ErrorText styleClass="mt-8">{errorMessage?.merchantCodeERR}</ErrorText>}
        </>
        }
        <button
          // type="submit"
          onClick={submitForm}
          className={
            "btn mt-2 w-full btn-primary " + (loading ? " loading" : "")
          }
        >Add
        </button>
      </Modal></>
  )
}

export default AddUserModal
