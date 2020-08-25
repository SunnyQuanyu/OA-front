import React, { useEffect , useState } from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';


const ThingAddTag = ({ addThing, dispatch, saveThingChange }) => {


  const onCheck = (checkedKeys,info) => {
    console.log('onCheck', checkedKeys);
    setCheckedKeys(checkedKeys);
    console.log(info);
    saveThingChange(checkedKeys.checked,'tagId');
    saveThingChange((info.checkedNodes||[]).map(item=>{return item.title}),'tagName');
  };

 const onSelect = (value, node, extra) => {

    //setValue(value);
   // saveThingChange(value.onSelect,'tagId');
    console.log(value, node, extra)
  };

  const onChange = (value, label, extra) => {

    //setValue(value);
   // saveThingChange(value.onSelect,'tagId');
   setCheckedKeys(value);
   saveThingChange((value||[]).map(item=>{return item.value}),'tagId');
   saveThingChange((value||[]).map(item=>{return item.label}),'tagName');
    console.log(value, label)
  };

  const [checkedKeys,setCheckedKeys] = useState(0);

  useEffect(() => {
    if (addThing.tags.length === 0) {
      handleGetTags();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetTags = () => {
    dispatch({ type: 'addThing/getTags' });
  };
  console.log(addThing,checkedKeys)
  return (
 
    <div>
{addThing.tags.length !== 0 && (
<TreeSelect
        treeCheckable
        treeCheckStrictly
        showSearch
        style={{ width: '100%' }}
        value={addThing.tagId||[]}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择事务标签"
        allowClear
        multiple
        treeDefaultExpandAll
        treeData={addThing.tags}
        onChange={onChange}
        //onCheck={onCheck}
       // checkedKeys={addThing.tagId}
       // onSelect={onSelect}
        
      >
      
      </TreeSelect>
)}
    </div>

  );
};

export default connect(({ addThing }) => ({ addThing }))(ThingAddTag);




