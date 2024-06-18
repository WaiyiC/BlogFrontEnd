import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { addDog, editDog } from '../services/dog.service';

const EditForm: React.FC<any> = ({ isNew, initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFormSubmit = async (values: any) => {
    try {
      await onSubmit(values); // Call handleAddDog or handleUpdateDog based on isNew
      message.success(`${isNew ? 'Dog added' : 'Dog updated'} successfully`);
      form.resetFields(); // Reset form fields after submission
    } catch (error) {
      console.error(`Error ${isNew ? 'adding' : 'updating'} dog:`, error);
      message.error(`Failed to ${isNew ? 'add' : 'update'} dog`);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFormSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input the dog\'s name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="breed"
        label="Breed"
        rules={[{ required: true, message: 'Please input the dog\'s breed!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="age"
        label="Age"
        rules={[{ required: true, message: 'Please input the dog\'s age!' }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input the dog\'s description!' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isNew ? 'Add' : 'Edit'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditForm;
