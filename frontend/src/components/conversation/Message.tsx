// frontend/src/components/conversation/Message.tsx
import React, { useEffect } from 'react';

interface MessageProps {
 sender: 'user' | 'bot';
 text: React.ReactNode | string;
}

// 간단한 마크다운 파싱 함수
const parseMarkdown = (text: string): React.ReactNode => {
  // Mermaid 다이어그램 감지 및 처리
  const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mermaidRegex.exec(text)) !== null) {
    // Mermaid 블록 앞의 텍스트 추가
    if (match.index > lastIndex) {
      const beforeText = text.slice(lastIndex, match.index);
      parts.push(parseTextMarkdown(beforeText));
    }

    // Mermaid 다이어그램 추가
    const mermaidCode = match[1];
    const mermaidId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    parts.push(
      <div key={mermaidId} className="my-6">
        <div 
          id={mermaidId}
          className="mermaid bg-white p-6 rounded-lg border border-gray-200 overflow-x-auto shadow-sm"
          style={{ fontSize: '14px', minHeight: '100px' }}
        >
          {mermaidCode}
        </div>
      </div>
    );

    lastIndex = match.index + match[0].length;
  }

  // 남은 텍스트 추가
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    parts.push(parseTextMarkdown(remainingText));
  }

  return parts.length > 0 ? parts : parseTextMarkdown(text);
};

