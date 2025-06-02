interface UserMessageProps {
  message: React.ReactNode;
}

export default function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="
      max-w-[60%] bg-[#DCF8C6] rounded-[12px] p-[12px] mb-[8px]
      self-end text-[#111827] text-[16px] leading-[1.5em] font-pretendard
    ">
      {message}
    </div>
  );
}