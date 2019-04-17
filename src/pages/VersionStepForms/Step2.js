
import { connect } from "dva";
import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Button, Alert, Icon, Table, Tag, InputNumber, Popconfirm, Divider } from "antd";
import router from "umi/router";
import moment from "moment";
import { digitUppercase } from "@/utils/utils";
import styles from "./style.less";

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
};

const data = [];
const fileType = ['D', 'F'];
const beginDay = new Date().getTime();
for (let i = 0; i < 30; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    type: fileType[Math.floor(i/15)],
    mod: 750,
    md5: '691f23fe03309e3c65ed3105d4d5f257',
    size: Math.floor(Math.random() * 20000000),
    modifytime: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD HH:mm:ss'),

  });
}

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber size="small"/>;
    }
    return <Input  size="small"/>;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [
      {
        title: '文件名',
        dataIndex: 'name',
        width: '20%',
        editable: false,
        render: (text, record) => {
          if(record.type == "D"){
            return (
              <div>
                <Icon type="folder" />
                <a style={{ marginLeft: 10 }}>{text}</a>
              </div>
              
            );
          }
          else{
            return (
              <div>
                <Icon type="file-text" />
                <span style={{ marginLeft: 10 }}>{text}</span>
              </div>
              
            );
          }
        }
      },
      {
        title: '权限',
        dataIndex: 'mod',
        width: '5%',
        editable: true,
      },
      {
        title: '文件大小',
        dataIndex: 'size',
        width: '10%',
        editable: false,
        render: (text, record) => {
          if(record.type == "D"){
            return (<span></span>)
          }
          return (<span>{text}</span>)
        }
      },
      {
        title: 'MD5',
        dataIndex: 'md5',
        width: '20%',
        editable: false,
        render: (text, record) => {
          if(record.type == "D"){
            return (<span></span>)
          }
          return (<span>{text}</span>)
        }
      },
      {
        title: '更新时间',
        dataIndex: 'modifytime',
        width: '18%',
        editable: false,
        // render(val) {
        //   return moment(val).format("YYYY-MM-DD HH:mm:ss");
        // }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        // style={{ marginRight: 8 }}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <Fragment>
                  <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>Edit</a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>Delete</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>Download</a>
                </Fragment>
                
              )}
            </div>
          );
        },
      },
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form} >
        <Table
          components={components}
          // bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
          size="small"
        />
      </EditableContext.Provider>
    );
  }
}


@connect(({ form, loading }) => ({
  submitting: loading.effects["form/submitStepForm"],
  data: form.step
}))
@Form.create()
class Step2 extends React.PureComponent {
  render() {
    const { form, data, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      router.push("/form/stepform/info");
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: "form/submitStepForm",
            payload: {
              ...data,
              ...values
            }
          });
        }
      });
    };
    const EditableFormTable = Form.create()(EditableTable);

    return (
      <div className={styles.stepFilesForm}>
        <Alert
          closable
          showIcon
          message="当前路径："
          style={{ marginBottom: 24 }}
        />
        
        <EditableFormTable />
        <Button type="primary" onClick={onValidateForm} loading={submitting} className={styles.stepBtn}>
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }} className={styles.stepBtn}>
            上一步
          </Button>
        
      </div>
      
      
    );
  }
}

export default Step2;
