import React from 'react'

type TypeHighlighterProps = {
  type: string
}


export const TypeHighlighter: React.FC<TypeHighlighterProps> = ({ type }) => {
  const typeColors = {
    string: 'text-yellow-500',
    number: 'text-cyan-500',
    integer: 'text-cyan-500',
    boolean: 'text-green-500',
    object: 'text-purple-500',
    array: 'text-orange-500',
    dictionary: 'text-orange-500',
    "<": 'text-orange-500',
    ">": 'text-orange-500',
    null: 'text-red-700',
    or: 'text-gray-400',
    and: 'text-gray-400',
    anyOf: 'text-blue-500',
    oneOf: 'text-fuchsia-500',
    allOf: 'text-indigo-500',
  }
  
  return (
    <p className='whitespace-nowrap hover:underline cursor-pointer text-xs leading-3 decoration-gray-500 decoration-dashed'>
      {type.split(/(\s|<|>)/).map((word, index) => {
        const color = typeColors[word] || 'text-gray-300'
        return <span key={index} className={`${color}`}>{word}</span>
      })}
    </p>
  )
}
