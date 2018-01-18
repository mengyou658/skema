import make_array from 'make-array'
import {error} from './error'
import symbol from 'symbol-for'

export const TYPE_SKEMA = symbol.for('skema')
export function isSkema (subject): boolean {
  return !!subject && subject[TYPE_SKEMA] === true
}

export function isString (subject): boolean {
  return typeof subject === 'string'
}

export function isFunction (subject): boolean {
  return typeof subject === 'function'
}

export function isRegExp (subject): boolean {
  return !!subject && typeof subject.test === 'function'
}

export function isObject (subject): boolean {
  return subject && Object(subject) === subject
}

export const isArray = Array.isArray

export function defineProperty (object, key, value, rules = {}) {
  rules.value = value
  Object.defineProperty(object, key, rules)
}

export function defineValue (object, key, value) {
  Object.defineProperty(object, key, {value})
}

export function defineValues (object, values) {
  Object.keys(values).forEach(key => defineValue(object, key, values[key]))
}

const hypenate = key => key[0].toUpperCase() + key.slice(1)
export const getKey = (key, prefix) => prefix + hypenate(key)

export function simpleClone (object) {
  return Object.assign(Object.create(null), object)
}

// See "schema design"
export function parseValidator (validator) {
  if (isFunction(validator)) {
    return validator
  }

  if (isRegExp(validator)) {
    return v => validator.test(v)
  }

  throw error('INVALID_VALIDATOR')
}

export function parseValidators (validators) {
  if (!validators) {
    return
  }
  return make_array(validators).map(parseValidator)
}

export function parseSetters (setters) {
  if (!setters) {
    return
  }

  return make_array(setters).map(setter => {
    if (isFunction(setter)) {
      return setter
    }

    throw error('INVALID_SETTER')
  })
}

export function parseWhen (when) {
  if (isFunction(when)) {
    return when
  }

  if (when === false) {
    return () => false
  }

  // Then true
}

export function parseDefault (_default) {
  if (_default === undefined) {
    return
  }

  if (isFunction(_default)) {
    return _default
  }

  return () => _default
}

export const UNDEFINED = undefined
