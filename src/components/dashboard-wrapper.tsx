'use client';

import { useEffect, useRef, useState } from 'react';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // 基准设计尺寸 (1920x1080)
      const designWidth = 1920;
      const designHeight = 1080;

      // 计算宽度和高度的缩放比例
      const scaleX = windowWidth / designWidth;
      const scaleY = windowHeight / designHeight;

      // 取较小的比例，确保内容完整显示在屏幕内
      const newScale = Math.min(scaleX, scaleY, 1); // 最大不超过 1（不放大）

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
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '1920px',
          minHeight: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
