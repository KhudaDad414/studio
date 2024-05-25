import React from 'react'
import { Separator } from './ui/separator'
import { PlusCircleIcon } from '@asyncapi/studio-ui/icons'

interface AddPropertyProps {
  onClick?: () => void
}
function AddProperty({onClick}: AddPropertyProps) {
  return (
    <button className='flex items-center gap-1 cursor-pointer select-none' onClick={onClick}>
      <Separator className="w-4" />
      <PlusCircleIcon className="w-4 h-4 ml-1 text-gray-600" />
      <div className='text-gray-600 text-xs leading-3'>Add property</div>
    </button>
  )
}

export default AddProperty
