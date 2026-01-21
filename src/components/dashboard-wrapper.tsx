'use client';

import { useEffect, useRef, useState } from 'react';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !contentRef.current) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // 基准设计宽度
      const designWidth = 1920;

      // 获取实际内容高度
      const contentHeight = contentRef.current.scrollHeight;

      // 计算宽度的缩放比例
      const scaleX = windowWidth / designWidth;

      // 取较小的比例，确保内容在屏幕宽度内显示
      const newScale = Math.min(scaleX, 1); // 最大不超过 1（不放大）

      setScale(newScale);
    };

    // 初始计算
    updateScale();

    // 监听窗口变化
    const handleResize = () => {
      requestAnimationFrame(updateScale);
    };

    window.addEventListener('resize', handleResize);

    // 防抖优化
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="dashboard-wrapper"
      style={{
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'auto',
        backgroundColor: '#f3f4f6',
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: '1920px',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
