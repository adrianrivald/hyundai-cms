import {Button} from '@/components/ui/button'
import {Calendar} from '@/components/ui/calendar'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {cn} from '@/lib/utils'
import {format} from 'date-fns'
import {CalendarIcon} from 'lucide-react'
import type {DateRange} from 'react-day-picker'
import {useFormContext} from 'react-hook-form'

interface Props {
  name: string
  label?: string
  className?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  format?: string
  onChange?: (date: DateRange | undefined) => void
}

export default function RHFDateRangePicker({
  name,
  label,
  className,
  disabled,
  required,
  placeholder = 'Pick a date range',
  format: dateFormat = 'dd/MM/yyyy',
  onChange,
}: Props) {
  const {control} = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem className={className}>
          {label && (
            <FormLabel
              className={cn(
                required &&
                  "after:content-['*'] after:ml-0.5 after:text-red-500",
              )}
            >
              {label}
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                  disabled={disabled}
                >
                  {field.value?.from ? (
                    field.value.to ? (
                      <>
                        {format(field.value.from, dateFormat)} -{' '}
                        {format(field.value.to, dateFormat)}
                      </>
                    ) : (
                      format(field.value.from, dateFormat)
                    )
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className=" p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={field.value?.from}
                selected={field.value}
                onSelect={date => {
                  field.onChange(date)
                  if (onChange) {
                    onChange(date)
                  }
                }}
                numberOfMonths={1}
                disabled={disabled}
                className="w-full rounded-none"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
