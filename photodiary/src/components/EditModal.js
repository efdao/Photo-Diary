import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/EditModal.module.css';
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

export default function EditModal({ onClose, postId, initialContent, initialKeyword, initialImages }) {
  const navigate = useNavigate();
  const [content, setContent] = useState(initialContent);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [images, setImages] = useState(initialImages);

  const handleContentChange = (e) => setContent(e.target.value);
  const handleKeywordChange = (e) => setKeyword(e.target.value);
  const handleImagesChange = (e) => setImages(e.target.files);

  const EditPost = async (e) => {
    e.preventDefault();
    console.log(`Editing post with ID: ${postId}`);
    const formData = new FormData();
    formData.append('content', content);

    // 쉼표나 공백을 기준으로 키워드를 분리하고 빈 문자열 제거
    const keywordsArray = keyword.split(/[\s,]+/).filter(kw => kw.trim() !== '');
    formData.append('keyword', keywordsArray.join(','));

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const response = await axios.put(`http://localhost:5000/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (response.status === 200) {
        alert('수정이 완료되었습니다!');
        onClose();  // 모달 닫기
        navigate('/MainSignIn', { replace: true });
        window.location.reload();  // 페이지 새로고침
      } else {
        alert('수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error editing post:', error);
      alert('작성자만 수정할 수 있습니다.');
    }
  };

  const DeletePost = async (e) => {
    e.preventDefault();
    console.log(`Deleting post with ID: ${postId}`);
    try {
      const response = await axios.delete(`http://localhost:5000/posts/${postId}`, {
        withCredentials: true
      });
      if (response.status === 200) {
        alert('삭제가 완료되었습니다!');
        onClose();  // 모달 닫기
        navigate('/MainSignIn', { replace: true });
        window.location.reload();  // 페이지 새로고침
      } else {
        alert('삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('작성자만 삭제할 수 있습니다.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Add post */}
        <div className={styles.modalHeader}>
          <h2><span className={styles.editText}>Edit</span> post</h2>
          {/* 아이콘 누르면 모달창 종료 */}
          <AiOutlineClose className={styles.closeIcon} onClick={onClose} />
        </div>
        {/* Edit post body */}
        <form className={styles.modalBody}>
          {/* 서버로부터 받아온 Attachment(이미지) */}
          <label>Attachment</label>
          <input 
            type="file"
            accept='image/*'
            multiple
            onChange={handleImagesChange}
          />
          {/* 서버로부터 받아온 Content(내용) */}
          <label>Content</label>
          <textarea 
            placeholder='내용을 입력하세요'
            value={content}
            onChange={handleContentChange}
          ></textarea>
          {/* 서버로부터 받아온 Keyword */}
          <label>Keyword</label>
          <input
            type="text"
            placeholder="#keyword"
            value={keyword}
            onChange={handleKeywordChange}
          />

          {/* Add post footer */}
          <div className={styles.modalFooter}>
            {/* Delete 버튼 */}
            <button className={styles.deleteButton} type="button" onClick={DeletePost}>
              Delete
            </button>
            {/* Edit 버튼 */}
            <button className={styles.editButton} type="submit" onClick={EditPost}>
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
