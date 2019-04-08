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


/* eslint react/no-multi-comp:0 */
@connect(({ pkg, loading }) => ({
    pkg,
    loading: loading.models.pkg,
  }))
@Form.create()
class PackageList extends PureComponent {
    state = {
        selectedRows: [],

    };
    columns = [
        {
            title: '包名称',
            dataIndex: 'name',
        },
        {
            title: '创建者',
            dataIndex: 'owner',
        },
        {
            title: '创建时间',
            dataIndex: 'creattime',
        },
        {
            title: '描述',
            dataIndex: 'desc',
        },
        {
            title: '操作',
            width: '18%',
            render: (text, record) => (
                <Fragment>
                  <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleUpdateModalVisible(true, record)}>删除</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleUpdateModalVisible(true, record)}>版本列表</a>
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
    
    
    render() {
        const {
            pkg: { data },
            loading,
        } = this.props;

        const { selectedRows } = this.state;

        
        return (
            <PageHeaderWrapper title="">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                    <StandardTable
                        selectedRows={selectedRows}
                        loading={loading}
                        data={data}
                        columns={this.columns}
                        onSelectRow={this.handleSelectRows}
                        
                    />
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }
}


export default PackageList;