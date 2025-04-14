
import React from 'react';
import Header from './Header';
import BottomNavbar from './BottomNavbar';
import { cn } from '@/lib/utils';

const PageLayout = ({
  title,
  showBack = false,
  children,
  className,
  hideBottomNav = false
}) => {
  return (
    <div className="page-container pb-20 animate-fade-in">
      {title && <Header title={title} showBack={showBack} />}
      <div className={cn("pt-2", className)}>
        {children}
      </div>
      {!hideBottomNav && <BottomNavbar />}
    </div>
  );
};

export default PageLayout;
