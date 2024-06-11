import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/DmModal.module.css';
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

export default function DmModal({ onClose, recipientId }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const SendDm = async (e) => {
    e.preventDefault();
    console.log(`Sending message to recipient ID: ${recipientId}`);
    try {
      const response = await axios.post('/messages', {
        recipient_id: recipientId,
        content: message
      });
      if (response.status === 201) {
        alert('메세지가 전송되었습니다!');
        onClose();
        navigate('/MainSignIn');
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
        <form className={styles.modalBody} onSubmit={SendDm}>
          {/* Message */}
          <textarea
            placeholder='메세지를 입력하세요'
            value={message}
            onChange={handleMessageChange}
          ></textarea>
          {/* Add post footer */}
          <div className={styles.modalFooter}>
            <button className={styles.SendButton} type='submit'>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
