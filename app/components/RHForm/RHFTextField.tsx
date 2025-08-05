import {FormField, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {cn} from '@/lib/utils'
import type {InputHTMLAttributes, ReactNode, WheelEvent} from 'react'
import {useFormContext} from 'react-hook-form'

interface RHFTextFieldProps extends InputHTMLAttributes<HTMLDivElement> {
  name: string
  required?: boolean
  label?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  variant?: 'default' | 'colored' | 'highlighted'
}

export default function RHFTextField({
  name,
  required,
  label,
  className,
  startIcon,
  endIcon,
  variant = 'default',
  ...other
}: RHFTextFieldProps) {
  const {control} = useFormContext()

  const getVariantStyles = () => {
    switch (variant) {
      case 'colored':
        return 'bg-gray-200 text-black placeholder:text-black'
      case 'highlighted':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 placeholder:text-yellow-400'
      default:
        return 'bg-white border-gray-200 text-gray-700 placeholder:text-gray-400 disabled:bg-gray-200'
    }
  }

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (other.type === 'number') {
      e.target instanceof HTMLElement && e.target.blur()
    }
  }

  return (
    <FormField
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => (
        <div className="space-y-2">
          {label && (
            <FormLabel
              className={cn(
                required &&
                  "after:content-['*'] after:ml-0.5 after:text-red-500",
                'truncate',
              )}
            >
              {label}
            </FormLabel>
          )}
          <div className="relative">
            {startIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {startIcon}
              </div>
            )}
            <Input
              {...field}
              {...other}
              id={name}
              ref={field.ref}
              autoComplete="off"
              onWheel={handleWheel}
              className={cn(
                getVariantStyles(),
                error && 'border-destructive',
                startIcon && 'pl-10',
                endIcon && 'pr-10',
                other.type === 'number' &&
                  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                className,
              )}
            />
            {endIcon && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                {endIcon}
              </div>
            )}
          </div>
          {error?.message && <FormMessage>{error.message}</FormMessage>}
        </div>
      )}
    />
  )
}
