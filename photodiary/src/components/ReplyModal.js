import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/DmModal.module.css';
import { AiOutlineClose } from "react-icons/ai";

export default function ReplyModal({ onClose, recipientId, onMessageSent }) {
  const [content, setContent] = useState('');

  const sendDm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/messages', {
        recipient_id: recipientId,
        content: content,
      });
      if (response.status === 201) {
        alert('메세지가 전송되었습니다!');
        onMessageSent(); // 메시지 전송 후 새로고침
        onClose(); // 모달 닫기
      } else {
        alert('메세지 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('메세지 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Direct Message */}
        <div className={styles.modalHeader}>
          <h2><span className={styles.DirectText}>Direct</span> Message</h2>
          {/* 아이콘 누르면 모달창 종료 */}
          <AiOutlineClose className={styles.closeIcon} onClick={onClose} />
        </div>
        {/* Direct Message body */}
        <form className={styles.modalBody} onSubmit={sendDm}>
          {/* Message */}
          <textarea
            placeholder='메세지를 입력하세요'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {/* Add post footer */}
          <div className={styles.modalFooter}>
            {/* DM message가 Post버튼을 누르면 서버로 전송되어야 함 */}
            <button className={styles.SendButton} type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
