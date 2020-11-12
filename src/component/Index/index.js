import React, { Component, Fragment } from 'react'
import { Divider,List,Button ,Modal ,message,Input,Drawer, Form, Col, Row,} from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import style from './index.less'


// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component {
   
    state = {
        data: [
         {
           title: "Ant Design Title 1",
           text:"Ant Design, a design language for background applications, is refined by Ant UED Team",
           id:1
         },
         {
          title: "Ant Design Title 2",
          text:"Ant Design, a design language for background applications, is refined by Ant UED Team",
          id:2
        }
        ],
        visible: false,
        vid:'',
        visible1:false,
        vid1:'',
        name:'新增待办事项',
        
      };
    showModal1  (id) {
            let Array = this.state.data.find(item =>{
              return item.id === id
            })
              this.input.state.value = Array.title;
              this.TextArea.state.value = Array.text;
            this.setState({
              vid:id,
              visible: true,
              name:'编辑待办事项'
            })
          }
      // 新增
      showModal =() =>{
        this.setState({
          visible: true,
          name:'新增待办事项'
        });
       
      
      }
      handleOk = () => {
        
        // 获取标题内容
          const val1 = this.input.state.value;
          // 获取描述内容
          const textVal = this.TextArea.state.value;
          let  num = parseFloat(this.state.data.length) + 1;
          // 创建一个空的数组
          let cardNumArr = []
          // 编辑id
          let vid = this.state.vid

          let data = this.state.data
          //  判断是否内容标题为空
        if(val1 === '' || val1 === undefined){
          message.warning('请输入标题');
          return
        }else if(textVal === '' || textVal === undefined ){
          message.warning('请输入待办事项内容');
          return
        }
        
        if(vid !== ''){
          data.map(item => {
            if (item.id === vid ) {
              item.text = textVal;
              item.title = val1
            }
            return item
          })
        this.convertString(data)
        message.success('修改成功');
        this.removeTheText()
       }else {
        let cardNumObj  = {title:val1,text:textVal,id:num}
        cardNumArr.push(cardNumObj)
        cardNumArr = [...cardNumArr,...data]
        this.setState({
          data:cardNumArr
        })
        this.convertString(cardNumArr)
       }

        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false, visible: false });
          this.removeTheText()
          message.success('新增成功');
        }, 3000);
    };
      
    
      handleCancel = () => {
        this.setState({ 
          visible: false,
          vid: '' ,
          vid1:''
        });
        message.success('取消成功');
        this.removeTheText()
       
      };
      handleCancel1 = () => {
        this.setState({ 
          visible1: false,
          vid1:''
        });
        message.success('取消成功');
       
      };
      // 清除文本
      removeTheText(){
        this.input.state.value = ''
        this.TextArea.state.value = ''
      }
        
      removeBacklog(id){
        this.setState({
          vid1:id,
          visible1:true
        })
         
      }
      // 删除操作
      handleOk1=() =>{
        // 获取 删除id
        let uid = this.state.vid1;
        let data = this.state.data;
        data.splice(data.findIndex(item1 => item1.id === uid),1)
        this.setState({
          data:data,
          visible1:false
        })
        this.convertString(data)

      }
      // 把对象转换成字符串
      convertString(str){
         let val = JSON.stringify(str)
         localStorage.setItem("str",val)
      }
    
      componentDidMount(){
        let val = localStorage.getItem('str')
        if(val === null){
          return
        }
       val = JSON.parse(val)
       this.setState({
         data:val
       })
      }
      render() {
            const { data ,visible,visible1,name} = this.state
        return (
             <Fragment>
                 <div className={style.box}>
                 <Divider orientation="center">待办事项</Divider>
                 <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                      <List.Item  actions={[<Button type="primary" onClick={()=>this.showModal1(item.id)} >编辑</Button>, <Button type="primary" danger onClick={()=>this.removeBacklog(item.id)}>删除</Button>]}>
                        <List.Item.Meta
                          title={<div>{item.title}</div>}
                          description={item.text}
                        />
                      </List.Item>
                    )}
                  />
                  <Button type="primary" className={style.add} size="middle" onClick={this.showModal} >新增</Button>
             
                </div>
                 {/* 删除操作对话框 */}
                 <Modal
                  title="删除待办事项"
                  visible={visible1}
                  onOk={this.handleOk1}
                  onCancel={this.handleCancel1}
                  cancelText="取消"
                  okText="确定"
                >
                  是否确认删除
                </Modal>
                <Drawer
                  title={name}
                  width={720}
                  onClose={this.handleCancel}
                  visible={visible}
                  bodyStyle={{ paddingBottom: 80 }}
                  footer={
                    <div
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <Button onClick={this.handleCancel} style={{ marginRight: 8 }}>
                        取消
                      </Button>
                      <Button onClick={this.handleOk} type="primary">
                        提交
                      </Button>
                    </div>
                  }
                >
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="name"
                          label="标题"
                          rules={[{ required: true, message: '请输入待办事项标题' }]}
                        >
                          <Input ref={ input =>this.input = input} placeholder="请输入待办事项标题" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="description"
                          label="内容"
                          rules={[
                            {
                              required: true,
                              message: '请输入待办事项描述',
                            },
                          ]}
                        >
                          <Input.TextArea ref={TextArea =>this.TextArea = TextArea} rows={4} placeholder="请输入待办事项描述" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Drawer>
             </Fragment>
        );
      }
    }

// - Allows a user to manage a To-Do list (CRUD)
// - View To-Do items
// - Add a new To-Do item to the list
// - Edit a To-Do item
// - Remove a To-Do from the list
// - Persist data to storage
// - When page is refreshed, list will not be reset
// - Persist using either HTML5 web storage, or using Node.js backend