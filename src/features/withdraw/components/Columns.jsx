import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Select, Tag } from "antd";
import Column from "antd/es/table/Column";
import { statusOptions } from '../../../utils/utils';

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

export const Columns = (merchantOptions, filters, onChange, updateWithdraw, type) => {
  return (
    <>
      <Column
        title='ID'
        dataIndex='sno'
        ellipsis
        width="100px"
        render={(v, r, i) => {
          if (i) {
            return v;
          }
          return <ColumnSearch name="sno" min="1" onChange={onChange} filters={filters} />;
        }}
      />
      <Column
        title='Merchant Order Id'
        dataIndex='merchant_order_id'
        width="130px"
        ellipsis
        render={(v, r, i) => {
          if (i) {
            return v;
          }
          return <ColumnSearch name="merchant_order_id" onChange={onChange} filters={filters} />;
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
        title='User'
        dataIndex='user_id'
        width="130px"
        ellipsis
        render={(v, r, i) => {
          if (i) {
            return v;
          }
          return <ColumnSearch name="user_id" onChange={onChange} filters={filters} />;
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
          return <ColumnSearch name="amount" onChange={onChange} filters={filters} />;
        }}
      />
      {
        type == "Completed" &&
        <Column
          title='Commission'
          dataIndex='payout_commision'
          width="100px"
          ellipsis
          render={(v, r, i) => {
            if (i) {
              return `₹${v}`;
            }
            return <ColumnSearch name="commission" onChange={onChange} filters={filters} />;
          }}
        />
      }
      <Column
        title='Bank Details'
        dataIndex='acc_no'
        width="250px"
        ellipsis
        render={(v, r, i) => {
          if (i) {
            return (
              <div>
                <p>{r?.bank_name}</p>
                <p>{r?.acc_holder_name}</p>
                <p>{r?.acc_no}</p>
                <p>{r?.ifsc_code}</p>
              </div>
            );
          }
          return <ColumnSearch name="acc_no" onChange={onChange} filters={filters} />;
        }}
      />
      {
        type == "All" &&
        <Column
          title='UTR Id'
          dataIndex='utr_id'
          width="140px"
          ellipsis
          render={(v, r, i) => {
            if (i) {
              return v;
            }
            return <ColumnSearch name="utr_id" onChange={onChange} filters={filters} />;
          }}
        />
      }
      <Column
        title='Payout UUID'
        dataIndex='id'
        width="140px"
        ellipsis
        render={(v, r, i) => {
          if (i) {
            return v;
          }
          return <ColumnSearch name="id" onChange={onChange} filters={filters} />;
        }}
      />
      <Column
        title='Last Updated'
        dataIndex='updatedAt'
        width="140px"
        ellipsis
        render={(v) => v ? new Date(v).toDateString() : null}
      />
      <Column
        title='Option'
        width="110px"
        render={(v, r, i) => {
          if (!i) {
            return null;
          }
          if (r.status == "INITIATED") {
            return (
              <Dropdown.Button
                type="primary"
                menu={{
                  items: [
                    {
                      key: 'approve',
                      label: 'Approve',
                    },
                    {
                      key: 'reject',
                      label: 'Reject',
                    },
                  ],
                  onClick: (info) => updateWithdraw({
                    record: r,
                    ...info,
                  }),
                }}
              >
                Approve
              </Dropdown.Button>
            )
          }
          return (
            <Button onClick={() => updateWithdraw({
              record: r,
              reset: true,
            })}>
              Reset
            </Button>);
        }}
      />
    </>
  )
}
