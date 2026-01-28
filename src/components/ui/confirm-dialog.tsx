'use client';

import { useState } from 'react';
import { CheckCircle2, X, Loader2 } from 'lucide-react';
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

  // 根据类型获取样式
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-400',
          borderColor: 'border-red-500/50',
          confirmBg: 'bg-red-500 hover:bg-red-600',
        };
      case 'warning':
        return {
          iconBg: 'bg-orange-500/20',
          iconColor: 'text-orange-400',
          borderColor: 'border-orange-500/50',
          confirmBg: 'bg-orange-500 hover:bg-orange-600',
        };
      case 'success':
        return {
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-400',
          borderColor: 'border-green-500/50',
          confirmBg: 'bg-green-500 hover:bg-green-600',
        };
      case 'info':
        return {
          iconBg: 'bg-cyan-500/20',
          iconColor: 'text-cyan-400',
          borderColor: 'border-cyan-500/50',
          confirmBg: 'bg-cyan-500 hover:bg-cyan-600',
        };
      default:
        return {
          iconBg: 'bg-slate-500/20',
          iconColor: 'text-slate-400',
          borderColor: 'border-slate-500/50',
          confirmBg: 'bg-slate-500 hover:bg-slate-600',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          'max-w-md bg-gradient-to-br from-slate-900/95 to-slate-800/95',
          'border-2',
          styles.borderColor,
          'shadow-[0_0_30px_rgba(0,0,0,0.5)]'
        )}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            {success ? (
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                'bg-green-500/20 border-2 border-green-500/50'
              )}>
                <CheckCircle2 className="w-6 h-6 text-green-400 animate-bounce" />
              </div>
            ) : (
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                styles.iconBg,
                'border-2',
                styles.borderColor
              )}>
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
            )}
            <DialogTitle className={cn(
              'text-xl font-bold',
              success ? 'text-green-400' : 'text-cyan-100'
            )}>
              {success ? '操作成功' : title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className={cn(
            'text-sm leading-relaxed',
            success ? 'text-green-300' : 'text-slate-300'
          )}>
            {success ? description : description}
          </p>
        </div>

        <DialogFooter className="gap-2">
          {!loading && !success && (
            <Button
              variant="outline"
              onClick={handleClose}
              className={cn(
                'border-slate-600 text-slate-300 hover:bg-slate-800'
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
                'flex-1',
                styles.confirmBg,
                'text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]'
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>处理中...</span>
                </div>
              ) : success ? (
                '完成'
              ) : (
                confirmText
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
