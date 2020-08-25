import dva from 'dva';
import './index.css';

// 1. Initialize
// 在组件connect之后，每个组件都能拿到初始化的数据
// initialState的对象对应命名空间为products的model
const app = dva({
  initialState: {
    // products: {
    // }
  }
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);
app.model(require('./models/userInfo').default);
app.model(require('./models/addThing').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
