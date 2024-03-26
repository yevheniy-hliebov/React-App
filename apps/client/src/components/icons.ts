import React from 'react'
import AddIcon from '../assets/icons/add.svg?react'
import EditIcon from '../assets/icons/edit.svg?react'
import DeleteIcon from '../assets/icons/delete.svg?react'
import MoreVertIcon from '../assets/icons/more_vert.svg?react'
import CycleIcon from '../assets/icons/cycle.svg?react'
import CalendarIcon from '../assets/icons/calendar.svg?react'
import SellIcon from '../assets/icons/sell.svg?react'
import ReloadIcon from '../assets/icons/reload.svg?react'
import ArrowDownIcon from '../assets/icons/arrow_down.svg?react'
import CloseIcon from '../assets/icons/close.svg?react'
import EastIcon from '../assets/icons/east.svg?react'

export type IconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

export const icons: Record<string, IconType> = {
  add: AddIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  more_vert: MoreVertIcon,
  cycle: CycleIcon,
  calendar: CalendarIcon,
  sell: SellIcon,
  reload: ReloadIcon,
  arrow_down: ArrowDownIcon,
  close: CloseIcon,
  east: EastIcon,
}
