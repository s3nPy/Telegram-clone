import { useMemo, useRef, useState } from "react"

export class Validators {
  static length(options) {
    return value => {
      if(value.length > options.max || value.length < options.min){
        return {
          length: {
            current: value.length,
            min: options.min,
            max: options.max
          }
        }
      }
      return null
    }
  }

  static require() {
    return value => {
      if(!value.trim()){
        return {
          require: false
        }
      }
      return null;
    }
  }
}


export default function useInput(initValue='', validators = []) {
  const [value, setValue] = useState(initValue)
  const [valid, setValid] = useState('')
  const [error, setError] = useState({})
  const ref = useRef()

  const handleValidators = v => {
    if(!validators.length){
      return
    }

    const results = validators
      .map(validator => validator(v))
      .filter( res => res )
    if(results.length) {
      setValid('invalid')
      results.forEach( res => setError(e => ({...e, ...res})))
    } else {
      setValid('valid')
      setError(null)
    }
  }

  const clear = () => {
    setValue('')
    setError({})
    setValid('')
  }

  const isValid = useMemo(() => valid === 'valid', [valid])

  const focus = () => {
    ref.current.focus()
  }

  const changeValue = v => {
    handleValidators(v)
    setValue(v)
  }

  const onBlur = e => {
    handleValidators(e.target.value)
  }

  const onChange = e => {
    handleValidators(e.target.value)
    setValue(e.target.value)
  }

  return {
    bind: {value, onChange, valid, onBlur, ref},
    value, changeValue, isValid, error, clear, focus
  }
}