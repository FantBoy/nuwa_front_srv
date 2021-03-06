import React, { Fragment } from "react";
import { connect } from "dva";
import { Form, Input, Button, Select, Divider } from "antd";
import router from "umi/router";
import styles from "./style.less";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
};

@connect(({ form }) => ({
  data: form.step
}))
@Form.create()
class Step1 extends React.PureComponent {
  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: "form/saveStepFormData",
            payload: values
          });
          router.push("/packagetube/version/stepform/confirm");
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="包名">
            {getFieldDecorator("packageName", {
              initialValue: data.packageName,
              rules: [{ required: true, message: "请输入包名" }]
            })(<Input placeholder="请输入包名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="版本号">
            {getFieldDecorator("packageVersion", {
              initialValue: data.packageVersion,
              rules: [{ required: true, message: "请输入版本号" }]
            })(<Input placeholder="请输入版本号" />)}
          </Form.Item>
       
          <Form.Item {...formItemLayout} label="版本描述">
            {getFieldDecorator("versionDesc", {
              initialValue: data.versionDesc,
              rules: [{ required: true, message: "请输入版本描述" }]
            })(<Input placeholder="请输入版本描述" />)}
          </Form.Item>
          
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span
              }
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: "40px 0 24px" }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>包版本详情</h4>
          <p>
            编辑包版本信息，原则上，版本一旦生成就不能在原版本上修改，每次修改都会自动生成新的版本。
          </p>
         
        </div>
      </Fragment>
    );
  }
}

export default Step1;
