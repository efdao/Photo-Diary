import styles from './css/MainSignIn.module.css';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer';
import UploadModal from '../components/UploadModal';
import Post from '../components/Post';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from '../components/UserList';

// Axios 기본 설정
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

export default function MainSignIn() {
  const navigate = useNavigate();
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userNickname, setUserNickname] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [users, setUsers] = useState([]);


  useEffect(() => {
    fetchPosts();
    fetchUser();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPosts = async (keyword = '') => {
    try {
      const response = await axios.get('/posts/search', { params: { keyword } });
      const postsWithFullPath = response.data.map(post => ({
        ...post,
        imgSrcList: post.imgSrcList.map(img => `http://localhost:5000${img}`)
      }));
      setPosts(postsWithFullPath);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get('/user');
      setUserNickname(response.data.nickname);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // 로그아웃 기능
  const handleSignOut = () => {
    if(window.confirm("로그아웃 하시겠습니까?")) {
      // 서버에 로그아웃 요청
      axios.post('/logout')
        .then(() => {
          alert("로그아웃 되었습니다!");
          navigate('/');
        })
        .catch(error => {
          console.error('Error during logout:', error);
          alert("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
        });
    }
  };

  // 검색 기능
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(searchKeyword);
  };

  return (
    <div className={styles.MainSignInPage}>
      {/* Navbar */}
      <div className={styles.Navbar}>
        <div className={styles.NavbarLogo}>
          <Link to='/MainSignIn'>
            <img src={logo} alt="logo" />
          </Link>
          <h4 onClick={handleSignOut}>Hello <span>{userNickname}</span>!</h4>
        </div>
        <ul className={styles.NavbarMenu}>
          {/* 누르면 Add post 모달창 열림 */}
          <li className={styles.NavbarMenuList} onClick={() => setUploadModalOpen(true)}>Add Post</li>
          {/* 누르면 Dm 페이지로 이동? */}
          <Link to='/Dm' style={{ textDecoration: 'none', color: 'inherit' }}>
            <li className={styles.NavbarMenuList}>Dm</li>
          </Link>
        </ul>
      </div>

      {/* Explore Posts */}
      <h2 className={styles.Explore}>Explore <span>Posts</span></h2>
      <div className={styles.ExplorePosts}>
        {/* Search */}
        <form className={styles.Search} onSubmit={handleSearch}>
          <input 
            type='text' 
            placeholder='Search with keyword' 
            size='70' 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button type='submit'>Search</button>
        </form>
      </div>

      {/* Post */}
      <section className={styles.PostBlock}>
        <div className={styles.gridContainer}>
          {posts.map((post, index) => (
            <div className={styles.gridItem} key={index}>
              <Post
                id={post.id}
                imgSrcList={post.imgSrcList}
                uploader={post.uploader}
                content={post.content}
                keywords={post.keywords}
                uploaderId={post.uploader_id}
              />
            </div>
          ))}
        </div>
      </section>

      {/* UserList */}
      <UserList users={users} />
      
      {/* Footer */}
      <Footer />

      {/* UploadModal 모달 */}
      {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} />}
    </div>
  );
}
