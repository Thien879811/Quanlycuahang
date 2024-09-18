import React from 'react';
import { Modal, Form, Select, DatePicker, TimePicker, Button } from 'antd';

const { Option } = Select;

const AddTaskModal = ({ visible, onCancel, onAddTask, employees }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onAddTask(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add New Task"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="employeeId" rules={[{ required: true, message: 'Please select an employee!' }]}>
          <Select placeholder="Select Employee">
            {employees.map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="date" rules={[{ required: true, message: 'Please select a date!' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="startTime" rules={[{ required: true, message: 'Please select a start time!' }]}>
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>
        <Form.Item name="endTime" rules={[{ required: true, message: 'Please select an end time!' }]}>
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Task
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTaskModal;
