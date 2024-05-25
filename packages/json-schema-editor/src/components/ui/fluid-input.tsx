import * as React from "react"
 
import { cn } from "../../utils"
import { useState } from 'react';
 
export interface FluidInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
 
const FluidInput = React.forwardRef<HTMLInputElement, FluidInputProps>(
  ({ className, type, onInput, value, ...props }, ref) => {
    const width = `${typeof value === "string" && value.length > 0 ? value.length : 4}ch`

    return (
      <input
        onInput={onInput}
        value={value}
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
