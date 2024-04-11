import React, { useState, useRef, useEffect } from "react";
import { VscSend } from "react-icons/vsc";
import { MdLanguage } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import bauluIcon from "./images/baulu.png";


const AnnouncementType = {
  TEXT: 'text',
  IMAGE: 'image',
  WARNING: 'warning',
  WARNING_WITH_BUTTON: 'warning_with_button',
  IMAGE_WITH_TEXT: 'image_with_text',
  BUTTON_WITH_TEXT: 'button_with_text',
};

const mockData = [
  { type: AnnouncementType.TEXT, text: 'Hello, how can I help you?' },
  { type: AnnouncementType.IMAGE, imageUrl: 'https://imgur.com/ypCOR6k.jpg', text: 'Example Image' },
  { type: AnnouncementType.WARNING, text: 'This is a warning message!' },
  {
      type: AnnouncementType.WARNING_WITH_BUTTON,
      text: 'Warning with action!',
      buttonText: 'Fix it!'
  },
  {
      type: AnnouncementType.IMAGE_WITH_TEXT,
      imageUrl: './images/example-image2.png',
      text: 'This is an image with some text below it.'
  },
  {
      type: AnnouncementType.BUTTON_WITH_TEXT,
      buttonText: 'Click Me',
      text: 'This is a button with text beside it.'
  },
];

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("TR"); // Varsayılan dil olarak TR ayarlandı
  const [showLanguageOptions, setShowLanguageOptions] = useState(false); // Dil seçeneklerini gösterme durumu
  const [isChatbotVisible, setIsChatbotVisible] = useState(true);
  const chatbotConversationRef = useRef(null);

  const renderMessage = (message) => {
    switch (message.type) {
        case AnnouncementType.TEXT:
            return <div className="message-bubble">{message.text}</div>;
        case AnnouncementType.IMAGE:
            return <div><img src="https://imgur.com/ypCOR6k.jpg" alt="Message" /><p>{message.text}</p></div>;
        case AnnouncementType.WARNING:
            return <div className="message-warning">{message.text}</div>;
        case AnnouncementType.WARNING_WITH_BUTTON:
            return (
                <div className="message-warning-button">
                    {message.text}
                    <button>{message.buttonText}</button>
                </div>
            );
        case AnnouncementType.IMAGE_WITH_TEXT:
            return (
                <div className="message-image-text">
                    <img src={message.imageUrl} alt="Message" />
                    <p>{message.text}</p>
                </div>
            );
        case AnnouncementType.BUTTON_WITH_TEXT:
            return (
                <div className="message-button-text">
                    <button>{message.buttonText}</button>
                    <p>{message.text}</p>
                </div>
            );
        default:
            return <div>{message.text}</div>;
    }
};
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

      const botMessages = data.map((item) => ({
        recipient_id: "user",
        text: item.text,
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
        text: item.text,
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

useEffect(() => {
        renderMessage(mockData)
        

        const scrollToBottom = () => {
            if (chatbotConversationRef.current) {
                chatbotConversationRef.current.scrollTop = chatbotConversationRef.current.scrollHeight;
            }
        };
        scrollToBottom();
    }, []);

  

  return (
    <div>
      {isChatbotVisible ? (
        <div className="chatbot-widget">
          <div className="chatbot-header">
            <div className="chatbot-header-top">
              <figure className="baulu-image">
                <img src={bauluIcon} alt="baulu-icon" />
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
                  className={`message-bubble ${
                    message.type === "user" ? "" : "message-bubble-bot"
                  }`}
                >
                  {message.text}
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
          
          <img src={bauluIcon} alt="Open Chatbot" onClick={handleOpen} />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
