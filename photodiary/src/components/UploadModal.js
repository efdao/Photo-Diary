import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/UploadModal.module.css';
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

export default function UploadModal ({ onClose }){
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const uploadPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    formData.append('content', content);

    // 쉼표나 공백을 기준으로 키워드를 분리하고 빈 문자열 제거
    const keywordsArray = keyword.split(/[\s,]+/).filter(kw => kw.trim() !== '');
    formData.append('keyword', keywordsArray.join(','));

    try {
      const response = await axios.post('http://localhost:5000/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (response.status === 201) {
        alert('업로드 되었습니다!');
        onClose();  // 모달 닫기
        navigate('/MainSignIn', { replace: true });
        window.location.reload();  // 페이지 새로고침
      } else {
        alert('업로드에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Add post */}
        <div className={styles.modalHeader}>
          <h2><span className={styles.addText}>Add</span> post</h2>
          {/* 아이콘 누르면 모달창 종료 */}
          <AiOutlineClose className={styles.closeIcon} onClick={onClose} />
        </div>
        
        {/* Add post body */}
        <form className={styles.modalBody} onSubmit={uploadPost}>
          {/* Attachment(이미지) */}
          <label>Attachment</label>
          <input 
            type="file"
            multiple
            accept='image/*'
            onChange={handleFileChange}
          />
          {/* Content(내용), 60자정도 제한두기 */}
          <label>Content</label>
          <textarea 
            placeholder='내용을 입력하세요(60자 제한)'
            value={content}
            onChange={handleContentChange}
            maxLength={60}
          ></textarea>
          {/* Keyword */}
          <label>Keyword</label>
          <input
            type="text"
            placeholder="#keyword"
            value={keyword}
            onChange={handleKeywordChange}
          />

          {/* Add post footer */}
          <div className={styles.modalFooter}>
            {/* Image, content, keyword가 Post버튼을 누르면 서버로 전송되어야 함 */}
            <button 
              className={styles.PostButton}
              type="submit"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
