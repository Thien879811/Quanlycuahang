function CreateCrossProductPromotion() {
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      fetchProducts();
    }, []);
  
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        message.error('Không thể tải danh sách sản phẩm');
      }
    };
  
    const onFinish = async (values) => {
      setLoading(true);
      try {
        console.log(values);
        await axios.post('/api/promotions/cross-product', values);
        message.success('Tạo khuyến mãi mua sản phẩm này giảm giá sản phẩm khác thành công');
        form.resetFields();
      } catch (error) {
        message.error('Có lỗi xảy ra khi tạo khuyến mãi');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label="Tên khuyến mãi" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="code" label="Mã khuyến mãi" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="purchaseProductId" label="Sản phẩm mua" rules={[{ required: true }]}>
          <Select placeholder="Chọn sản phẩm mua">
            {products.map(product => (
              <Select.Option key={product.id} value={product.id}>
                {product.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="discountedProductId" label="Sản phẩm được giảm giá" rules={[{ required: true }]}>
          <Select placeholder="Chọn sản phẩm được giảm giá">
            {products.map(product => (
              <Select.Option key={product.id} value={product.id}>
                {product.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="discountPercentage" label="Phần trăm giảm giá" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} />
        </Form.Item>
        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo khuyến mãi
          </Button>
        </Form.Item>
      </Form>
    );
  }
export default CreateCrossProductPromotion;