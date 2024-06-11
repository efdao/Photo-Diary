import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/Main.module.css';
import logo from '../assets/logo.svg';
import main_img1 from '../assets/mainImg1.png'
import main_img2 from '../assets/mainImg2.png'
import Footer from '../components/Footer';
import { Link } from "react-router-dom";
import UserList from '../components/UserList';

// Axios 기본 설정
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

export default function Main() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // DB에서 유저 목록 가져오기
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="Main">
      {/* logo */}
      <div className={styles.navbar}>
        <img className={styles.navbaricon} alt="logo" src={logo} />
      </div>
      
      {/* Sign in content_1 */}
      <div className={styles.signInContent1}>
        <div className={styles.textBox1}>
          <h3><span style={{ color: '#6d31ed' }}>사진</span>과 함께</h3>
          <h3>일상을 <span style={{ color: '#6d31ed' }}>공유</span>하세요</h3>
          <p style={{ marginTop: '10px' }}>특별한 순간을 함께하세요</p>
          <p style={{ marginBottom: '15px' }}>나누는 기쁨을 만끽하세요</p>
          <Link to='/SignIn'>
            <button>Sign In</button>
          </Link>
        </div>
        <img className={styles.mainImg1} src={main_img1} alt="main_img1" />
      </div>

      {/* Sign in content_2 */}
      <div className={styles.signInContent2}>
        <img className={styles.mainImg2} src={main_img2} alt="main_img2" />
        <div className={styles.textBox2}>
          <h2>자유로운 소통을 즐겨보세요!</h2>
          <p>DM을 통해 정보를 공유해보세요</p>
          <p>관심사를 통해 대화를 이어나가보세요</p>
        </div>
      </div>

      {/* UserList */}
      <UserList users={users} />

      {/* footer */}
      <Footer></Footer>
    </div>
  );
}
