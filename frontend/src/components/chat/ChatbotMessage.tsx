interface ChatbotMessageProps {
  message: React.ReactNode;
}

export default function ChatbotMessage({ message }: ChatbotMessageProps) {
  return (
    <div className="
        max-w-[60%] bg-[#F9FAFB] rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_4px_0_rgba(0,0,0,0.06)]
        flex items-center justify-center p-[12px] mb-[8px] text-[#111827] text-[16px] leading-[1.5em] font-pretendard
    ">
      {message}
    </div>
  );
}