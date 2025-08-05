import {Button} from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {FormField, FormLabel, FormMessage} from '@/components/ui/form'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {cn} from '@/lib/utils'
import {Check, ChevronsUpDown, Loader2, X} from 'lucide-react'
import {useEffect, useMemo, useState} from 'react'
import {useFormContext} from 'react-hook-form'

interface RHFAutocompleteProps<T> {
  name: string
  label?: string
  required?: boolean
  options: T[]
  placeholder?: string
  className?: string
  getOptionLabel: (option: T) => string
  getOptionValue: (option: T) => string
  onChange?: (selectedOption: T | undefined) => void
  onScrollEnd?: () => void
  onSearch?: (searchText: string) => void
  loading?: boolean
  freeSolo?: boolean
  multiple?: boolean
  disableClearable?: boolean
  disabled?: boolean
  onClearable?: () => void
}

export default function RHFAutocomplete<T>({
  name,
  label,
  required,
  options,
  placeholder = 'Select an option',
  className,
  getOptionLabel,
  getOptionValue,
  onChange,
  onScrollEnd,
  onSearch,
  loading = false,
  freeSolo = false,
  multiple = false,
  disableClearable = false,
  disabled = false,
  onClearable,
}: RHFAutocompleteProps<T>) {
  const {control} = useFormContext()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (onSearch) {
        onSearch(search)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [search, onSearch])

  const filteredOptions = useMemo(() => {
    if (onSearch) {
      return options
    }
    return options.filter(option =>
      getOptionLabel(option).toLowerCase().includes(search.toLowerCase()),
    )
  }, [search, options, getOptionLabel, onSearch])

  const getSelectedLabel = (value: string) => {
    const selected = options.find(opt => getOptionValue(opt) === value)
    return selected ? getOptionLabel(selected) : freeSolo ? value : ''
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
              )}
            >
              {label}
            </FormLabel>
          )}

          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <Button
                disabled={disabled}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  'w-full justify-between relative font-normal',
                  !field.value && 'text-muted-foreground',
                  error && 'border-destructive',
                  className,
                )}
              >
                <span className="truncate">
                  {field.value ? getSelectedLabel(field.value) : placeholder}
                </span>
                <div className="flex gap-2 items-center">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {(field.value || search) && !disableClearable && (
                    <div
                      role="button"
                      tabIndex={0}
                      className="relative z-10"
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        field.onChange('')
                        setSearch('')
                        onChange?.(undefined)
                        setOpen(false)
                        onClearable?.()
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          field.onChange('')
                          setSearch('')
                          onChange?.(undefined)
                          setOpen(false)
                        }
                      }}
                    >
                      <X className="h-4 w-4 opacity-50 hover:opacity-100 shrink-0 cursor-pointer" />
                    </div>
                  )}
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0 "
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search..."
                  value={search}
                  onValueChange={setSearch}
                />
                <CommandList
                  className=" max-h-[200px] overflow-auto"
                  onScroll={e => {
                    const target = e.currentTarget
                    const scrollPosition =
                      target.scrollTop + target.clientHeight
                    const scrollThreshold = target.scrollHeight - 50 // Adjust threshold

                    if (
                      scrollPosition >= scrollThreshold &&
                      onScrollEnd &&
                      !loading
                    ) {
                      onScrollEnd()
                    }
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <CommandEmpty>No options found.</CommandEmpty>
                  )}

                  <CommandGroup>
                    {filteredOptions.map(option => {
                      const value = getOptionValue(option)
                      const label = getOptionLabel(option)
                      return (
                        <CommandItem
                          key={value}
                          value={value}
                          onSelect={currentValue => {
                            field.onChange(currentValue)
                            const selectedOption = options.find(
                              opt => getOptionValue(opt) === currentValue,
                            )
                            onChange?.(selectedOption)
                            if (!multiple) {
                              setOpen(false)
                            }
                            setSearch('')
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {label}
                        </CommandItem>
                      )
                    })}
                    {freeSolo &&
                      search &&
                      !filteredOptions.length &&
                      !loading && (
                        <CommandItem
                          value={search}
                          // onSelect={(value) => {
                          //   field.onChange(value);
                          //   setOpen(false);
                          //   setSearch('');
                          // }}
                        >
                          No Options Found
                        </CommandItem>
                      )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {error?.message && <FormMessage>{error.message}</FormMessage>}
        </div>
      )}
    />
  )
}
