import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  className = "",
  titleClassName = "text-3xl font-light text-white mb-2",
  subtitleClassName = "text-gray-300"
}) => {
  return (
    <div className={`flex-1 ${className}`}>
      <h1 className={titleClassName}>
        {title}
      </h1>
      {subtitle && (
        <p className={subtitleClassName}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader;