import * as React from "react"
 
import { cn } from "../../utils"
import { useState } from 'react';
import { useDebounce } from '../SchemaRow/useDebounce';
import { set } from 'lodash';
 
export interface FluidInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string
    onValueChange: (value: string) => void
  }
 
const FluidInput = React.forwardRef<HTMLInputElement, FluidInputProps>(
  ({ className, type, onValueChange, value, ...props }, ref) => {
    const [width, setWidth] = useState(`${typeof value === "string" && value.length > 0 ? value.length : 4}ch`)
    const [inputValue, setInputValue] = useState(value)
    const debouncedValue = useDebounce(inputValue)

    React.useEffect(() => {
      onValueChange(debouncedValue)
    }, [debouncedValue])

    const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
      const currentValue = event.currentTarget.value
      const currentValueLength = currentValue.length
      setInputValue(currentValue)
      setWidth(`${currentValueLength > 0 ? currentValueLength : 4}ch`)
    }

    return (
      <input
        onInput={handleInput}
        value={inputValue}
        type={type}
        className={cn(
          "bg-transparent outline-none font-mono",
          className
        )}
        style={{ width }}
        ref={ref}
        {...props}
      />
    )
  }
)
FluidInput.displayName = "FluidInput"
 
export { FluidInput }
