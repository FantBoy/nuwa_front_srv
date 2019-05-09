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
  Tag,
  Icon,
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

import styles from './NodeList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'success', 'error'];
const status = ['已下线', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建设备"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        ip: props.values.ip,
        desc: props.values.desc,
        ownergroup: props.values.ownergroup,
        key: props.values.key,
        status: props.values.status.toString(),
        owner: props.values.owner,
        // target: '0',
        // template: '0',
        // type: '1',
        // time: '',
        // frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 1) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="ip" {...this.formLayout} label="设备地址">
          {form.getFieldDecorator('ip', {
            rules: [{ required: true, message: '请输入设备地址！' }],
            initialValue: formVals.ip,
          })(<Input placeholder="请输入" />)}
        </FormItem>,
        

        <FormItem key="ownergroup" {...this.formLayout} label="所属分组">
          {form.getFieldDecorator('ownergroup', {
              initialValue: formVals.ownergroup,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        
        <FormItem key="status" {...this.formLayout} label="设备状态">
          {form.getFieldDecorator('status', {
            initialValue: formVals.status,
          })(
            <RadioGroup>
              <Radio value="0">下线</Radio>
              <Radio value="1">上线</Radio>
              <Radio value="2">异常</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    
    return [
      <FormItem key="name" {...this.formLayout} label="设备名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入设备名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="owner" {...this.formLayout} label="设备归属">
      {form.getFieldDecorator('owner', {
        rules: [{ required: true, message: '请输入设备归属！' }],
        initialValue: formVals.owner,
      })(<Input placeholder="请输入" />)}
    </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="设备描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的设备描述！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible } = this.props;
    // if (currentStep === 1) {
    //   return [
    //     <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
    //       上一步
    //     </Button>,
    //     <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
    //       取消
    //     </Button>,
    //     <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
    //       下一步
    //     </Button>,
    //   ];
    // }
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="设备属性" />
         
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}


/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
    rule,
    loading: loading.models.data,
  }))
@Form.create()
class NodeList extends PureComponent {
    state = {
        modalVisible: false,
        selectedRows: [],
        stepFormValues: {},
        updateModalVisible: false,
    };
    columns = [
        {
            title: '设备名称',
            dataIndex: 'device_name',
        },
        {
            title: '设备地址',
            dataIndex: 'device_ip',
        },
        {
          title: '所属分组',
          dataIndex: 'group',
          // filters: [
          //   {
          //     text: 'group_0',
          //     value: 0,
          //   },
          //   {
          //     text: 'group_1',
          //     value: 1,
          //   },
            
          // ],
      },
        {
            title: '描述',
            dataIndex: 'desc',
        },
        {
            title: '状态',
            dataIndex: 'status',
            filters: [
              {
                text: status[0],
                value: 0,
              },
              {
                text: status[1],
                value: 1,
              },
              {
                text: status[2],
                value: 2,
              },
            ],
            render(val) {
                return <Badge status={statusMap[val]} text={status[val]} />;
            },
            
        },
        {
            title: '操作',
            render: (text, record) => (
              <Fragment>
                <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
                <Divider type="vertical" />
                <a href="">包部署详情</a>
              </Fragment>
            ),
          },
    ];

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'rule/fetch',
        });
    };

    handleUpdateModalVisible = (flag, record) => {
      
        this.setState({
          updateModalVisible: !!flag,
          stepFormValues: record || {},
        });
    };
    handleModalVisible = flag => {
        this.setState({
          modalVisible: !!flag,
        });
    };
    handleSelectRows = rows => {
        this.setState({
          selectedRows: rows,
        });
    };
    handleAdd = fields => {
      const { dispatch } = this.props;
      dispatch({
        type: 'rule/add',
        payload: {
          name: fields.name,
        },
      });
  
      message.success('添加成功');
      this.handleModalVisible();
    };
    handleUpdate = fields => {
      const { dispatch } = this.props;
      dispatch({
        type: 'rule/update',
        payload: {
          name: fields.name,
          ip: fields.ip,
          status: parseInt(fields.status),
          owner: fields.owner,
          desc: fields.desc,
          key: fields.key,
        },
      });
  
      message.success('配置成功');
      this.handleUpdateModalVisible();
    };
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
    
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
          const newObj = { ...obj };
          newObj[key] = getValue(filtersArg[key]);
          return newObj;
        }, {});
        
        const params = {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          ...formValues,
          ...filters,
        };
        if (sorter.field) {
          params.sorter = `${sorter.field}_${sorter.order}`;
        }
    
        dispatch({
          type: 'rule/fetch',
          payload: params,
        });
    };

    render() {
        const {
          rule: { data },
          loading,
        } = this.props;
        const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

        const parentMethods = {
          handleAdd: this.handleAdd,
          handleModalVisible: this.handleModalVisible,
        };
        const updateMethods = {
          handleUpdateModalVisible: this.handleUpdateModalVisible,
          handleUpdate: this.handleUpdate,
        };
        
        return (
          <PageHeaderWrapper title="">
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新建
                  </Button>
                </div>
                <div className={styles.tableList}>
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </div>
            </Card>
            <CreateForm {...parentMethods} modalVisible={modalVisible} />
            {stepFormValues && Object.keys(stepFormValues).length ? (
              <UpdateForm
                {...updateMethods}
                updateModalVisible={updateModalVisible}
                values={stepFormValues}
              />
            ) : null}
          </PageHeaderWrapper>
        );
    }
}


export default NodeList;