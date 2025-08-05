import {FormControl, FormField, FormItem, FormLabel} from '@/components/ui/form'
import {Switch} from '@/components/ui/switch'
import {cn} from '@/lib/utils'
import type {ReactNode} from 'react'
import {useFormContext} from 'react-hook-form'

interface Props {
  name: string
  label?: ReactNode
  className?: string
  disabled?: boolean
  onChange?: (checked: boolean) => void
}

export default function RHFSwitch({
  name,
  label,
  className,
  disabled,
  onChange,
  ...other
}: Props) {
  const {control} = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem className={cn('flex flex-row items-center gap-2', className)}>
          {label && (
            <FormLabel className="!mt-0 cursor-pointer">{label}</FormLabel>
          )}
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={(checked: boolean) => {
                if (onChange) {
                  onChange(checked)
                }
                field.onChange(checked)
              }}
              disabled={disabled}
              {...other}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
