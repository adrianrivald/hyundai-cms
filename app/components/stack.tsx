import {cn} from '@/lib/utils'
import React from 'react'

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  spacing?: number
  alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline'
  justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  divider?: React.ReactNode
  wrap?: boolean
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      direction = 'column',
      spacing = 2,
      alignItems,
      justifyContent,
      className,
      divider,
      wrap = false,
      ...props
    },
    ref,
  ) => {
    const gapValue =
      {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        8: '8',
        10: '10',
        12: '12',
        16: '16',
      }[spacing] || spacing

    const stackClasses = cn(
      'flex',
      {
        'flex-row': direction === 'row',
        'flex-row-reverse': direction === 'row-reverse',
        'flex-col': direction === 'column',
        'flex-col-reverse': direction === 'column-reverse',
        'flex-wrap': wrap,
        [`gap-${gapValue}`]: gapValue,
        [`items-${alignItems}`]: alignItems,
        [`justify-${justifyContent}`]: justifyContent,
      },
      className,
    )

    if (divider) {
      const items = React.Children.toArray(children)
      return (
        <div ref={ref} className={stackClasses} {...props}>
          {items.map((child, index) => (
            <React.Fragment key={index}>
              {child}
              {index < items.length - 1 && divider}
            </React.Fragment>
          ))}
        </div>
      )
    }

    return (
      <div ref={ref} className={stackClasses} {...props}>
        {children}
      </div>
    )
  },
)

Stack.displayName = 'Stack'
