import { Table, Tag, Space, Button, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

export default function InventoryTable(
    {reports, loading, handleView, handleEdit, handleDelete, handleAccept}
) {
    const columns = [
        {
          title: 'Mã phiếu',
          dataIndex: 'id',
          key: 'id',
          width: '10%',
          render: id => <Tag color="processing" style={{padding: '4px 12px', borderRadius: '4px'}}>#{id}</Tag>
        },
        {
          title: 'Ngày kiểm kê', 
          dataIndex: 'check_date',
          key: 'check_date',
          width: '15%',
          render: (date) => <Text strong style={{color: '#1890ff'}}>{moment(date).format('DD/MM/YYYY')}</Text>,
        },
        {
          title: 'Ghi chú',
          dataIndex: 'note', 
          key: 'note',
          width: '45%',
          render: note => <Text>{note || 'Không có ghi chú'}</Text>
        },
        {
          title: 'Thao tác',
          key: 'actions',
          width: '30%',
          render: (_, record) => {
            if (record.status === 1) {
              return <Tag color="success">Đã chấp nhận</Tag>;
            }
            return (
              <Space size="middle" onClick={e => e.stopPropagation()}>
                <Button 
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(record);
                  }}
                >
                </Button>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa phiếu kiểm kê này?"
                  onConfirm={(e) => {
                    e.stopPropagation();
                    handleDelete(record.id);
                  }}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={e => e.stopPropagation()}
                  >
    
                  </Button>
                </Popconfirm>
                <Button 
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccept(record.id);
                  }}
                  style={{
                    backgroundColor: '#52c41a',
                    borderColor: '#52c41a',
                    borderRadius: '6px'
                  }}
                >
                  Chấp nhận
                </Button>
              </Space>
            );
          },
        },
    ];
    return (
    <Table
        columns={columns}
        dataSource={reports}
        loading={loading}
        rowKey="id"
        onRow={(record) => ({
        onClick: () => handleView(record),
        style: { cursor: 'pointer' }
        })}
        pagination={{
        pageSize: 10,
        showTotal: total => `Tổng ${total} phiếu kiểm kê`,
            showSizeChanger: true,
            style: { marginTop: '24px' }
        }}
        style={{ 
            marginTop: '16px',
            borderRadius: '8px',
            overflow: 'hidden'
        }}
    />
    );
}