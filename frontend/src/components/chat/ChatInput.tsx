// frontend/src/components/chat/ChatInput.tsx (파일명 변경)
import React from 'react';

interface ChatInputProps {
  placeholder?: string;
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ placeholder = "", onSendMessage }: ChatInputProps) {
  const [message, setMessage] = React.useState('');

  const handleSendClick = () => {
    if (message.trim()) { 
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Shift+Enter는 줄바꿈, Enter만 누르면 전송
      e.preventDefault(); // 기본 Enter 동작(줄바꿈) 방지
      handleSendClick();
    }
  };

  return (
    <div
      className="
        h-[172px] rounded-[20px] border border-[#D1D5DB]
        flex relative p-[24px] box-border mt-[32px] mb-[32px]
      "
      style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.06)' }}
    >
      {/* 입력 필드 */}
      <textarea
        placeholder={placeholder}
        className="
          w-[90%] h-full text-left text-[#8E8585] text-[20px]
          border-none focus:outline-none resize-none bg-transparent placeholder-[#8E8585]
        "
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      ></textarea>

      {/* 버튼 */}  
      <button 
        className="
          absolute bottom-[24px] right-[24px]
          w-[96px] h-[40px] rounded-full flex items-center justify-center cursor-pointer
          hover:opacity-80 transition-opacity
        "
        style={{ backgroundColor: '#122250' }}
        onClick={handleSendClick}
      >
        {/* Send 문자 */} 
        <p className="text-[#FFFFFF] text-[16px] font-pretendard font-medium ml-[8px]">Send</p>
        {/* 화살표 아이콘 */} 
        <svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
    
      </button> 
    </div>
  );
}
