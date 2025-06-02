import React from 'react';

interface NewChatInputProps {
  placeholder?: string;
  onSendMessage: (message: string) => void; // 메시지 전송 함수 prop 추가
}

export default function NewChatInput({ placeholder = "궁금하거나 필요한 것들 말씀해주세요.", onSendMessage }: NewChatInputProps) {
  const [message, setMessage] = React.useState(''); // 입력 필드 상태

  const handleSendClick = () => {
    if (message.trim()) { // 메시지가 비어있지 않은 경우에만 전송
      onSendMessage(message);
      setMessage(''); // 입력 필드 초기화
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
        w-[816px] h-[172px] bg-white rounded-[20px] border border-[#D1D5DB]
        flex items-center justify-center relative p-[24px] box-border mt-[32px] mb-[32px]
      "
      style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.06)' }}
    >
      <textarea
        placeholder={placeholder}
        className="
          w-full h-full text-left text-[#8E8585] text-[20px] leading-[1.2em] font-pretendard
          border-none focus:outline-none resize-none bg-transparent placeholder-[#8E8585]
        "
        rows={3}
        value={message} // 상태와 연결
        onChange={(e) => setMessage(e.target.value)} // 입력 변경 핸들러
        onKeyPress={handleKeyPress} // Enter 키 처리
      ></textarea>
        
      <button 
        className="
          absolute bottom-[24px] right-[24px]
          w-[96px] h-[40px] rounded-full flex items-center justify-center cursor-pointer
          hover:opacity-80 transition-opacity
        "
        style={{ backgroundColor: '#122250' }}
        onClick={handleSendClick} // 버튼 클릭 핸들러
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
