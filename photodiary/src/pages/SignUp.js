import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './css/SignUp.module.css';
import logo from '../assets/logo.svg';

export default function SignUp() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userNickname, setUserNickname] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username: userId,
        password: userPw,
        nickname: userNickname
      });

      if (response.status === 201) {
        alert('회원가입이 완료 되었습니다!');
        navigate('/SignIn');
      } else {
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.SignUpPage}>
      <Link to='/'>
        <img className={styles.logo} alt="logo" src={logo} />
      </Link>
      <div className={styles.SignUpWrap}>
        <div className={styles.SignUpLeft}>
          <h3>Sign Up</h3>
          <form onSubmit={handleSignUp}>
            <input
              className={styles.SignUpForm}
              id='userid'
              type='text'
              placeholder='ID'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <p></p>
            <input
              className={styles.SignUpForm}
              id='userpw'
              type='password'
              placeholder='Password'
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
            />
            <p></p>
            <input
              className={styles.SignUpForm}
              id='usernickname'
              type='text'
              placeholder='Nickname'
              value={userNickname}
              onChange={(e) => setUserNickname(e.target.value)}
            />
            <p></p>
            <input
              className={styles.SignUpSubmit}
              type='submit'
              value='Sign Up'
            />
          </form>
          <p>Already have an account?<Link to='/SignIn'><span>Sign In</span></Link></p>
        </div>
        <div className={styles.SignUpRight}></div>
      </div>
    </div>
  );
}
