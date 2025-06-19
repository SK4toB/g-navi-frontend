import React, { useState, useEffect } from 'react';
import solidflyImage from '../../assets/solidfly.png';

const SKButterflyBackground = () => {
  const [butterflies, setButterflies] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isSpawning, setIsSpawning] = useState(false); // 나비 생성 중복 방지 플래그

  // ============ 설정값들 (수정하기 쉽도록) ============
  const BUTTERFLY_COUNT = 2; // 한 번에 생성할 나비 개수 (항상 2마리)
  const LIFESPAN = 5000; // 생존시간 5초 고정 (밀리초)
  const FADE_IN_TIME = 1000; // 페이드인 시간 (밀리초)
  const FADE_OUT_TIME = 1000; // 페이드아웃 시간 (밀리초)
  const SPAWN_DELAY_AFTER_DEATH = 500; // 나비가 완전히 사라진 후 새 나비 생성까지의 딜레이 (밀리초)

  // (기존 설정값 유지)
  const MIN_SIZE = 60; // 나비 최소 크기
  const MAX_SIZE = 100; // 나비 최대 크기
  const MIN_SPEED = 0.4; // 최소 이동 속도
  const MAX_SPEED = 1.2; // 최대 이동 속도
  const SPAWN_MARGIN = 100; // 화면 가장자리 여백
  const IMAGE_BASE_DIRECTION = 300; // 이미지 기본 방향

  // 화면 크기 감지
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 새 나비 생성 함수
  const createNewButterflyPair = () => {
    if (isSpawning) return; // 이미 생성 중이면 중복 실행 방지
    setIsSpawning(true);

    const newButterflies = [];
    const now = Date.now();

    for (let i = 0; i < BUTTERFLY_COUNT; i++) {
      const moveDirection = Math.random() * 360;
      const speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
      const vx = Math.cos(moveDirection * Math.PI / 180) * speed;
      const vy = Math.sin(moveDirection * Math.PI / 180) * speed;
      const imageRotation = moveDirection - IMAGE_BASE_DIRECTION;

      const newButterfly = {
        id: `${now}-${i}`, // 고유 ID 생성
        x: Math.random() * (dimensions.width - SPAWN_MARGIN * 2) + SPAWN_MARGIN,
        y: Math.random() * (dimensions.height - SPAWN_MARGIN * 2) + SPAWN_MARGIN,
        size: Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE,
        vx: vx,
        vy: vy,
        rotation: imageRotation,
        opacity: 0,
        createdAt: now + i * 200, // 약간의 딜레이를 주어 순차적으로 나타나게
        lifespan: LIFESPAN,
      };
      newButterflies.push(newButterfly);
    }

    setButterflies(newButterflies); // 기존 나비들을 완전히 교체
    // 일정 시간 후 생성 플래그 해제 (나비가 완전히 사라질 시간 고려)
    setTimeout(() => {
      setIsSpawning(false);
    }, LIFESPAN + SPAWN_DELAY_AFTER_DEATH);
  };

  // 초기 나비 생성
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0 && butterflies.length === 0 && !isSpawning) {
      createNewButterflyPair();
    }
  }, [dimensions, butterflies.length, isSpawning]);

  // 나비 생명주기 관리 및 새 그룹 생성 트리거
  useEffect(() => {
    const lifecycleInterval = setInterval(() => {
      const now = Date.now();

      setButterflies((prev) => {
        const updatedButterflies = prev.map((butterfly) => {
          const age = now - butterfly.createdAt;

          // 페이드인 단계
          if (age < FADE_IN_TIME) {
            return { ...butterfly, opacity: age / FADE_IN_TIME };
          }
          // 완전히 보이는 단계
          if (age < butterfly.lifespan - FADE_OUT_TIME) {
            return { ...butterfly, opacity: 1 };
          }
          // 페이드아웃 단계
          if (age < butterfly.lifespan) {
            const fadeStartTime = butterfly.lifespan - FADE_OUT_TIME;
            return { ...butterfly, opacity: 1 - (age - fadeStartTime) / FADE_OUT_TIME };
          }

          return butterfly;
        });

        const aliveButterflies = updatedButterflies.filter(
          (butterfly) => now - butterfly.createdAt < butterfly.lifespan
        );

        // 모든 나비가 사라지면 새로운 나비 쌍 생성 트리거
        if (aliveButterflies.length === 0 && !isSpawning) {
          setTimeout(() => {
            createNewButterflyPair();
          }, SPAWN_DELAY_AFTER_DEATH); // 나비가 완전히 사라진 후 딜레이
        }

        return aliveButterflies;
      });
    }, 50); // 업데이트 주기

    return () => clearInterval(lifecycleInterval);
  }, [isSpawning]);

  // 나비 움직임 애니메이션 (일직선 이동, 벽에서 반사)
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setButterflies((prev) =>
        prev.map((butterfly) => {
          let newX = butterfly.x + butterfly.vx;
          let newY = butterfly.y + butterfly.vy;
          let newVx = butterfly.vx;
          let newVy = butterfly.vy;
          let newRotation = butterfly.rotation;

          // 좌우 벽에서 반사
          if (newX <= 0 || newX >= dimensions.width - butterfly.size) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(dimensions.width - butterfly.size, newX));
            const newDirection = Math.atan2(newVy, newVx) * 180 / Math.PI;
            newRotation = newDirection - IMAGE_BASE_DIRECTION;
          }

          // 상하 벽에서 반사
          if (newY <= 0 || newY >= dimensions.height - butterfly.size) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(dimensions.height - butterfly.size, newY));
            const newDirection = Math.atan2(newVy, newVx) * 180 / Math.PI;
            newRotation = newDirection - IMAGE_BASE_DIRECTION;
          }

          return {
            ...butterfly,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
          };
        })
      );
    }, 50); // 움직임 업데이트 주기

    return () => clearInterval(moveInterval);
  }, [dimensions]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -5 }}>
      {butterflies.map((butterfly) => (
        <div
          key={butterfly.id}
          className="absolute"
          style={{
            left: `${butterfly.x}px`,
            top: `${butterfly.y}px`,
            width: `${butterfly.size}px`,
            height: `${butterfly.size}px`,
            transform: `rotate(${butterfly.rotation}deg)`,
            opacity: butterfly.opacity,
            transition: `opacity ${FADE_IN_TIME / 1000}s linear`, // 페이드인/아웃 시 부드러운 전환
            pointerEvents: 'none',
          }}
        >
          <img
            src={solidflyImage}
            alt="SK Butterfly"
            className="w-full h-full object-contain"
            style={{ pointerEvents: 'none' }}
            draggable={false}
          />
        </div>
      ))}

    </div>
  );
};

export default SKButterflyBackground;