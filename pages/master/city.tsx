import React, { useState, useEffect } from 'react';
import { Space, Table, Modal } from 'antd';
import { Button, Drawer } from 'antd';
import { Form, Input } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import router from 'next/router';

const City = () => {
    const { Search } = Input;
    const [form] = Form.useForm();

    const [open, setOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<any>(null);
    const [drawerTitle, setDrawerTitle] = useState('Create City');
    const [viewRecord, setViewRecord] = useState<any>(null);
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterData, setFilterData] = useState(dataSource);

    // get Tax datas
    useEffect(() => {
        GetTaxData();
    }, []);

    useEffect(() => {
        if (editRecord) {
            setDrawerTitle('Edit City');
        } else {
            setDrawerTitle('Create City');
        }
    }, [editRecord, open]);

    const GetTaxData = () => {
        const Token = localStorage.getItem('token');

        axios
            .get('https://xvt7fwb7-8000.inc1.devtunnels.ms/city_list/', {
                headers: {
                    Authorization: `Token ${Token}`,
                },
            })
            .then((res) => {
                setDataSource(res?.data);
                setFilterData(res.data);
            })
            .catch((error: any) => {
                if (error.response.status === 401) {
                    router.push('/');
                } 
            });
    };

    // Model
    const showModal = (record: any) => {
        setIsModalOpen(true);
        setViewRecord(record);
        modalData();
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // drawer
    const showDrawer = (record: any) => {
        if (record) {
            setEditRecord(record);
            form.setFieldsValue(record); // Set form values for editing
        } else {
            setEditRecord(null);
            form.resetFields();
        }

        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields();
    };

    // Table Datas
    const columns = [
        {
            title: 'City Name',
            dataIndex: 'name',
            key: 'id',
            className: 'singleLineCell',
        },

        {
            title: 'Actions',
            key: 'actions',
            className: 'singleLineCell',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <EyeOutlined style={{ cursor: 'pointer' }} onClick={() => showModal(record)} className="view-icon" rev={undefined} />

                    {localStorage.getItem('admin') === 'true' ? (
                        <EditOutlined style={{ cursor: 'pointer' }} onClick={() => showDrawer(record)} className="edit-icon" rev={undefined} />
                    ) : (
                        <EditOutlined style={{ cursor: 'pointer', display: 'none' }} onClick={() => showDrawer(record)} className="edit-icon" rev={undefined} />
                    )}

                    {/* <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => showDrawer(record)}
            className='edit-icon' rev={undefined} />


          {
            localStorage.getItem('admin') === 'true' ? (
              <DeleteOutlined
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDelete(record)}
                className='delete-icon'
                rev={undefined}
              />
            ) : (
              <DeleteOutlined
                style={{ display: "none" }}
                onClick={() => handleDelete(record)}
                className='delete-icon'
                rev={undefined}
              />
            )
          } */}
                </Space>
            ),
        },
    ];

    // const handleDelete = (record: any,) => {

    //   const Token = localStorage.getItem("token")

    //   Modal.confirm({
    //     title: "Are you sure, you want to delete this TAX record?",
    //     okText: "Yes",
    //     okType: "danger",
    //     onOk: () => {
    //       axios.delete(`https://xvt7fwb7-8000.inc1.devtunnels.ms/delete_tax/${record.id}`, {
    //         headers: {
    //           "Authorization": `Token ${Token}`
    //         }
    //       }).then((res) => {
    //         console.log(res)
    //         GetTaxData()
    //       }).catch((err) => {
    //         console.log(err)
    //       })

    //     },
    //   });
    // };

    // Search Bar
    const inputChange = (e: any) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredData = dataSource.filter((item: any) => item.name.toLowerCase().includes(searchValue));
        setFilterData(searchValue ? filteredData : dataSource);
    };

    // form submit
    const onFinish = (values: any) => {
        const Token = localStorage.getItem('token');

        if (editRecord) {
            axios
                .put(`https://xvt7fwb7-8000.inc1.devtunnels.ms/edit_city/${editRecord.id}/`, values, {
                    headers: {
                        Authorization: `Token ${Token}`,
                    },
                })
                .then((res: any) => {
                    GetTaxData();
                    setOpen(false);
                })
                .catch((error: any) => {
                    if (error.response.status === 401) {
                        router.push('/');
                    }
                });
        } else {
            axios
                .post('https://xvt7fwb7-8000.inc1.devtunnels.ms/create_city/', values, {
                    headers: {
                        Authorization: `Token ${Token}`,
                    },
                })
                .then((res: any) => {
                    GetTaxData();
                    setOpen(false);
                })
                .catch((error: any) => {
                    if (error.response.status === 401) {
                        router.push('/');
                    } 
                });

            form.resetFields();
        }
        onClose();
    };

    const onFinishFailed = (errorInfo: any) => {
    };

    type FieldType = {
        name?: string;
    };

    // Model Data
    const modalData = () => {
        const formatDate = (dateString: any) => {
            if (!dateString) {
                return 'N/A'; // or handle it according to your requirements
            }

            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return 'Invalid Date'; // or handle it according to your requirements
            }

            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);
        };

        const data = [
            {
                label: 'City Name:',
                value: viewRecord?.name || 'N/A',
            },
            {
                label: 'Created By:',
                value: viewRecord?.created_by || 'N/A',
            },
            {
                label: 'Created Date:',
                value: formatDate(viewRecord?.created_date),
            },
            {
                label: 'Modified By:',
                value: viewRecord?.modified_by || 'N/A',
            },
            {
                label: 'Modified Date:',
                value: formatDate(viewRecord?.modified_date),
            },
        ];
        return data;
    };

    const scrollConfig: any = {
        x: true,
        y: 300,
    };

    return (
        <>
            <div className="panel">
                <div className="tax-heading-main">
                    <div>
                        <h1 className="text-lg font-semibold dark:text-white-light">Manage City</h1>
                    </div>
                    <div>
                        <Search placeholder="Input search text" onChange={inputChange} enterButton className="search-bar" />
                        <button type="button" onClick={() => showDrawer(null)} className="create-button">
                            + Create City
                        </button>
                    </div>
                </div>
                <div className="table-responsive">
                    <Table dataSource={filterData} columns={columns} pagination={false} scroll={scrollConfig} />
                </div>

                <Drawer title={drawerTitle} placement="right" width={600} onClose={onClose} open={open}>
                    <Form name="basic" layout="vertical" form={form} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                        <Form.Item<FieldType> label="City Name" name="name" required={true} rules={[{ required: true, message: 'City Name field is required.' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <div className="form-btn-main">
                                <Space>
                                    <Button danger htmlType="submit" onClick={() => onClose()}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Space>
                            </div>
                        </Form.Item>
                    </Form>
                </Drawer>

                {/* Modal */}
                <Modal title="View Tax" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                    {modalData()?.map((value: any) => {
                        return (
                            <>
                                <div className="content-main">
                                    <p className="content-1">{value?.label}</p>
                                    <p className="content-2">{value?.value}</p>
                                </div>
                            </>
                        );
                    })}
                </Modal>
            </div>
        </>
    );
};

export default City;
