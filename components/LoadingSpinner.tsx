interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'gray' | 'blue';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'purple',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-3'
  };

  const colorClasses = {
    purple: 'border-purple-500',
    gray: 'border-gray-500',
    blue: 'border-blue-500'
  };

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <div
        className={`
          animate-spin 
          rounded-full 
          border-t-transparent
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `}
        role="status"
        aria-label="読み込み中"
      >
        <span className="sr-only">読み込み中...</span>
      </div>
    </div>
  );
}