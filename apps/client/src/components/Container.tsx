import React from 'react'

type ContainerProps = {
  className?: string,
  children?: React.ReactNode;
};

function Container({className = '', children}: ContainerProps) {
  return (
    <div className={'container mx-auto max-w-[1380px] px-[15px] ' + className}>
      {children}
    </div>
  )
}

export default Container