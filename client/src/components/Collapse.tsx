import type { ReactNode } from 'react';

type CollapseProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  defaultOpen?: boolean;
  withArrow?: boolean;
};

function Collapse({
  title,
  children,
  className = '',
  titleClassName = '',
  contentClassName = '',
  defaultOpen = false,
  withArrow = true,
}: CollapseProps) {
  const rootClassName = [
    'collapse',
    withArrow ? 'collapse-arrow' : '',
    'border',
    'border-base-300',
    'bg-base-100',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      <input type="checkbox" defaultChecked={defaultOpen} />
      <div className={['collapse-title', titleClassName].filter(Boolean).join(' ')}>
        {title}
      </div>
      <div className={['collapse-content', contentClassName].filter(Boolean).join(' ')}>
        {children}
      </div>
    </div>
  );
}

export default Collapse;
