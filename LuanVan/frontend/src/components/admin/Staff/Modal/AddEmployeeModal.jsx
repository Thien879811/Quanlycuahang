import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const AddEmployeeModal = ({ visible, onCancel, onAddEmployee }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onAddEmployee(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add New Employee"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="name" rules={[{ required: true, message: 'Please input the employee name!' }]}>
          <Input placeholder="Employee Name" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Employee
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;