// 일반 텍스트 마크다운 파싱
const parseTextMarkdown = (text: string): React.ReactNode => {
  if (!text || typeof text !== 'string') return text;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentListItems: string[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLanguage = '';

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside my-2 ml-4 space-y-1">
          {currentListItems.map((item, idx) => (
            <li key={idx} className="text-gray-800">{parseInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockContent.length > 0) {
      elements.push(
        <div key={`code-${elements.length}`} className="my-3">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {codeBlockLanguage && (
              <div className="bg-gray-200 px-3 py-1 text-xs text-gray-600 font-mono">
                {codeBlockLanguage}
              </div>
            )}
            <pre className="p-3 overflow-x-auto">
              <code className="text-sm font-mono text-gray-800">
                {codeBlockContent.join('\n')}
              </code>
            </pre>
          </div>
        </div>
      );
      codeBlockContent = [];
      codeBlockLanguage = '';
    }
  };

  lines.forEach((line, index) => {
    // 코드 블록 시작/끝 처리
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
        codeBlockLanguage = line.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // 제목 처리 (H1-H6)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      
      const headingContent = parseInlineMarkdown(headingText);
      
      // 조건부 렌더링으로 각 헤딩 레벨 처리
      let headingElement: React.ReactNode;
      switch (level) {
        case 1:
          headingElement = <h1 key={`heading-${index}`} className="text-2xl font-bold text-gray-900 mt-6 mb-4">{headingContent}</h1>;
          break;
        case 2:
          headingElement = <h2 key={`heading-${index}`} className="text-xl font-bold text-gray-900 mt-5 mb-3">{headingContent}</h2>;
          break;
        case 3:
          headingElement = <h3 key={`heading-${index}`} className="text-lg font-bold text-gray-800 mt-4 mb-2">{headingContent}</h3>;
          break;
        case 4:
          headingElement = <h4 key={`heading-${index}`} className="text-base font-bold text-gray-800 mt-3 mb-2">{headingContent}</h4>;
          break;
        case 5:
          headingElement = <h5 key={`heading-${index}`} className="text-sm font-bold text-gray-700 mt-2 mb-1">{headingContent}</h5>;
          break;
        case 6:
          headingElement = <h6 key={`heading-${index}`} className="text-xs font-bold text-gray-700 mt-2 mb-1">{headingContent}</h6>;
          break;
        default:
          headingElement = <p key={`heading-${index}`} className="font-bold text-gray-800">{headingContent}</p>;
      }

      elements.push(headingElement);
      return;
    }

    // 리스트 아이템 처리
    const listMatch = line.match(/^[-*+]\s+(.+)$/);
    if (listMatch) {
      currentListItems.push(listMatch[1]);
      return;
    }

    // 번호 리스트 처리
    const numberedListMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numberedListMatch) {
      flushList();
      if (currentListItems.length === 0) {
        // 새로운 번호 리스트 시작
      }
      currentListItems.push(numberedListMatch[1]);
      return;
    }

    // 일반 리스트가 끝났으면 flush
    if (currentListItems.length > 0 && !listMatch && !numberedListMatch) {
      flushList();
    }

    // 빈 줄 처리
    if (line.trim() === '') {
      flushList();
      if (elements.length > 0) {
        elements.push(<br key={`br-${index}`} />);
      }
      return;
    }

    // 일반 텍스트 처리
    flushList();
    if (line.trim()) {
      elements.push(
        <p key={`p-${index}`} className="mb-2 text-gray-800 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  });

  // 남은 리스트나 코드 블록 처리
  flushList();
  flushCodeBlock();

  return elements;
};

// 인라인 마크다운 파싱 (볼드, 이탤릭, 코드 등)
const parseInlineMarkdown = (text: string): React.ReactNode => {
  if (!text) return text;

  // 인라인 코드 처리 (백틱)
  text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
  
  // 볼드 처리 (**text** 또는 __text__)
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong class="font-bold text-gray-900">$1</strong>');
  
  // 이탤릭 처리 (*text* 또는 _text_)
  text = text.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700">$1</em>');
  text = text.replace(/_([^_]+)_/g, '<em class="italic text-gray-700">$1</em>');

  // HTML을 React 엘리먼트로 변환
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

export default function Message({ sender, text }: MessageProps) {
  const isUser = sender === 'user';

  // Mermaid 초기화 및 렌더링
  useEffect(() => {
    if (typeof text === 'string' && text.includes('```mermaid')) {
      // Mermaid를 동적으로 로드하고 초기화
      const initMermaid = async () => {
        try {
          // 전역 스크립트로 Mermaid 로드
          if (!(window as any).mermaid) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
            script.onload = () => {
              const mermaid = (window as any).mermaid;
              if (mermaid) {
                // Mermaid 설정
                mermaid.initialize({ 
                  startOnLoad: false,
                  theme: 'default',
                  securityLevel: 'loose',
                  flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true
                  }
                });
                renderMermaidDiagrams(mermaid);
              }
            };
            document.head.appendChild(script);
          } else {
            renderMermaidDiagrams((window as any).mermaid);
          }
        } catch (error) {
          console.error('Mermaid loading error:', error);
        }
      };

      const renderMermaidDiagrams = async (mermaid: any) => {
        // 모든 mermaid 다이어그램 렌더링
        const mermaidElements = document.querySelectorAll('.mermaid');
        mermaidElements.forEach(async (element) => {
          if (element.getAttribute('data-processed') !== 'true') {
            try {
              const graphDefinition = element.textContent || '';
              const { svg } = await mermaid.render(`graph-${Date.now()}`, graphDefinition);
              element.innerHTML = svg;
              element.setAttribute('data-processed', 'true');
            } catch (error) {
              console.error('Mermaid rendering error:', error);
              element.innerHTML = `<div class="text-red-500 text-sm p-4">다이어그램 렌더링 오류</div>`;
            }
          }
        });
      };

      // 약간의 지연 후 Mermaid 초기화 (DOM이 완전히 렌더링된 후)
      setTimeout(initMermaid, 100);
    }
  }, [text]);

  // 발신자에 따른 스타일 적용
  const finalMessageClasses = `
    max-w-[70%] p-4 mb-6 font-pretendard text-[15px] leading-[1.6em]
    ${isUser
      ? 'bg-main-color text-white rounded-[20px_20px_6px_20px] self-end shadow-[0_4px_12px_0_rgba(79,70,229,0.25)]' // 사용자 메시지
      : 'bg-white border border-[#E5E7EB] rounded-[20px_20px_20px_6px] self-start shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)] transition-shadow duration-200 text-gray-800' // 챗봇 메시지
    }
  `.replace(/\s+/g, ' ');

  // 텍스트 처리
  const processedContent = typeof text === 'string' ? parseMarkdown(text) : text;

  return (
    <div className={finalMessageClasses}>
      <div className="prose prose-sm max-w-none">
        {processedContent}
      </div>
    </div>
  );
}