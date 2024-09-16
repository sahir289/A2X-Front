import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import VendorBoard from "../../features/vendorBoard";
import { setPageTitle } from "../../redux/slice/headerSlice";
import { PermissionContext } from "../../components/AuthLayout/AuthLayout";

function InternalPage() {
  const dispatch = useDispatch();
  const AllowedRoles = ["ADMIN", "OPERATIONS", "VENDOR","VENDOR_OPERATIONS"];
  const context = useContext(PermissionContext);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Vendor Board" }));
  }, []);

  return <>{AllowedRoles.includes(context.role) && <VendorBoard />}</>;
}

export default InternalPage;
