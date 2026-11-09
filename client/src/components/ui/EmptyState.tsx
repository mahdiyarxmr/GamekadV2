import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-ui-surface rounded-2xl border-1.5 border-dashed border-ui-border-default my-4">
      <div className="w-16 h-16 rounded-2xl bg-ui-surface-sunken border-1.5 border-ui-border-default flex items-center justify-center text-ui-text-muted mb-4 shadow-hard-xs">
        {icon}
      </div>
      <h3 className="text-title font-bold text-ui-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-body-sm text-ui-text-secondary max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
