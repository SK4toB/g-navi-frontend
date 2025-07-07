// frontend/src/components/conversation/Message.tsx
import React, { useEffect, useCallback } from 'react';

interface MessageProps {
 sender: 'user' | 'bot';
 text: React.ReactNode | string;
}

// URL 유효성 검사 함수
const isValidUrl = (string: string): boolean => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// URL에 프로토콜이 없으면 추가
const ensureProtocol = (url: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

// Mermaid 코드 전처리 함수
const preprocessMermaidCode = (code: string): string => {
  return code
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
};

export default function Message({ sender, text }: MessageProps) {
  const isUser = sender === 'user';

  // Mermaid 다이어그램을 SVG로 다운로드하는 함수
  const downloadMermaidAsSVG = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const svgElement = element.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = `mermaid-diagram-${Date.now()}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
      }
    }
  }, []);

  // Mermaid 다이어그램 확대/축소 함수 - 더 큰 사이즈로 수정
  const zoomMermaidDiagram = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const svgElement = element.querySelector('svg');
      if (svgElement) {
        // 모달 생성
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75';
        modal.onclick = () => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        };
        
        const modalContent = document.createElement('div');
        // 모달 컨테이너 크기를 더 크게 설정
        modalContent.className = 'relative max-w-[98vw] max-h-[98vh] bg-white rounded-lg p-6 overflow-auto';
        modalContent.onclick = (e) => e.stopPropagation();
        
        // 닫기 버튼
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.className = 'absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md border border-gray-200';
        closeButton.onclick = () => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        };
        
        // SVG 복제 및 스타일링 - 더 큰 사이즈로 설정
        const clonedSvg = svgElement.cloneNode(true) as SVGElement;
        clonedSvg.style.width = 'auto';
        clonedSvg.style.height = 'auto';
        clonedSvg.style.maxWidth = '100%';
        clonedSvg.style.maxHeight = '90vh'; // 80vh → 90vh로 증가
        clonedSvg.style.minWidth = '800px'; // 400px → 800px로 증가
        clonedSvg.style.minHeight = '500px'; // 최소 높이 추가
        
        modalContent.appendChild(closeButton);
        modalContent.appendChild(clonedSvg);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // ESC 키로 모달 닫기
        const handleEsc = (e: KeyboardEvent) => {
          if (e.key === 'Escape' && document.body.contains(modal)) {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEsc);
          }
        };
        document.addEventListener('keydown', handleEsc);
      }
    }
  }, []);

  // 간단한 마크다운 파싱 함수
  const parseMarkdown = useCallback((text: string, isUser: boolean = false): React.ReactNode => {
    // 더 엄격한 Mermaid 다이어그램 감지 및 처리
    const mermaidRegex = /```mermaid\s*\n([\s\S]*?)\n\s*```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mermaidRegex.exec(text)) !== null) {
      // Mermaid 블록 앞의 텍스트 추가
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push(parseTextMarkdown(beforeText, isUser));
      }

      // Mermaid 다이어그램 추가
      const mermaidCode = match[1];
      const mermaidId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      parts.push(
        <div key={mermaidId} className="my-6">
          <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* 다이어그램 컨트롤 버튼 */}
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <button
                onClick={() => downloadMermaidAsSVG(mermaidId)}
                className="p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                title="SVG로 저장"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={() => zoomMermaidDiagram(mermaidId)}
                className="p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                title="확대/축소"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
            </div>
            <div 
              id={mermaidId}
              className="mermaid p-6 overflow-x-auto cursor-grab"
              style={{ fontSize: '14px', minHeight: '100px' }}
            >
              {mermaidCode}
            </div>
          </div>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // 남은 텍스트 추가
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      parts.push(parseTextMarkdown(remainingText, isUser));
    }

    return parts.length > 0 ? parts : parseTextMarkdown(text, isUser);
  }, [downloadMermaidAsSVG, zoomMermaidDiagram]);

  // 일반 텍스트 마크다운 파싱
  const parseTextMarkdown = useCallback((text: string, isUser: boolean = false): React.ReactNode => {
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
              <li key={idx} className={isUser ? "text-white" : "text-gray-800"}>{parseInlineMarkdown(item, isUser)}</li>
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
        
        const headingContent = parseInlineMarkdown(headingText, isUser);
        
        // 사용자 메시지용 색상 클래스
        const headingColorClass = isUser ? "text-white" : "text-gray-900";
        const subHeadingColorClass = isUser ? "text-white" : "text-gray-800";
        const smallHeadingColorClass = isUser ? "text-white" : "text-gray-700";
        
        // 조건부 렌더링으로 각 헤딩 레벨 처리
        let headingElement: React.ReactNode;
        switch (level) {
          case 1:
            headingElement = <h1 key={`heading-${index}`} className={`text-2xl font-bold ${headingColorClass} mt-6 mb-4`}>{headingContent}</h1>;
            break;
          case 2:
            headingElement = <h2 key={`heading-${index}`} className={`text-xl font-bold ${headingColorClass} mt-5 mb-3`}>{headingContent}</h2>;
            break;
          case 3:
            headingElement = <h3 key={`heading-${index}`} className={`text-lg font-bold ${subHeadingColorClass} mt-4 mb-2`}>{headingContent}</h3>;
            break;
          case 4:
            headingElement = <h4 key={`heading-${index}`} className={`text-base font-bold ${subHeadingColorClass} mt-3 mb-2`}>{headingContent}</h4>;
            break;
          case 5:
            headingElement = <h5 key={`heading-${index}`} className={`text-sm font-bold ${smallHeadingColorClass} mt-2 mb-1`}>{headingContent}</h5>;
            break;
          case 6:
            headingElement = <h6 key={`heading-${index}`} className={`text-xs font-bold ${smallHeadingColorClass} mt-2 mb-1`}>{headingContent}</h6>;
            break;
          default:
            headingElement = <p key={`heading-${index}`} className={`font-bold ${subHeadingColorClass}`}>{headingContent}</p>;
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
          <p key={`p-${index}`} className={`leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {parseInlineMarkdown(line, isUser)}
          </p>
        );
      }
    });

    // 남은 리스트나 코드 블록 처리
    flushList();
    flushCodeBlock();

    return elements;
  }, []);

  // 인라인 마크다운 파싱 (볼드, 이탤릭, 코드, 링크 등)
  const parseInlineMarkdown = useCallback((text: string, isUser: boolean = false): React.ReactNode => {
    if (!text) return text;

    // 링크 색상 클래스 설정
    const linkColorClass = isUser 
      ? "text-blue-100 hover:text-white underline hover:no-underline transition-colors" 
      : "text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors";
    
    const codeColorClass = isUser 
      ? "bg-white bg-opacity-20 text-white px-1 py-0.5 rounded text-sm font-mono" 
      : "bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono";
    
    const boldColorClass = isUser ? "font-bold text-white" : "font-bold text-gray-900";
    const italicColorClass = isUser ? "italic text-white" : "italic text-gray-700";

    // 마크다운 링크 처리 [텍스트](URL)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      const safeUrl = ensureProtocol(url.trim());
      if (isValidUrl(safeUrl)) {
        // 링크 텍스트만 표시 (URL 숨김)
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="${linkColorClass}">${linkText}</a>`;
      }
      return match; // 유효하지 않은 URL이면 원본 텍스트 반환
    });

    // 자동 링크 처리 <URL>
    text = text.replace(/<(https?:\/\/[^>]+)>/g, (match, url) => {
      if (isValidUrl(url)) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${linkColorClass}">${url}</a>`;
      }
      return match;
    });

    // 일반 URL 자동 링크 (프로토콜 포함)
    text = text.replace(/(?<![\[<"])(https?:\/\/[^\s<>"]+)/g, (match, url) => {
      if (isValidUrl(url)) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${linkColorClass}">${url}</a>`;
      }
      return match;
    });

    // www로 시작하는 URL 자동 링크
    text = text.replace(/(?<![\[<":/])(?:^|\s)(www\.[^\s<>"]+)/g, (match, url) => {
      const fullUrl = ensureProtocol(url);
      if (isValidUrl(fullUrl)) {
        return match.replace(url, `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="${linkColorClass}">${url}</a>`);
      }
      return match;
    });

    // 인라인 코드 처리 (백틱) - 링크 처리 후에 해야 링크 안의 백틱이 코드로 처리되지 않음
    text = text.replace(/`([^`]+)`/g, `<code class="${codeColorClass}">$1</code>`);
    
    // 볼드 처리 (**text** 또는 __text__)
    text = text.replace(/\*\*([^*]+)\*\*/g, `<strong class="${boldColorClass}">$1</strong>`);
    text = text.replace(/__([^_]+)__/g, `<strong class="${boldColorClass}">$1</strong>`);
    
    // 이탤릭 처리 (*text* 또는 _text_)
    text = text.replace(/\*([^*]+)\*/g, `<em class="${italicColorClass}">$1</em>`);
    text = text.replace(/_([^_]+)_/g, `<em class="${italicColorClass}">$1</em>`);

    // HTML을 React 엘리먼트로 변환
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }, []);

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
                // 개선된 Mermaid 설정
                mermaid.initialize({ 
                  startOnLoad: false,
                  theme: 'default',
                  securityLevel: 'loose',
                  flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                    curve: 'basis'
                  },
                  // 한글 지원을 위한 설정 추가
                  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
                  fontSize: 14,
                  // 렌더링 타임아웃 설정
                  maxTextSize: 90000,
                  maxEdges: 2000
                });
                renderMermaidDiagrams(mermaid);
              }
            };
            document.head.appendChild(script);
          } else {
            renderMermaidDiagrams((window as any).mermaid);
          }
        } catch (error) {
          console.error('Mermaid 로드 오류:', error);
        }
      };

      const renderMermaidDiagrams = async (mermaid: any) => {
        // 모든 mermaid 다이어그램 렌더링
        const mermaidElements = document.querySelectorAll('.mermaid');
        mermaidElements.forEach(async (element) => {
          if (element.getAttribute('data-processed') !== 'true') {
            // 재시도 로직 추가
            let attempts = 0;
            const maxAttempts = 3;
            
            while (attempts < maxAttempts) {
              try {
                let graphDefinition = element.textContent || '';
                
                // 코드 전처리 적용
                graphDefinition = preprocessMermaidCode(graphDefinition);
                
                const { svg } = await mermaid.render(`graph-${Date.now()}-${attempts}`, graphDefinition);
                element.innerHTML = svg;
                element.setAttribute('data-processed', 'true');
                
                // 드래그 기능 추가
                addDragFunctionality(element as HTMLElement);
                break; // 성공 시 루프 종료
              } catch (error) {
                attempts++;
                console.error(`Mermaid 렌더링 오류 (시도 ${attempts}/${maxAttempts}):`, error);
                
                if (attempts >= maxAttempts) {
                  // 최종 실패 시 fallback 표시
                  element.innerHTML = `<div class="text-gray-500 text-sm p-4 border border-dashed border-gray-300 rounded">
                    <div class="font-medium mb-2">📊 다이어그램 표시 불가</div>
                    <details class="text-xs">
                      <summary class="cursor-pointer">원본 코드 보기</summary>
                      <pre class="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">${element.textContent}</pre>
                    </details>
                    <details class="text-xs mt-2">
                      <summary class="cursor-pointer text-red-600">오류 세부정보</summary>
                      <pre class="mt-1 p-2 bg-red-50 rounded text-red-700">${error}</pre>
                    </details>
                  </div>`;
                } else {
                  // 재시도 전 잠시 대기
                  await new Promise(resolve => setTimeout(resolve, 100 * attempts));
                }
              }
            }
          }
        });
      };

      // 드래그 기능 추가 함수
      const addDragFunctionality = (element: HTMLElement) => {
        const svgElement = element.querySelector('svg');
        if (svgElement) {
          let isDragging = false;
          let startX = 0;
          let startY = 0;
          let scrollLeft = 0;
          let scrollTop = 0;

          element.addEventListener('mousedown', (e) => {
            isDragging = true;
            element.style.cursor = 'grabbing';
            startX = e.pageX - element.offsetLeft;
            startY = e.pageY - element.offsetTop;
            scrollLeft = element.scrollLeft;
            scrollTop = element.scrollTop;
          });

          element.addEventListener('mouseleave', () => {
            isDragging = false;
            element.style.cursor = 'grab';
          });

          element.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'grab';
          });

          element.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - element.offsetLeft;
            const y = e.pageY - element.offsetTop;
            const walkX = (x - startX) * 2;
            const walkY = (y - startY) * 2;
            element.scrollLeft = scrollLeft - walkX;
            element.scrollTop = scrollTop - walkY;
          });
        }
      };

      // 약간의 지연 후 Mermaid 초기화 (DOM이 완전히 렌더링된 후)
      setTimeout(initMermaid, 100);
    }
  }, [text]);

  // 발신자에 따른 스타일 적용
  const finalMessageClasses = `
    max-w-[70%] p-4 mb-6 font-pretendard text-[15px] leading-[1.6em]
    ${isUser
      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[20px_20px_6px_20px] self-end shadow-[0_4px_12px_0_rgba(79,70,229,0.25)]' // 사용자 메시지
      : 'bg-white border border-[#E5E7EB] rounded-[20px_20px_20px_6px] self-start shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)] transition-shadow duration-200' // 챗봇 메시지
    }
  `.replace(/\s+/g, ' ');

  // 텍스트 처리 - isUser 파라미터 전달
  const processedContent = typeof text === 'string' ? parseMarkdown(text, isUser) : text;

  return (
    <div className={finalMessageClasses}>
      <div className="prose prose-sm max-w-none">
        {processedContent}
      </div>
    </div>
  );
}