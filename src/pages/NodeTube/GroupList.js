import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './GroupList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ list, loading }) => ({
    list,
    loading: loading.models.list,
  }))

@Form.create()
class GroupList extends PureComponent {
    state = { visible: false, done: false };
    formLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 13 },
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'list/fetch',
          payload: {
            count: 5,
          },
        });
    };
    showModal = () => {
        this.setState({
          visible: true,
          current: undefined,
        });
    };
    showEditModal = item => {
        this.setState({
          visible: true,
          current: item,
        });
      };
    handleDone = () => {
        setTimeout(() => this.addBtn.blur(), 0);
        this.setState({
          done: false,
          visible: false,
        });
      };
    
      handleCancel = () => {
        setTimeout(() => this.addBtn.blur(), 0);
        this.setState({
          visible: false,
        });
      };
      handleSubmit = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        const { current } = this.state;
        const id = current ? current.id : '';
    
        setTimeout(() => this.addBtn.blur(), 0);
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          this.setState({
            done: true,
          });
          dispatch({
            type: 'list/submit',
            payload: { id, ...fieldsValue },
          });
        });
      };

      editAndDelete = (key, currentItem) => {
        if (key === 'edit') this.showEditModal(currentItem);
        else if (key === 'delete') {
          Modal.confirm({
            title: '删除分组',
            content: '确定删除该分组吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.deleteItem(currentItem.id),
          });
        }
    };
    deleteItem = id => {
      const { dispatch } = this.props;
      dispatch({
        type: 'list/submit',
        payload: { id },
      });
    };
    render() {
        const {
            list: { list },
            loading,
          } = this.props;
          const {
            form: { getFieldDecorator },
          } = this.props;
          const { visible, done, current = {} } = this.state;
      
        
        

        const Info = ({ title, value, bordered }) => (
            <div className={styles.headerInfo}>
              <span>{title}</span>
              <p>{value}</p>
              {bordered && <em />}
            </div>
        );
        const extraContent = (
            <div className={styles.extraContent}>
              {/* <RadioGroup defaultValue="all">
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="progress">进行中</RadioButton>
                <RadioButton value="waiting">等待中</RadioButton>
              </RadioGroup> */}
              {/* <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} /> */}
            </div>
        );
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: 50,
            // total: 50,
        };

        const ListContent = ({ data: { owner, modify_time} }) => (
            <div className={styles.listContent}>
              {/* <div className={styles.listContentItem}>
                <span>Owner</span>
                <p>{owner}</p>
              </div> */}
              <div className={styles.listContentItem}>
                <span>创建时间</span>
                <p>{moment(modify_time).format('YYYY-MM-DD HH:mm')}</p>
              </div>
              {/* <div className={styles.listContentItem}>
                <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
              </div> */}
            </div>
        );
      
        const MoreBtn = props => (
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
                  <Menu.Item key="edit">编辑</Menu.Item>
                  <Menu.Item key="delete">删除</Menu.Item>
                </Menu>
              }
            >
              <a>
                更多 <Icon type="down" />
              </a>
            </Dropdown>
        );
        const modalFooter = done
        ? { footer: null, onCancel: this.handleDone }
        : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
  
        const getModalContent = () => {
            if (done) {
              return (
                <Result
                  type="success"
                  title="操作成功"
                  description="一系列的信息描述，很短同样也可以带标点。"
                  actions={
                    <Button type="primary" onClick={this.handleDone}>
                      知道了
                    </Button>
                  }
                  className={styles.formResult}
                />
              );
            }
            if (current) {
              return (
                <Form onSubmit={this.handleSubmit}>
                  <FormItem label="分组名称" {...this.formLayout}>
                    {getFieldDecorator('group_name', {
                      rules: [{ required: true, message: '请输入分组名称' }],
                      initialValue: current.group_name,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                  
                  <FormItem {...this.formLayout} label="分组描述">
                    {getFieldDecorator('desc', {
                      rules: [{ message: '请输入至少五个字符的分组描述！', min: 5 }],
                      initialValue: current.desc,
                    })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
                  </FormItem>
                </Form>
              );
            }
            return (
              <Form onSubmit={this.handleSubmit}>
                <FormItem label="分组名称" {...this.formLayout}>
                  {getFieldDecorator('group_name', {
                    rules: [{ required: true, message: '请输入分组名称' }],
                    initialValue: current.group_name,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="创建时间" {...this.formLayout}>
                  {getFieldDecorator('modify_time', {
                    rules: [{ required: true, message: '请选择创建时间' }],
                    initialValue: current.modify_time ? moment(current.modify_time) : null,
                  })(
                    <DatePicker
                      showTime
                      placeholder="请选择"
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>
                {/* <FormItem label="分组负责人" {...this.formLayout}>
                  {getFieldDecorator('owner', {
                    rules: [{ required: true, message: '请选择分组负责人' }],
                    initialValue: current.owner,
                  })(
                    <Select placeholder="请选择">
                      <SelectOption value="付晓晓">付晓晓</SelectOption>
                      <SelectOption value="周毛毛">周毛毛</SelectOption>
                    </Select>
                  )}
                </FormItem> */}
                <FormItem {...this.formLayout} label="分组描述">
                  {getFieldDecorator('desc', {
                    rules: [{ message: '请输入至少五个字符的分组描述！', min: 5 }],
                    initialValue: current.desc,
                  })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
                </FormItem>
              </Form>
            );
          };
        return (
            <PageHeaderWrapper>
                <div className={styles.standardList}>
                    {/* <Card bordered={false}>
                        <Row>
                            <Col sm={8} xs={24}>
                                <Info title="我的待办" value="8个任务" bordered />
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title="本周任务平均处理时间" value="32分钟" bordered />
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title="本周完成任务数" value="24个任务" />
                            </Col>
                        </Row>
                    </Card> */}
        
                    <Card
                        className={styles.listCard}
                        bordered={false}
                        title="分组列表"
                        style={{ marginTop: 24 }}
                        bodyStyle={{ padding: '0 32px 40px 32px' }}
                        extra={extraContent}
                    >
                        <Button
                            type="dashed"
                            style={{ width: '100%', marginBottom: 8 }}
                            icon="plus"
                            onClick={this.showModal}
                            ref={component => {
                                /* eslint-disable */
                                this.addBtn = findDOMNode(component);
                                /* eslint-enable */
                            }}>
                            添加
                        </Button>
                        <List
                            size="large"
                            rowKey="id"
                            loading={loading}
                            pagination={paginationProps}
                            dataSource={list}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <a
                                            onClick={e => {
                                                e.preventDefault();
                                                this.showEditModal(item);
                                            }}
                                        >
                                        编辑
                                        </a>,
                                        <a
                                            onClick={e => {
                                                e.preventDefault();
                                                this.editAndDelete('delete', item);
                                            }}
                                        >
                                        删除
                                        </a>,
                                        // <a
                                        //     onClick={e => {
                                        //         e.preventDefault();
                                        //         this.editAndDelete(item);
                                        //     }}
                                        // >
                                        // 详情
                                        // </a>,
                                        // <MoreBtn current={item} />,
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png" shape="square" size="large" />}
                                        title={<a href={item.href}>{item.group_name}</a>}
                                        description={item.desc}
                                    />
                                    <ListContent data={item} />
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
                <Modal
                    title={done ? null : `分组${current ? '编辑' : '添加'}`}
                    className={styles.standardListForm}
                    width={640}
                    bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
                    destroyOnClose
                    visible={visible}
                    {...modalFooter}
                    >
                    {getModalContent()}
                </Modal>
            </PageHeaderWrapper>
        );
    }
}

export default GroupList;
