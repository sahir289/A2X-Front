import { ExclamationCircleOutlined, CheckSquareTwoTone, CloseSquareTwoTone } from '@ant-design/icons';
import { Button, Dropdown, Input, Select, Tag } from "antd";
import Column from "antd/es/table/Column";
import { methodOptions, statusOptions } from "./Table";


const STATUS_BG = {
    SUCCESS: 'bg-green-600',
    ASSIGNED: 'bg-orange-400',
    DROPPED: 'bg-red-600',
}

const renderStatusTag = (status) => {
    let color = '';
    switch (status) {
        case 'INITIATED':
            color = 'grey';
            break;
        case 'SUCCESS':
            color = 'green';
            break;
        // Add other statuses and colors as needed
        default:
            color = 'default'; // Fallback color
    }
    return <Tag color={color} icon={status === "INITIATED" && <ExclamationCircleOutlined />}>{status}</Tag>
};

const ColumnSearch = ({ name, filters, onChange, isNumeric, ...props }) => {
    return (
        <Input
            {...props}
            value={filters[name]}
            onKeyDown={(e) => {
                const isControlKey = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key);
                const regex = isNumeric ? /^[0-9]$/ : /^[A-Za-z]$/;
                if (!isControlKey && !regex.test(e.key)) {
                    e.preventDefault();
                }
            }}
            name={name}
            className='w-full'
            onChange={(e) => {
                onChange(name, e.target.value)
            }}
            allowClear
        />
    )
}

const ColumnSelect = ({ name, options, filters, onChange, ...props }) => {
    return (
        <Select
            {...props}
            name={name}
            options={options}
            className='w-full'
            value={filters[name]}
            onChange={(v) => {
                onChange(name, v)
            }}
            allowClear
        />
    )
}
const ColumnSelectMultiple = ({ name, options, filters, onChange, ...props }) => {
    return (
        <Select
            {...props}
            name={name}
            options={options}
            className='w-full'
            value={filters[name]}
            onChange={(v) => {
                onChange(name, v)
            }}
            mode='multiple'
            allowClear={false}
            maxTagCount={'responsive'}
        />
    )
}

export const Columns = (merchantOptions, filters, onChange, updateSettlementStatus, userData) => {
    return (
        <>
            <Column
                title='ID'
                dataIndex='id'
                ellipsis
                width="100px"
                render={(v, r, i) => {
                    if (i) {
                        return v;
                    }
                    return <ColumnSearch name="id" min="1" onChange={onChange} filters={filters} isNumeric={true} />;
                }}
            />
            <Column
                title='Vendor'
                dataIndex='Vendor'
                width="130px"
                ellipsis

                render={(v, r, i) => {
                    if (i) {
                        return v?.vendor_code;
                    }
                    return <ColumnSelectMultiple name="code" options={merchantOptions} onChange={onChange} filters={filters}
                        disabled={(userData?.role === "VENDOR" || userData?.role === "VENDOR_OPERATIONS") ? true : false}
                    />
                }}
            />
            <Column
                title='Status'
                dataIndex='status'
                width="120px"
                ellipsis
                render={(v, r, i) => {
                    if (i) {
                        return renderStatusTag(v)
                    }
                    return <ColumnSelect name="status" options={statusOptions} onChange={onChange} filters={filters} />
                }}
            />
            <Column
                title='Amount'
                dataIndex='amount'
                width="100px"
                ellipsis
                render={(v, r, i) => {
                    if (i) {
                        return `₹${v}`;
                    }
                    return <ColumnSearch name="amount" onChange={onChange} filters={filters} isNumeric={true} />;
                }}
            />
            <Column
                title='Bank Details'
                dataIndex='acc_no'
                width="250px"
                ellipsis
                render={(v, r, i) => {
                    if (i) {
                        return (
                            <div>
                                <p>{r?.acc_name || "--" }</p>
                                <p>{r?.acc_no}</p>
                                <p>{r?.ifsc}</p>
                            </div>
                        );
                    }
                    return <ColumnSearch name="acc_no" onChange={onChange} filters={filters} isNumeric />;
                }}
            />
            <Column
                title='Method'
                dataIndex='method'
                width="120px"
                ellipsis
                render={(v, r, i) => {
                    if (i) {
                        if (typeof v !== "string") {
                            return;
                        }
                        const f = v.charAt(0);
                        const l = v.slice(1).toLowerCase();
                        return f + l;
                    }
                    return <ColumnSelect name="method" options={methodOptions} onChange={onChange} filters={filters} />
                }
                }
            />
            <Column
                title='Last Updated (IST)'
                dataIndex='updatedAt'
                width="140px"
                ellipsis
                render={(v) => v ? new Date(v).toDateString() : null}
            />
            <Column
                title='Ref.'
                dataIndex='refrence_id'
                width="200px"
                ellipsis
                render={(v, r, i) => {
                    if (i) {
                        return v || "--";
                    }
                    return <ColumnSearch name="refrence_id" onChange={onChange} filters={filters} isNumeric />;
                }}
            />

            {(userData?.role === "ADMIN" || userData?.role === "TRANSACTIONS" || userData?.role === "OPERATIONS") &&
                <Column
                    title='Option'
                    width="155px"
                    render={(v, r, i) => {
                        if (!i) {
                            return null;
                        }
                        if (r.status == "INITIATED") {
                            return (
                                // UI change of Approve and Reject Buttons
                                <>
                                    <CheckSquareTwoTone
                                        style={{
                                            fontSize: '40px',
                                            marginRight: '7px',
                                        }}
                                        twoToneColor="#52c41a"
                                        onClick={() =>
                                            updateSettlementStatus({
                                                record: r,
                                                key: "approve",
                                            })
                                        }
                                    />
                                    <CloseSquareTwoTone
                                        style={{
                                            fontSize: '40px',
                                            marginLeft: '7px',
                                        }}
                                        twoToneColor="#ff0000"
                                        onClick={() =>
                                            updateSettlementStatus({
                                                record: r,
                                                key: "reject",
                                            })
                                        }
                                    />
                                </>
                            )
                        }
                        return (
                            <Button onClick={() => updateSettlementStatus({
                                record: r,
                                reset: true,
                            })}>
                                Reset
                            </Button>);
                    }}
                />
            }
        </>
    )
}
