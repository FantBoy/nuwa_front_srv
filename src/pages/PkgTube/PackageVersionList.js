import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
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
  Radio
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./PackageVersionList.less";

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;

@connect(({ version, loading }) => ({
  version,
  loading: loading.models.version
}))
@Form.create()
class PackageVersionList extends PureComponent {
  state = {
    selectedRows: []
  };

  columns = [
    {
      title: "版本号",
      dataIndex: "version",
      render(val) {
        return <Tag color="green">{val}</Tag>;
      }
    },
    {
      title: "安装数",
      dataIndex: "installed_number"
    },
    {
      title: "创建者",
      dataIndex: "owner"
    },
    {
      title: "创建时间",
      dataIndex: "createtime",
      render(val) {
        return moment(val).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      title: "版本简介",
      dataIndex: "desc"
    },
    {
      title: "操作",
      width: "20%",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            版本详情
          </a>
          {/* <Divider type="vertical" />
          <a onClick={() => this.handleDeletePackage(record)}>删除</a> */}
          <Divider type="vertical" />
          <a onClick={() => this.handleDeletePackage(true, record)}>部署详情</a>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "version/fetch"
    });
  }

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
      ...filters
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: "version/fetch",
      payload: params
    });
  };

  render() {
    const {
      version: { data },
      loading
    } = this.props;
    console.log(this.props.location.params);
    const { modalVisible, selectedRows, editItemData } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate
    };

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleEditModalVisible(true)}
              >
                新建版本
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
