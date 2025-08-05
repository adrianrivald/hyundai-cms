import type {FC} from 'react'

interface DividerProps {
  className?: string
}

const Divider: FC<DividerProps> = ({className = ''}) => {
  return (
    <div
      className={`flex items-center gap-2 ${className} w-full bg-gray-300 h-[1px]`}
    />
  )
}

export default Divider
