import React from 'react'
import * as Switch from '@radix-ui/react-switch'
import { EyeIcon, CodeBracketIcon } from '../components/icons'
import classNames from 'classnames'

// Define styles as constants outside the component to avoid recreating these during each render
const transitionStyle = 'transition duration-200 ease-in-out'
const switchClass = 'relative bg-gray-800 flex h-[35px] w-[62px] cursor-pointer rounded'
const switchSpanClass =
  'pointer-events-none absolute h-[25px] inline-block w-[25px] transform rounded bg-primary transition duration-200 ease-in-out'
const switchIconsClass = 'flex flex-grow justify-between content-center z-10 m-[4px]'

export interface EditorSwitchProps {
  isCodeEditor?: boolean
  onSwitchChange?: (value: boolean) => void
}

export const EditorSwitch: React.FC<EditorSwitchProps> = ({ isCodeEditor = true, onSwitchChange }) => {
  const visualIconStyle = classNames(transitionStyle, isCodeEditor ? 'stroke-gray-400' : 'stroke-white')
  const codeIconStyle = classNames(transitionStyle, isCodeEditor ? 'stroke-white' : 'stroke-gray-400')
  const spanClass = classNames(switchSpanClass, isCodeEditor ? 'translate-x-7' : 'translate-x-0')

  return (
    <Switch.Root checked={isCodeEditor} onCheckedChange={onSwitchChange} className={switchClass} id='editor-switch'>
      <div className='absolute inset-[5px] flex flex-grow'>
        <div className={switchIconsClass}>
          <EyeIcon className={visualIconStyle} />
          <CodeBracketIcon className={codeIconStyle} />
        </div>
        <Switch.Thumb aria-hidden='true' className={spanClass} />
      </div>
    </Switch.Root>
  )
}
