import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

export interface DynamicIconProps extends LucideProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className = '', ...props }: DynamicIconProps) {
  const IconComponent = ((LucideIcons as any)[name] || LucideIcons.LayoutGrid) as React.FC<LucideProps>;
  return <IconComponent className={className} {...props} />;
}

