import React, { useEffect, useState } from 'react'
import { icons } from '../icons'

type DefaultPopupProps = {
  title?: string,
  classNameBody?: string,
  children?: React.ReactNode;
  opened?: boolean;
  handleClose?: (isOpen: boolean) => void
};
// 
function DefaultPopup({title, classNameBody, opened = false, handleClose, children}: DefaultPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const CloseIcon = icons.close;

  useEffect(() => {
    setIsOpen(opened);
  }, [opened])

  const handleClosePopup = () => {
    setIsOpen(false);
    handleClose!(false);
  }

  return (
    <div className={`fixed overflow-y-auto z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-25 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all`}>
      <div className={`window absolute left-1/2 -translate-x-1/2 ${isOpen ? 'top-24 opacity-100 pointer-events-auto' : '-top-full opacity-0 pointer-events-none'} transition-all`}>
        <div className="window__app-row w-full h-[60px] flex items-center justify-between p-[15px] bg-gray-500 rounded-t-[20px]">
          <div className="window__app-row-title text-gray-50 text-[20px] select-none">
            {title}
          </div>
          <CloseIcon onClick={handleClosePopup} className='text-gray-300 size-[33px] cursor-pointer hover:text-gray-50 active:scale-[0.9] transition-all'/>
        </div>
        <div className={"window__body bg-white rounded-b-[20px] " + classNameBody}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default DefaultPopup