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

import styles from './PackageVersionList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;

@connect(({ pkg, loading }) => ({
    pkg,
    loading: loading.models.pkg,
  }))
@Form.create()
class PackageVersionList extends PureComponent {
    state = {
        selectedRows: [],
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
               
            </PageHeaderWrapper>
        );
    }
}



export default PackageVersionList;