import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import All from "../../../features/addData/All";
import { setPageTitle } from "../../../redux/slice/headerSlice";

const AddData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Add Data" }));
  }, []);

  return <All />;
};

export default AddData;
