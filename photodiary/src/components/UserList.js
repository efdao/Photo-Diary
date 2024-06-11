import React from 'react';
import styles from './css/UserList.module.css';

export default function UserList({ users }) {
  return (
    <div>
      <h2 className={styles.UserList}><span>Members</span> list</h2>
      <div className={styles.UserListBox}>
        {users.map((user, index) => (
          <p key={index}>{user}</p>
        ))}
      </div>
    </div>
  );
}