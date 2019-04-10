import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Tag,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './PackageList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
    const { 
        modalVisible, 
        form, 
        handleAdd, 
        handleModalVisible,
        handleUpdate,
        values
    } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            
            if (JSON.stringify(values) == "{}"){
                handleAdd(fieldsValue);
            }
            else{
                handleUpdate(values.key, fieldsValue);
            }
        });
    };
    const formLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 13 },
    };
    return (
        <Modal
            destroyOnClose
            title="新建版本包"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible(values)}
            >
            <FormItem {...formLayout} label="包名称">
                {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入至少三个字符的包名称！', min: 3 }],
                initialValue: values.name,
                })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formLayout} label="包属性">
                {form.getFieldDecorator('type', {
                rules: [{ required: true, message: '请输入至少三个字符的包属性！', min: 3 }],
                initialValue: values.type,
                })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formLayout} label="包归属">
                {form.getFieldDecorator('owner', {
                rules: [{ required: true, message: '请输入至少三个字符的包归属！', min: 3 }],
                initialValue: values.owner,
                })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formLayout} label="创建时间" >
                {form.getFieldDecorator('createtime', {
                rules: [{ required: true, message: '请选择创建时间' }],
                initialValue: values.createtime ? moment(values.createtime) : null,
                })(
                <DatePicker
                    showTime
                    placeholder="请选择"
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                />
                )}
            </FormItem>
            <FormItem {...formLayout} label="包简介">
                {form.getFieldDecorator('desc', {
                rules: [{ message: '请输入至少五个字符的包简介！', min: 5 }],
                initialValue: values.desc,
                })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
            </FormItem>
        </Modal>
    );
    });

/* eslint react/no-multi-comp:0 */
@connect(({ pkg, loading }) => ({
    pkg,
    loading: loading.models.pkg,
  }))
@Form.create()
class PackageList extends PureComponent {
    state = {
        selectedRows: [],
        modalVisible: false,
        editItemData: {},
    };
    columns = [
        {
            title: '包名称',
            dataIndex: 'name',
        },
        {
            title: '包属性',
            dataIndex: 'type',
            filters: [
                {
                  text: '服务版本包',
                  value: 0,
                },
                {
                  text: '脚本包',
                  value: 1,
                },
                
            ],
            render(val) {
                if("脚本包" == val)
                {
                    return <Tag color="blue">{val}</Tag>;
                }
                else
                {
                    return <Tag color="purple">{val}</Tag>;
                }
                
            },
        },
        {
            title: '创建者',
            dataIndex: 'owner',
        },
        {
            title: '创建时间',
            dataIndex: 'createtime',
            render(val){
                return moment(val).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: '包简介',
            dataIndex: 'desc',
        },
        {
            title: '操作',
            width: '18%',
            render: (text, record) => (
                <Fragment>
                  <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleDeletePackage(record)}>删除</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleDeletePackage(true, record)}>版本列表</a>
                </Fragment>
              ),
          },
    ];


    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'pkg/fetch',
        });
    };
    handleSelectRows = rows => {
        this.setState({
          selectedRows: rows,
        });
    };
    handleModalVisible = values => {
        if ({} == values){
            this.handleEditModalVisible();
        }
        else{
            this.handleUpdateModalVisible();
        }
    };
    handleDeletePackage = item => {
        Modal.confirm({
            title: '删除版本包',
            content: '确定要删除该版本包吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.deleteItem(item.name),
        });
    };
    handleEditModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
          });
    };

    handleUpdateModalVisible = (flag, record) => {
        this.setState({
            modalVisible: !!flag,
            editItemData: record || {},
        });
    };
    deleteItem = name => {
        const { dispatch } = this.props;
        dispatch({
          type: 'pkg/del',
          payload: {
            name: name,
          },
        });
    
        message.success('删除成功');
        this.handleEditModalVisible();
    };

    handleAdd = fields => {
        const { dispatch } = this.props;
        dispatch({
          type: 'pkg/add',
          payload: {
            name: fields.name,
            type: fields.type,
            owner: fields.owner,
            createtime: fields.createtime,
            desc: fields.desc
          },
        });
    
        message.success('添加成功');
        this.handleEditModalVisible();
    };

    handleUpdate = (key, fields) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'pkg/update',
          payload: {
            key: key,
            name: fields.name,
            type: fields.type,
            owner: fields.owner,
            createtime: fields.createtime,
            desc: fields.desc
          },
        });
        message.success('更新成功');
        this.handleUpdateModalVisible();
    };

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
    
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
          const newObj = { ...obj };
          newObj[key] = getValue(filtersArg[key]);
          return newObj;
        }, {});
        
        const params = {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          ...filters,
        };
        if (sorter.field) {
          params.sorter = `${sorter.field}_${sorter.order}`;
        }
    
        dispatch({
          type: 'pkg/fetch',
          payload: params,
        });
    };
    render() {
        const {
            pkg: { data },
            loading,
        } = this.props;

        const { modalVisible, selectedRows, editItemData } = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            handleUpdate: this.handleUpdate,
        };
        
        return (
            <PageHeaderWrapper title="">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleEditModalVisible(true)}>
                                新建
                            </Button>
                        </div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            columns={this.columns}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                <CreateForm {...parentMethods} modalVisible={modalVisible} values={editItemData}/>
            </PageHeaderWrapper>
        );
    }
}


export default PackageList;