'use client';

import { useState } from 'react';
import { CheckCircle2, X, Loader2, AlertCircle, Info, AlertTriangle, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  type?: 'default' | 'danger' | 'warning' | 'success' | 'info';
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  type = 'default',
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setSuccess(true);
      // 2秒后自动关闭
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error('操作失败:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(false);
      onOpenChange(false);
    }
  };

  // 根据类型获取样式和图标
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-400',
          borderColor: 'border-red-500/60',
          confirmBg: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400',
          glowColor: 'rgba(239,68,68,0.6)',
          icon: AlertCircle
        };
      case 'warning':
        return {
          iconBg: 'bg-orange-500/20',
          iconColor: 'text-orange-400',
          borderColor: 'border-orange-500/60',
          confirmBg: 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400',
          glowColor: 'rgba(249,115,22,0.6)',
          icon: AlertTriangle
        };
      case 'success':
        return {
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-400',
          borderColor: 'border-green-500/60',
          confirmBg: 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400',
          glowColor: 'rgba(74,222,128,0.6)',
          icon: CheckCircle2
        };
      case 'info':
        return {
          iconBg: 'bg-cyan-500/20',
          iconColor: 'text-cyan-400',
          borderColor: 'border-cyan-500/60',
          confirmBg: 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400',
          glowColor: 'rgba(6,182,212,0.6)',
          icon: Info
        };
      default:
        return {
          iconBg: 'bg-slate-500/20',
          iconColor: 'text-slate-400',
          borderColor: 'border-slate-500/60',
          confirmBg: 'bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400',
          glowColor: 'rgba(148,163,184,0.6)',
          icon: Info
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          'max-w-2xl bg-gradient-to-br from-slate-950/98 via-slate-900/98 to-slate-950/98',
          'border-2',
          styles.borderColor,
          'shadow-[0_0_50px_rgba(0,0,0,0.8)]'
        )}
        style={{
          boxShadow: `0 0 40px ${styles.glowColor}, 0 0 80px rgba(0,0,0,0.5)`
        }}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(${styles.glowColor} 1px, transparent 1px),
            linear-gradient(90deg, ${styles.glowColor} 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>

        {/* 顶部发光条 */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 animate-pulse"
          style={{
            background: `linear-gradient(to right, transparent, ${styles.glowColor}, transparent)`
          }}
        ></div>

        <DialogHeader className="relative z-10 pb-2">
          <div className="flex items-start gap-4">
            {success ? (
              <div className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0',
                'bg-green-500/20 border-2 border-green-500/60',
                'shadow-[0_0_20px_rgba(74,222,128,0.5)]'
              )}>
                <CheckCircle2 className="w-7 h-7 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              </div>
            ) : (
              <div className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0',
                styles.iconBg,
                'border-2',
                styles.borderColor,
                'shadow-[0_0_20px_rgba(0,0,0,0.5)]'
              )}>
                {loading ? (
                  <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
                ) : (
                  <IconComponent className="w-7 h-7 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                )}
              </div>
            )}
            <div className="flex-1">
              <DialogTitle className={cn(
                'text-xl font-bold mb-2',
                success ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]' : styles.iconColor,
                'drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]'
              )}>
                {success ? '操作成功' : title}
              </DialogTitle>
              {!success && type === 'warning' && (
                <div className="flex items-center gap-2 text-xs text-orange-300/70 mb-1">
                  <Zap className="w-3 h-3" />
                  <span>请注意：此操作将发送消息提醒</span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="relative z-10 py-4">
          <div className={cn(
            'rounded-lg p-4 border',
            styles.borderColor,
            'bg-slate-900/50 backdrop-blur-sm'
          )}>
            <p className={cn(
              'text-sm leading-relaxed whitespace-pre-wrap break-words',
              success ? 'text-green-300' : 'text-slate-200'
            )}>
              {description}
            </p>
          </div>
        </div>

        <DialogFooter className="relative z-10 flex flex-row gap-3 pt-4 !justify-center w-full">
          {!loading && !success && (
            <Button
              variant="outline"
              onClick={handleClose}
              className={cn(
                'px-6 py-2 font-medium min-w-[100px]',
                'border-cyan-500/60 text-cyan-300',
                'hover:bg-cyan-500/20 hover:border-cyan-500/80',
                'shadow-[0_0_10px_rgba(6,182,212,0.3)]',
                'transition-all duration-300'
              )}
            >
              {cancelText}
            </Button>
          )}
          {!success && (
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'px-8 py-2 font-semibold min-w-[120px]',
                styles.confirmBg,
                'text-white border border-white/20',
                'shadow-lg shadow-black/30',
                'hover:shadow-[0_0_25px_rgba(0,0,0,0.5)]',
                'transition-all duration-300',
                'hover:scale-105 active:scale-95'
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>处理中...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {type === 'warning' && <Zap className="w-4 h-4" />}
                  <span>{confirmText}</span>
                </div>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
