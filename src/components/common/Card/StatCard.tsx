import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import Card from './Card';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  onClick?: () => void;
  className?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  onClick,
  className = '',
}: StatCardProps) {
  return (
    <Card onClick={onClick} className={`cursor-pointer ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-lg mr-4">{icon}</div>
          <div className="flex flex-col">
            <p className="text-white text-lg font-semibold">{value}</p>
            <p className="text-text-muted text-sm">{label}</p>
          </div>
        </div>
        <FiChevronRight className="text-text-muted text-lg" />
      </div>
    </Card>
  );
}
