import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Typography, Card, Row, Col, Form, message, Spin } from 'antd';
import { PlusOutlined, DownloadOutlined, BarChartOutlined } from '@ant-design/icons';
import OverallInventory from '../../components/admin/product/OverallInventory.jsx';
import ProductsTable from '../../components/admin/product/ProductsTable.jsx';
import useProducts from '../../utils/productUtils';
import useCatalogs from '../../utils/catalogUtils';
import useFactories from '../../utils/factoryUtils';
import ProductForm from '../../pages/admin/products/productForm';
import ProductService from '../../services/product.service';
import { handleResponse } from '../../functions';
import * as XLSX from 'xlsx';
const { Content } = Layout;
const { Title } = Typography;

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [factories, setFactories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getInfoInventory();
      const data = handleResponse(response);
      console.log(data);
      setProducts(data.product);
      setCatalogs(data.catalog);
      setFactories(data.factory);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const exportToExcel = () => {
    try {
      // Chuẩn bị dữ liệu cho file Excel
      const exportData = products.map((product, index) => ({
        'STT': index + 1,
        'Mã sản phẩm': product.id,
        'Tên sản phẩm': product.product_name,
        'Danh mục': catalogs.find(c => c.id === product.catalogy_id)?.catalogy_name || '',
        'Nhà sản xuất': factories.find(f => f.id === product.factory_id)?.factory_name || '',
        'Số lượng': product.quantity,
        'Giá': product.price,
        'Trạng thái': product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'
      }));

      // Tạo workbook và worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách sản phẩm");

      // Tự động điều chỉnh độ rộng cột
      const colWidths = [
        { wch: 5 },  // STT
        { wch: 12 }, // Mã sản phẩm
        { wch: 30 }, // Tên sản phẩm
        { wch: 20 }, // Danh mục
        { wch: 25 }, // Nhà sản xuất
        { wch: 10 }, // Số lượng
        { wch: 15 }, // Giá
        { wch: 12 }  // Trạng thái
      ];
      ws['!cols'] = colWidths;

      // Xuất file
      XLSX.writeFile(wb, "danh-sach-san-pham.xlsx");
      message.success('Xuất file Excel thành công!');
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      message.error('Có lỗi xảy ra khi xuất file Excel');
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
        <Spin spinning={loading}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card>
                <Title level={2} style={{ marginBottom: 0 }}>
                  <BarChartOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                  Tổng quan tồn kho
                </Title>
              </Card>
            </Col>
            <Col span={24}>
              <Card>
                <OverallInventory products={products} catalogs={catalogs} loadData={loadData} />
              </Card>
            </Col>
            <Col span={24}>
              <Card>
                <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showModal} size="large">
                    Thêm sản phẩm
                  </Button>
                  <Button icon={<DownloadOutlined />} size="large" onClick={exportToExcel}>
                    Tải xuống tất cả
                  </Button>
                </Space>
                <ProductsTable products={products} loadData={loadData} catalogs={catalogs} factories={factories}/>
              </Card>
            </Col>
          </Row>
        </Spin>
      </Content>
      
      <ProductForm 
        visible={isModalVisible}
        form={form} 
        catalogs={catalogs} 
        factories={factories} 
        setIsModalVisible={setIsModalVisible}
        onCancel={handleCancel}
        initialValues={null}
        loadData={loadData}
      />
    </Layout>
  );
};

export default ProductAdmin;