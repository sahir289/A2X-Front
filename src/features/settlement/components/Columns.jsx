import { Button, Input, Select } from "antd";
import Column from "antd/es/table/Column";
import { methodOptions, statusOptions } from "./Table";

const STATUS_BG = {
    SUCCESS: 'bg-green-600',
    ASSIGNED: 'bg-orange-400',
    DROPPED: 'bg-red-600',
}

const StatusRender = ({ v }) => {
    if (typeof v !== "string") {
        return
    }
    const bg = STATUS_BG[v];
    const f = v.charAt(0);
    const l = v.slice(1).toLowerCase();
    return (
        <div className='flex items-center gap-1'>
            <div className={`${bg} w-[5px] h-[5px] rounded-full`} />
            {f}{l}
        </div>
    )
}


const ColumnSearch = ({ name, filters, onChange, ...props }) => {
    return (
        <Input
            {...props}
            value={filters[name]}
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

export const Columns = (merchantOptions, filters, onChange) => {
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
                    return <ColumnSearch name="id" min="1" onChange={onChange} filters={filters} />;
                }}
            />
            <Column
                title='Merchant'
                dataIndex='Merchant'
                width="130px"
                ellipsis
                render={(v, r, i) => {
                    if (i) {
                        return v?.code;
                    }
                    return <ColumnSelect name="code" options={merchantOptions} onChange={onChange} filters={filters} />;
                }}
            />
            <Column
                title='Status'
                dataIndex='status'
                width="120px"
                ellipsis
                render={(v, r, i) => {
                    if (i) {
                        return <StatusRender v={v} />
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
                        return `$${v}`;
                    }
                    return <ColumnSearch name="amount" onChange={onChange} filters={filters} />;
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
                                <p>{r?.acc_name}</p>
                                <p>{r?.acc_no}</p>
                                <p>{r?.ifsc}</p>
                            </div>
                        );
                    }
                    return <ColumnSearch name="acc_no" onChange={onChange} filters={filters} />;
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
                dataIndex='reference_id'
                width="200px"
                ellipsis
                render={(v, r, i) => {
                    if (i) {
                        return v;
                    }
                    return <ColumnSearch name="reference_id" onChange={onChange} filters={filters} />;
                }}
            />
            <Column
                title='Option'
                width="110px"
                render={(v, r, i) => {
                    if (!i) {
                        return null;
                    }
                    return <Button> Reset </Button>;
                }}
            />
        </>
    )
}
