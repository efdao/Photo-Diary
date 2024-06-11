import React, { useState } from 'react';
import styles from './css/Post.module.css';
import { AiFillMessage } from "react-icons/ai";
import DmModal from './DmModal';
import EditModal from './EditModal';

export default function Post({ id, imgSrcList, uploader, content, keywords, uploaderId }) {
  const [isDmModalOpen, setDmModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDmModal = () => {
    setDmModalOpen(true);
  };

  const handleEditModal = () => {
    setEditModalOpen(true);
  };
/*
  const showPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imgSrcList.length - 1 : prevIndex - 1
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imgSrcList.length - 1 ? 0 : prevIndex + 1
    );
  };
*/
  return (
    <div className={styles.Post}>
      {/* 이미지 슬라이드 */}
      <div className={styles.PostImgTop}>
        {/* 내가 올린 image는 클릭했을때만 Edit 모달 오픈 */}
        <img
          src={imgSrcList[currentImageIndex]}
          alt={`Post ${currentImageIndex}`}
          className={styles.PostImg}
          onClick={handleEditModal}
        />
      </div>

      <div className={styles.PostBody}>
        <div className={styles.PostBodyAlign}>
          <p className={styles.Uploader}>
            <span>by </span>{uploader}
            {/* Message 아이콘 클릭 했을때 DM 모달 오픈 */}
            <AiFillMessage className={styles.MessageIcon} onClick={handleDmModal} />
          </p>
          <p className={styles.Contents}>
            {content}
          </p>
          <p className={styles.Keyword}>
            {keywords.map((keyword, index) => (
              <span key={index}>#{keyword} </span>
            ))}
          </p>
        </div>
      </div>

      {/* DM 모달과 Edit 모달 렌더링 */}
      {isDmModalOpen && <DmModal onClose={() => setDmModalOpen(false)} recipientId={uploaderId} />}
      {isEditModalOpen && (
        <EditModal
          onClose={() => setEditModalOpen(false)}
          postId={id}
          initialContent={content}
          initialKeyword={keywords.join(', ')}
          initialImages={imgSrcList}
        />
      )}
    </div>
  );
}
