import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './css/SignIn.module.css';
import logo from '../assets/logo.svg';

export default function SignIn() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/signin', {
        username: userId,
        password: userPw,
      });

      if (response.status === 200) {
        alert('로그인 되었습니다!');
        navigate('/MainSignIn');
      } else {
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('로그인에 실패했습니다. ID와 비밀번호를 다시 확인해주세요');
      } else {
        console.error('Error signing in:', error);
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className={styles.SignInPage}>
      <Link to='/'>
        <img className={styles.logo} alt="logo" src={logo} />
      </Link>

      <div className={styles.SignInWrap}>
        <div className={styles.SignInLeft}>
          <h3>Sign In</h3>
          <form onSubmit={handleSignIn}>
            <input
              className={styles.SignInForm}
              id='userid'
              type='text'
              placeholder='ID'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <p></p>
            <input
              className={styles.SignInForm}
              id='userpw'
              type='password'
              placeholder='Password'
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
            />
            <p></p>
            <input
              className={styles.SignInSubmit}
              type='submit'
              value='Sign In'
            />
          </form>
          <p>Doesn't have an account? <Link to='/SignUp'><span>Sign up</span></Link></p>
        </div>
        <div className={styles.SignInRight}></div>
      </div>
    </div>
  );
}
