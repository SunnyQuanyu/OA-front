export const userColomns = [
  { title: '学号/工号', dataIndex: 'number' },
  { title: '姓名', dataIndex: 'realName' },
  { title: '学院', dataIndex: 'collegeName' },
  { title: '专业', dataIndex: 'majorName' },
  { title: '班级', dataIndex: 'className' },
  { title: '身份', dataIndex: 'identity', render: text => text === 0 ? '学生' : text === 1 ? '老师' : '院长' },
]