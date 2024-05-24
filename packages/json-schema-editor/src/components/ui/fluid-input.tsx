import * as React from "react"
 
import { cn } from "../../utils"
import { useState } from 'react';
 
export interface FluidInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
 
const FluidInput = React.forwardRef<HTMLInputElement, FluidInputProps>(
  ({ className, type, onInput, value, ...props }, ref) => {
    const [inputWidth, setInputWidth] = useState(`${typeof value === "string" ? value.length : ""}ch`);

    const fluidInputHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      setInputWidth(`${e.target.value.length}ch`);
      onInput?.(e);
    };

    return (
      <input
        onInput={fluidInputHandler}
        value={value}
        type={type}
        className={cn(
          "bg-transparent outline-none font-mono",
          className
        )}
        style={{ width: inputWidth }}
        ref={ref}
        {...props}
      />
    )
  }
)
FluidInput.displayName = "FluidInput"
 
export { FluidInput }
