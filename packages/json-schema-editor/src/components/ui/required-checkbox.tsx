"use client"
 
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { RequiredIcon } from './required-icon'
 
import { cn } from "../../utils"
 
const RequiredCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className,checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    checked={checked}
    className={cn(
      "h-4 w-4 shrink-0",
      className
    )}
    {...props}
  >
    <RequiredIcon className={cn("h-4 w-4 fill-gray-700", checked && "fill-pink-600")} />
  </CheckboxPrimitive.Root>
))
RequiredCheckbox.displayName = CheckboxPrimitive.Root.displayName
 
export { RequiredCheckbox }
