"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface InlineTitleEditProps {
  title: string
  onSave: (newTitle: string) => void
  onCancel?: () => void
  placeholder?: string
  className?: string
}

export function InlineTitleEdit({ 
  title, 
  onSave, 
  onCancel, 
  placeholder = "Sem título",
  className = ""
}: InlineTitleEditProps) {
  const [value, setValue] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(title === "Sem título" ? "" : title)
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [title])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleSave = () => {
    const trimmedValue = value.trim()
    if (trimmedValue === "") {
      onSave("Sem título")
    } else if (trimmedValue !== title) {
      onSave(trimmedValue)
    } else {
      onCancel?.()
    }
  }

  const handleCancel = () => {
    setValue(title)
    onCancel?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancel()
    }
  }

  return (
    <div className={`flex items-center gap-2 w-full ${className}`}>
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="text-sm font-medium flex-1"
      />
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
