import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/Dm.module.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import ReplyModal from '../components/ReplyModal';

export default function Dm() {
  const [isReplyModalOpen, setReplyModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentRecipientId, setCurrentRecipientId] = useState(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReplyModal = (recipientId) => {
    setCurrentRecipientId(recipientId);
    setReplyModalOpen(true);
  };

  const deleteMessage = async (id) => {
    if (window.confirm('메세지를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:5000/messages/${id}`);
        alert('삭제가 완료되었습니다!');
        fetchMessages(); // 메시지를 삭제한 후 메시지 목록을 새로 고침
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // message 컴포넌트
  const Message = ({ id, user, userId, content, direction }) => (
    <div className={styles.message}>
      <p>{direction === 'received' ? 'From' : 'To'}: <strong>{user}</strong></p>
      <p>{content}</p>
      <div className={styles.buttons}>
        {direction === 'received' && (
          <button className={styles.replyButton} onClick={() => handleReplyModal(userId)}>Reply</button>
        )}
        <button className={styles.deleteButton} onClick={() => deleteMessage(id)}>Delete</button>
      </div>
    </div>
  );

  return (
    <div className={styles.DmPage}>
      {/*logo  */}
      <Link to='/MainSignIn'>
        <img
          className={styles.logo}
          alt="logo"
          src={logo}
        />
      </Link>

      {/* Dm */}
      <div className={styles.DmWrap}>
        <div className={styles.Dm}>
          {messages.map(message => (
            <Message
              key={message.id}
              id={message.id}
              user={message.direction === 'received' ? message.sender : message.recipient}
              userId={message.direction === 'received' ? message.sender_id : message.recipient_id}
              content={message.content}
              direction={message.direction}
            />
          ))}
        </div>
      </div>

      {/* DM 모달 렌더링 */}
      {isReplyModalOpen && (
        <ReplyModal
          onClose={() => setReplyModalOpen(false)}
          recipientId={currentRecipientId}
          onMessageSent={fetchMessages}
        />
      )}
    </div>
  );
}
