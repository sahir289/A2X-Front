import { LoadingOutlined } from "@ant-design/icons"
import { Spin } from "antd"

function SuspenseContent() {
  return (
    <div className="w-full h-screen text-gray-300 dark:text-gray-200 bg-base-100 flex justify-center items-center">
       <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  )
}

export default SuspenseContent
