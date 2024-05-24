import React from 'react'
import { Separator } from './ui/separator'
import { PlusCircleIcon } from '@asyncapi/studio-ui/icons'
function AddProperty() {
  return (
    <button className='flex items-center gap-1 cursor-pointer select-none'>
      <Separator className="w-4" />
      <PlusCircleIcon className="w-4 h-4 ml-1 text-gray-600" />
      <div className='text-gray-600 text-xs leading-3'>Add property</div>
    </button>
  )
}

export default AddProperty
