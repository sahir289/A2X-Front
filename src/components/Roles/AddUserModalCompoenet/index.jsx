import React, { useEffect, useState } from 'react'
import Modal from 'antd/es/modal/Modal'
import InputText from '../../Input/InputText'
import { Select } from 'antd'
import SelectDropdown from '../../Input/SelectDropdown'
import ErrorText from '../../Typography/ErrorText'
import { postApi, getApi } from '../../../redux/api'
import { NotificationContainer, NotificationManager } from 'react-notifications';

const AddUserModal = (props) => {

  const { isAddUserModalOpen, handleOk, handleCancel, fetchUsersData }=props
  const INITIAL_USER_OBJ = {
    userName: "",
    password: "",
    fullName:"",
    role:"MERCHANT",
    merchantCode:""
  };

  const INITIAL_ERROR_OBJ = {
    userNameERR: "",
    passwordERR: "",
    fullNameERR: "",
    roleERR: "",
    merchantCodeERR:""
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(INITIAL_ERROR_OBJ);
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);
  const [merchantCodeOptions,setMerchantCodeOptions]=useState([])

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
    if ((userObj.role.trim() === "MERCHANT" || userObj.role.trim() === "OPERATIONS") &&userObj.merchantCode.trim() === "" )
      return setErrorMessage({ ...errorMessage, merchantCodeERR: "Merchant Code is required!" });

    else {
      setLoading(true);
      if (userObj.role !== "MERCHANT" || userObj.role !== "OPERATIONS"){
        delete userObj['merchantCode']
      }
      else{
        userObj['code'] = userObj.merchantCode
        delete userObj['merchantCode']
      }
      // Call API to check user credentials and save token in localstorage
      const resp = postApi('/create-user', userObj).then((res) => {
        // localStorage.setItem("accessToken", res?.data?.data);
        // navigate("/app/dashboard");

      }).catch((err) => {
        NotificationManager.error(err?.response?.data?.error?.message, err?.response?.status);
      }).finally(() => {
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
    try {
      const merchantApiRes = await getApi('/getall-merchant')

      const dropdownOptions = merchantApiRes?.data?.data?.merchants?.map(merchant => ({
        label: merchant.code,
        value: merchant.code
      }));
      setMerchantCodeOptions(dropdownOptions)

    } catch (error) {
      console.log(error)
    }
    finally {
    }

  }

  useEffect(()=>{
    fetchMerchantData()
  },[])
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
          defaultValue={userObj.merchantCode}
          updateType="merchantCode"
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
