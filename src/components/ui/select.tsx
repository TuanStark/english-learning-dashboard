import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            open,
            setOpen,
            value,
            onValueChange,
          })
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    open?: boolean
    setOpen?: (open: boolean) => void
  }
>(({ className, children, open, setOpen, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    onClick={() => setOpen?.(!open)}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <span className="text-muted-foreground">{placeholder}</span>
}

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean
    setOpen?: (open: boolean) => void
    value?: string
    onValueChange?: (value: string) => void
  }
>(({ className, children, open, setOpen, value, onValueChange, ...props }, ref) => {
  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen?.(false)} />
      <div
        ref={ref}
        className={cn(
          "absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "top-full mt-1",
          className
        )}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onValueChange,
              setOpen,
              currentValue: value,
            })
          }
          return child
        })}
      </div>
    </>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SelectItemProps & {
    onValueChange?: (value: string) => void
    setOpen?: (open: boolean) => void
    currentValue?: string
  }
>(({ className, children, value, onValueChange, setOpen, currentValue, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      currentValue === value && "bg-accent text-accent-foreground",
      className
    )}
    onClick={() => {
      onValueChange?.(value)
      setOpen?.(false)
    }}
    {...props}
  >
    {children}
  </div>
))
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}
