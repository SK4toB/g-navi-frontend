// frontend/src/components/conversation/ConversationInput.tsx
import React from 'react';

// frontend/src/components/conversation/ConversationInput.tsx
interface ConversationInputProps {
  placeholder?: string;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  hasMessages?: boolean; 
}

export default function ConversationInput({
  onSendMessage,
  isLoading = false,
  hasMessages = false
}: ConversationInputProps) {
  const [message, setMessage] = React.useState('');

  const placeholders = [
    "성장에 대한 고민이나 궁금한 점을 자유롭게 물어보세요 💪",
    "커리어 관련 질문이나 고민을 편하게 말씀해 주세요 ✨",
    "어떤 분야에서 성장하고 싶으신가요? 🥇"
  ];

  const [randomPlaceholder] = React.useState(() => {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
  });

  const getPlaceholder = () => {
    if (isLoading) {
      return "응답을 기다리는 중...";
    }
    if (hasMessages) {
      return "메시지를 입력하세요.";
    }
    return randomPlaceholder;
  };

  const handleSendClick = () => {
    if (message.trim() && !isLoading) { // 로딩 중일 때 전송 방지
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) { // 로딩 중일 때 엔터 방지
      e.preventDefault();
      handleSendClick();
    }
  };

  return (
    <div className="h-[160px] bg-white rounded-[20px] border border-[#D1D5DB] flex relative p-[24px] box-border mt-[20px] mb-[20px]"
      style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.06)' }}>

      {/* 입력 필드 */}
      <textarea
        placeholder={getPlaceholder()}
        className="w-[90%] h-full text-left text-[#191919] text-[16px] border-none focus:outline-none resize-none bg-transparent placeholder-[#8E8585]"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      {/* 버튼 */}
      <button
        className={`
          absolute bottom-[24px] right-[24px] w-[96px] h-[40px] rounded-full 
          flex items-center justify-center cursor-pointer transition-all gap-2
          ${isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gray-800 hover:opacity-80'
          }
        `}
        onClick={handleSendClick}
        disabled={isLoading} // 로딩 중일 때 버튼 비활성화
      >
        <p className="text-[#FFFFFF] text-[16px] font-pretendard font-medium ml-[8px]">Send</p>
        <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFFFFF" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
      </button>
    </div>
  );
}