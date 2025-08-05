import {ChevronLeft, ChevronRight, MoreHorizontal} from 'lucide-react'
import * as React from 'react'

import {cn} from '@/lib/utils'
import {Button, type ButtonProps} from './button'

const Pagination = ({className, ...props}: React.ComponentProps<'div'>) => (
  <div
    aria-label="pagination"
    className={cn('mx-auto flex justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({className, ...props}, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({className, ...props}, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationNumberProps = {
  isActive?: boolean
} & ButtonProps

const PaginationNumber = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationNumberProps) => (
  <Button
    aria-current={isActive ? 'page' : undefined}
    variant={isActive ? 'default' : 'outline'}
    size={size}
    className={cn(className)}
    {...props}
  />
)
PaginationNumber.displayName = 'PaginationNumber'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationNumber>) => (
  <PaginationNumber
    aria-label="Go to previous page"
    className={cn('gap-1', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </PaginationNumber>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationNumber>) => (
  <PaginationNumber
    aria-label="Go to next page"
    className={cn('gap-1', className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </PaginationNumber>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationNumber,
  PaginationPrevious,
}
