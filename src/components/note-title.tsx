"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface NoteTitleProps {
  title: string
  onUpdate: (title: string) => void
  placeholder?: string
  className?: string
}

export function NoteTitle({ 
  title, 
  onUpdate, 
  placeholder = "Untitled", 
  className 
}: NoteTitleProps) {
  const [value, setValue] = useState(title)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setValue(title)
  }, [title])

  const handleBlur = () => {
    setIsEditing(false)
    if (value.trim() !== title) {
      onUpdate(value.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.currentTarget as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      setValue(title)
      setIsEditing(false)
    }
  }

  const handleFocus = () => {
    setIsEditing(true)
  }

  return (
    <div className="mb-6">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={cn(
          "text-3xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto",
          "bg-transparent hover:bg-muted/50 rounded-md transition-colors",
          "placeholder:text-muted-foreground/60",
          isEditing && "bg-muted/50",
          className
        )}
      />
    </div>
  )
}
