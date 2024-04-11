import React, { useState, useRef, useEffect } from "react";
import { VscSend } from "react-icons/vsc";
import { MdLanguage } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import images from "./images/images.js";



const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("TR"); // Varsayılan dil olarak TR ayarlandı
  const [showLanguageOptions, setShowLanguageOptions] = useState(false); // Dil seçeneklerini gösterme durumu
  const [isChatbotVisible, setIsChatbotVisible] = useState(true);
  const chatbotConversationRef = useRef(null);

  const handleClose = () => {
    setIsChatbotVisible(false);
  };

  const handleOpen = () => {
    setIsChatbotVisible(true);
  };

  const handleInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userInput.trim() || isLoading) return;

    // Kullanıcının mesajını hemen ekleyin
    const newUserMessage = { type: "user", text: userInput };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    if(language==="TR"){
      sendToRasaTR(userInput);

    }
    else sendToRasaEN(userInput);
    
    setUserInput(""); // Input alanını temizle
  };

  const sendToRasaTR = async (userMessage) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5005/webhooks/rest/webhook',
        {
          method: "POST",
          headers: {
            Accept : 'application/json',
            'Content-Type' : 'application/json',
            'charset' : 'UTF-8'
          },
          credentials:"same-origin",
          body: JSON.stringify({ 'sender': 'user', 'message': userMessage }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      const botMessages = [];

    // Yanıttan gelen her öğeyi işle
    data.forEach(item => {
      if (item.custom && item.custom.menu) {
        // Yanıtta bir "menu" varsa, içindeki her öğeyi işle
        item.custom.menu.forEach(menuItem => {
          botMessages.push({
            recipient_id: "user",
            type: item.custom.type || 'slider', // Varsayılan bir tür belirt
            title: item.custom.title || '',
            text: menuItem.text || '',
            image: menuItem.image || '',
          });
        });
      } else {
        // Diğer mesaj türlerini işle
        botMessages.push({
          recipient_id: "user",
          text: item.custom?.text || '',
          type: item.custom?.type || '',
          image: item.custom?.image || '',
          link: item.custom?.link || '',
          title: item.custom?.title || '',
        });
      }
    });
        
    

      // Botun mesajlarını ekleyin
      setMessages((prevMessages) => [...prevMessages, ...botMessages]);
    } catch (error) {
      console.error("There was an error!", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "bot",
          text: "Sorry, I couldn't get a response. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const sendToRasaEN = async (userMessage) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5005/webhooks/rest/webhook',
        {
          method: "POST",
          headers: {
            Accept : 'application/json',
            'Content-Type' : 'application/json',
            'charset' : 'UTF-8'
          },
          credentials:"same-origin",
          body: JSON.stringify({ 'sender': 'user', 'message': userMessage }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      const botMessages = data.map((item) => ({
        recipient_id: "user",
        text: item.custom.text,
        type :item.custom.type 
      }));
      // Botun mesajlarını ekleyin
      setMessages((prevMessages) => [...prevMessages, ...botMessages]);
    } catch (error) {
      console.error("There was an error!", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "bot",
          text: "Sorry, I couldn't get a response. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };  
  useEffect(() => {
    // Yeni bir mesaj eklendiğinde otomatik olarak en alta kaydır
    const scrollToBottom = () => {
      if (chatbotConversationRef.current) {
        chatbotConversationRef.current.scrollTop =
          chatbotConversationRef.current.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messages]);

  const toggleLanguageOptions = () => {
    setShowLanguageOptions(!showLanguageOptions);
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageOptions(false); // Dil seçildikten sonra seçenekleri gizle
  };

  function getMessageCssClass(message) {
    let baseClass = 'message-bubble';
    if (message.type === 'user') {
      return `${baseClass} message-bubble-user`;
    } else {
      return `${baseClass} message-bubble-bot ${message.type}`;
    }
  }

  return (
    <div>
      {isChatbotVisible ? (
        <div className="chatbot-widget">
          <div className="chatbot-header">
            <div className="chatbot-header-top">
            <figure className="baulu-image">
                <img src={images['baulu.png']} alt="baulu-icon" />
            </figure>
              <div className="header-and-status">
                <div className="header">BAU'LU</div>
                <div className="chatbot-status">Online</div>
              </div>
              <div className="language-icon">
                <button className="language" onClick={toggleLanguageOptions}>
                  <div className="selected-language">{language}</div>
                  <MdLanguage />
                </button>
                {showLanguageOptions && (
                  <div className="language-options">
                    <button
                      className="language-option"
                      onClick={() => selectLanguage("TR")}
                    >
                      TR
                    </button>
                    <button
                      className="language-option"
                      onClick={() => selectLanguage("EN")}
                    >
                      EN
                    </button>
                  </div>
                )}
              </div>
              <div className="close">
                <button className="close-icon" onClick={handleClose}>
                  <IoClose />
                </button>
              </div>
            </div>
          </div>

          <div className="chatbot-conversation" ref={chatbotConversationRef}>
          <div className="user-input-container clearfix">
            {messages.map((message, index) => (
              <div
                key={index}
                className={getMessageCssClass(message)}
              >
                {message.type === 'user' && <div className="message-bubble-user">{message.text}</div>}
                {message.type === 'text' && <div className="message-bubble-text">{message.text}</div>}
                {message.type === 'image_with_text' && (<div className="message-bubble-image-with-text"> <img className="message-image" src={message.image} alt="Message" />{message.text}</div>)}
                {message.type === 'link' && <div className="message-bubble-text">{message.text}<div><a href={message.link} target="_blank" rel="noopener noreferrer">{message.link}</a></div></div>}
                {message.type === 'slider' && <div className="message-bubble-text">{message.image}</div>}

              </div>
            ))}
          </div>
        </div>

          <div className="chatbot-input">
            <form className="chatbot-input-form" onSubmit={handleSubmit}>
              {language === "TR" ? (
                <input
                  className="user-input-box"
                  type="text"
                  value={userInput}
                  onChange={handleInput}
                  placeholder="Mesajınızı giriniz"
                  disabled={isLoading}
                />
              ) : (
                <input
                  className="user-input-box"
                  type="text"
                  value={userInput}
                  onChange={handleInput}
                  placeholder="Type your message here"
                  disabled={isLoading}
                />
              )}

              <button className="send-button" disabled={isLoading}>
                {<VscSend />}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div
          className="chatbot-closed-icon"
        >
          
          <img src={images['baulu.png']} alt="baulu-icon" onClick={handleOpen} />
        </div>
      )}
    </div>
  );
};

export default Chatbot;