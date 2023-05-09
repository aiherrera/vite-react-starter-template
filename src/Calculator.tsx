import { useEffect, useRef } from 'react'
import { useSignal } from '@preact/signals-react'
import { evaluate } from 'mathjs'

import {
  FaPlus,
  FaMinus,
  FaDivide,
  FaTimes,
  FaEquals,
  FaPercent,
  FaBackspace,
  FaSquareRootAlt,
} from 'react-icons/fa'

const CALCULATOR_TEMPLATE = [
  'C',
  '√',
  '%',
  '/',
  '7',
  '8',
  '9',
  '*',
  '4',
  '5',
  '6',
  '-',
  '1',
  '2',
  '3',
  '+',
  '+/-',
  '0',
  '.',
  '=',
]

const Calculator = () => {
  const displayOperation = useSignal('')
  const displayResult = useSignal(0.0)
  const ongoingOperation = useSignal({ name: '', value: '', complete: '' })

  const inputRef = useRef<HTMLInputElement>(null)

  const getButtonContent = (action: string) => {
    switch (action) {
      case '<-':
        return <FaBackspace className="mx-auto" />
      case '%':
        return <FaPercent className="mx-auto" />
      case '/':
        return <FaDivide className="mx-auto" />
      case '*':
        return <FaTimes className="mx-auto" />
      case '-':
        return <FaMinus className="mx-auto" />
      case '+':
        return <FaPlus className="mx-auto" />
      case '=':
        return <FaEquals className="mx-auto" />
      case '√':
        return <FaSquareRootAlt className="mx-auto" />
      default:
        return action
    }
  }

  const getStyles = (action: string) => {
    switch (action) {
      case 'C':
        return 'text-red-600'

      case '/':
      case '*':
      case '-':
      case '+':
      case '%':
      case '√':
        return 'text-green-400'

      case '=':
        return 'bg-green-600 text-slate-100'

      default:
        return 'text-white'
    }
  }

  const clearOngoingOperation = () => {
    ongoingOperation.value.name = ''
    ongoingOperation.value.value = ''
    ongoingOperation.value.complete = ''
  }

  const handleClick = (action: string) => {
    switch (action) {
      case 'C':
        displayOperation.value = ''
        displayResult.value = 0
        break

      case '<-':
        displayOperation.value = displayOperation.value.slice(0, -1)
        handleCalculate()
        break

      case '+/-':
        displayOperation.value = (parseFloat(displayOperation.value) * -1).toString()
        handleCalculate()
        break

      case '=':
        displayOperation.value = displayResult.value.toString()
        displayResult.value = 0
        console.log(displayResult.value)
        break

      case '√':
        displayOperation.value += 'sqrt('
        ongoingOperation.value = { name: 'square-root', value: 'sqrt(', complete: ')' }
        break

      default:
        const lastIndex = displayOperation.value.lastIndexOf('%')
        if (lastIndex !== -1 && lastIndex === displayOperation.value.length - 1) {
          displayOperation.value = `${displayOperation.value.substring(0, lastIndex + 1)}*`
        }

        displayOperation.value += action

        if (ongoingOperation.value.name) {
          displayOperation.value += ongoingOperation.value.complete
          clearOngoingOperation()
        }

        removeDuplicatedOperators(displayOperation.value)

        handleCalculate()
        break
    }
  }

  /**
   * Checks and removes two consecutive operators in an expression
   * @param str expression to analyze
   *
   * @example 9*5-+ is normalized into 9*5-
   */
  const removeDuplicatedOperators = (str: string): void => {
    const operators = /[+\-*\/][+\-*\/]+$/g
    const matches = str.match(operators) || []
    if (matches.length > 0) {
      displayOperation.value = displayOperation.value.slice(0, -1)
    }
  }

  /**
   * Evaluates the expression and allows up to 10 decimal positions
   */
  const handleCalculate = (): any => {
    try {
      displayResult.value = evaluate(displayOperation.value)
    } catch (error) {
      console.log('Error')
      displayResult.value = 0
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef?.current?.focus()
    }
  }, [])

  return (
    <div className="flex max-w-[320px] flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold">Calculator</h1>

      <div className="text- bg-gree rounded-lg bg-slate-900 p-4">
        <input
          type="text"
          className="mb-4 flex w-full rounded-lg border-none bg-transparent px-4 py-2 text-right text-3xl caret-slate-200 focus:border-transparent focus:outline-none"
          value={displayOperation.value}
          ref={inputRef}
        />

        <div className="flex h-24 items-center justify-end pr-3 text-xl text-slate-500">
          {displayResult}
        </div>

        <div className="flex justify-between px-6">
          <div></div>
          <div>
            <button onClick={() => handleClick('<-')}>
              <FaBackspace className="text-xl text-green-600" />
            </button>
          </div>
        </div>

        <div className="my-6 h-[0.2px] w-full bg-slate-500"></div>

        <div className="grid grid-cols-4 items-center justify-items-center gap-2">
          {CALCULATOR_TEMPLATE.map((action) => {
            return (
              <button
                key={action}
                onClick={() => handleClick(action)}
                className={`${getStyles(action)} h-16 w-16 rounded-full bg-slate-800 text-xl`}
              >
                {getButtonContent(action)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Calculator
