import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import './App.css'; // 업데이트된 CSS를 임포트합니다.

const ChatApp = () => {
    const [chatWindows, setChatWindows] = useState([{ id: 1, chats: [], showInfoBoxes: true }]);
    const [activeWindow, setActiveWindow] = useState(1);
    const [chatContents, setChatContents] = useState('');
    const chatInput = useRef(null);

    const nowTime = moment().format('MM-DD HH:mm:ss');

    const handleAddChat = (message, isBot = false) => {
        setChatWindows(prev => 
            prev.map(window => 
                window.id === activeWindow 
                    ? { ...window, chats: [...window.chats, { no: window.chats.length + 1, chat: message, date: nowTime, isBot }], showInfoBoxes: false }
                    : window
            )
        );
        setChatContents('');
    };

    const pressEnter = (e) => {
        if (e.key === 'Enter') {
            handleAddChat(chatContents);
        }
    };

    const addNewChatWindow = () => {
        const newId = chatWindows.length + 1;
        setChatWindows([...chatWindows, { id: newId, chats: [], showInfoBoxes: true }]);
        setActiveWindow(newId);
    };

    const handleBoxClick = (message) => {
        handleAddChat(message, true);
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatWindows]);

    const scrollToBottom = () => {
        const { scrollHeight, clientHeight } = chatInput.current;
        chatInput.current.scrollTop = scrollHeight - clientHeight;
    };

    const currentWindow = chatWindows.find(window => window.id === activeWindow);
    const currentChats = currentWindow?.chats || [];
    const showInfoBoxes = currentWindow?.showInfoBoxes;

    return (
        <div className="ChatWrapper">
            <div className="sidebar">
                {chatWindows.map(window => (
                    <div 
                        key={window.id} 
                        className={`chatWindowButton ${window.id === activeWindow ? 'active' : ''}`}
                        onClick={() => setActiveWindow(window.id)}
                    >
                        채팅창 {window.id}
                    </div>
                ))}
                <button onClick={addNewChatWindow} className="newChatButton">새 채팅창</button>
            </div>
            <div className="chatContainer">
                {showInfoBoxes && (
                    <div className="infoBoxes">
                        <div className="infoBox" onClick={() => handleBoxClick('밥 추천하는 챗봇입니다.')}>밥 추천</div>
                        <div className="infoBox" onClick={() => handleBoxClick('칼로리 계산하는 챗봇입니다.')}>칼로리 계산</div>
                        <div className="infoBox" onClick={() => handleBoxClick('체중 조절 기간을 알려주는 챗봇입니다.')}>체중 조절 기간</div>
                    </div>
                )}
                <div className="chatList" ref={chatInput}>
                    {currentChats.map((item) => (
                        <div className={`chatContents ${item.isBot ? 'bot' : 'user'}`} key={item.no}>
                            <span className="chat">{item.chat}</span>
                            <span className="date">{item.date}</span>
                        </div>
                    ))}
                </div>
                <div className="chatArea">
                    <input
                        type="text"
                        value={chatContents}
                        onChange={(e) => setChatContents(e.target.value)}
                        onKeyPress={pressEnter}
                    />
                    <button onClick={() => handleAddChat(chatContents)}>전송</button>
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
