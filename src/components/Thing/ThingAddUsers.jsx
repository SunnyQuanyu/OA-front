import React, { useEffect } from 'react';
import { connect } from 'dva';
import UserSearchResult from '../UserSearchResult';
import {Input, Switch, Divider, Tag } from 'antd';
//import style from './thing.css';

const { TextArea } = Input;
const { CheckableTag } = Tag;

const ThingAddUsers = ({ addThing, saveThingChange, dispatch }) => {
  useEffect(() => {
    if (addThing.teams.length === 0) {
      handleGetTags();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetTags = () => {
    dispatch({ type: 'addThing/getTeams' });
  };

console.log(addThing)
  return (
    <div>

<TextArea 
placeholder="选择接收小组/人" 
rows={4}
allowClear
onChange
value = {addThing.teamName+" "+(addThing.receiverNames||[]).map(item =>{return item.realName})}
/>



     <Divider style={{ margin: '1rem 0' }} /> 
     <span style={{ color: 'red' }}>已建立的小组如下：<br></br></span>

      {
        addThing.teams.map(team => {
          return (
            <CheckableTag
              key={team.id}
              onClick={() => {
                saveThingChange(team.id, 'teamId');
                saveThingChange(team.teamName, 'teamName');
              }}
            checked={(addThing.teamId||[]).indexOf(team.id) > -1}
             // console.log(checked)
              onChange={
                (checked) =>{
                  
                  let nextSelectedTags = []||addThing.teamId;
                  console.log(nextSelectedTags,addThing.teamId)
                  nextSelectedTags = checked?(addThing.teamId||[]).concat(team.id):(addThing.teamId||[]).filter(item => item!=team.id)
                  console.log(checked)
                  console.log(nextSelectedTags)
                  saveThingChange(nextSelectedTags, 'teamId');

                  let nextSelectedNames = []||addThing.teamName;
                  //console.log(nextSelectedTags,addThing.teamId)
                  nextSelectedNames = checked?(addThing.teamName||[]).concat(team.teamName):(addThing.teamName||[]).filter(item => item!=team.teamName)

                  saveThingChange(nextSelectedNames, 'teamName');
                } }
              color={team.id === addThing.teamId ? 'blue' : ''}
              style={{ margin: '1rem' }}>
              {team.teamName}
            </CheckableTag>
          );
        })}

<span style={{ color: 'red' }}><br></br>查询个人：</span>
      
        <UserSearchResult
          extraColumns={[]}
          tableSelectable={true}
          getSelectIds={keys => {
            saveThingChange(keys, 'receiverIds');
            console.log(keys);
          }}
          getSelectRows={names =>{
            saveThingChange(names, 'receiverNames');
            console.log(names);
            console.log(addThing.receiverNames)
          }}
          saveState={true}
        />
      
    </div>
  );
};

export default connect(({ addThing }) => ({ addThing }))(ThingAddUsers);
