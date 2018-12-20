import {
  flatten,
  toFlatEntries,
  toFlatObject,
  toPath,
  fromPath,
  arraysEqual,
} from 'sling-helpers';

import { FORM } from './constant.js';

const INITIAL_FIELD_STATE = {
  error: null,
  isValidating: false,
  validation: null,
  validatedOnceOrMore: false,
  value: '',
  touched: false,
};

const INITIAL_STATE = {
  [FORM]: {
    error: null,
    isValidating: false,
    validation: null,
    validatedOnceOrMore: false,
  },
};

const ADD_FIELD = Symbol('ADD_FIELD');
const REMOVE_FIELDS = Symbol('REMOVE_FIELDS');
const UPDATE_FIELD_VALUE = Symbol('UPDATE_FIELD_VALUE');
const UPDATE_FIELD_TOUCHED = Symbol('UPDATE_FIELD_TOUCHED');
const RESET_FIELDS = Symbol('RESET_FIELDS');
const SET_VALUES = Symbol('SET_VALUES');
const START_VALIDATION = Symbol('START_VALIDATION');
const FINISH_VALIDATION = Symbol('FINISH_VALIDATION');

export const addField = fieldId => ({
  type: ADD_FIELD,
  fieldId,
});

export const removeFields = fieldPrefix => ({
  type: REMOVE_FIELDS,
  fieldPrefix,
});

export const updateFieldValue = (fieldId, value) => ({
  type: UPDATE_FIELD_VALUE,
  fieldId,
  value,
});

export const updateFieldTouched = (fieldId, touched) => ({
  type: UPDATE_FIELD_TOUCHED,
  fieldId,
  touched,
});

export const resetFields = () => ({
  type: RESET_FIELDS,
});

export const setValues = values => ({
  type: SET_VALUES,
  values,
});

export const startValidation = (fieldId, validation) => ({
  type: START_VALIDATION,
  fieldId,
  validation,
});

export const finishValidation = (fieldId, error) => ({
  type: FINISH_VALIDATION,
  fieldId,
  error,
});

const updatePropWithCondition = (state, action) => (obj, condition = true) => {
  const { fieldId } = action;
  const field = state[fieldId];

  return (condition)
    ? { ...state, [fieldId]: { ...field, ...obj } }
    : state;
};

const parseRemoveFields = (state, fieldPrefix) => Object
  .entries(state)
  .filter(([fieldId]) => {
    const baseKeys = toPath(fieldPrefix);
    const keys = toPath(fieldId).slice(0, baseKeys.length);
    return !arraysEqual(baseKeys, keys);
  })
  .map(([fieldId, value]) => {
    const [lastKey] = toPath(fieldPrefix).slice(-1);

    if (Number(lastKey) === lastKey) {
      const baseKeys = toPath(fieldPrefix).slice(0, -1);
      const keys = toPath(fieldId).slice(0, baseKeys.length);

      if (arraysEqual(baseKeys, keys)) {
        const newKeys = toPath(fieldId);
        const index = newKeys[baseKeys.length];

        if (index > lastKey) {
          newKeys[baseKeys.length] -= 1;
          return [fromPath(newKeys), value];
        }
      }
    }

    return [fieldId, value];
  })
  .reduce(toFlatEntries, {});

const parseUserValues = userValues => Object
  .entries(flatten(userValues))
  .map(([fieldId, value]) => [fieldId, {
    ...INITIAL_FIELD_STATE,
    value,
  }])
  .reduce(toFlatEntries, {});

const resetState = state => Object
  .keys(state)
  .map(key => ({
    [key]: { ...(key === FORM ? INITIAL_STATE[FORM] : INITIAL_FIELD_STATE) },
  }))
  .reduce(toFlatObject, {});

export const byIdReducer = (state = INITIAL_STATE, action = {}) => {
  const updateFieldState = updatePropWithCondition(state, action);

  switch (action.type) {
    case ADD_FIELD:
      return (state[action.fieldId] == null)
        ? { ...state, [action.fieldId]: { ...INITIAL_FIELD_STATE } }
        : state;

    case REMOVE_FIELDS:
      return parseRemoveFields(state, action.fieldPrefix);

    case UPDATE_FIELD_VALUE:
      return updateFieldState(
        { value: action.value },
        state[action.fieldId] != null &&
          state[action.fieldId].value !== action.value,
      );

    case UPDATE_FIELD_TOUCHED:
      return updateFieldState(
        { touched: action.touched },
        state[action.fieldId] != null &&
          state[action.fieldId].touched !== action.touched,
      );

    case RESET_FIELDS:
      return resetState(state);

    case SET_VALUES:
      return {
        [FORM]: state[FORM],
        ...parseUserValues(action.values),
      };

    case START_VALIDATION:
      return updateFieldState({
        isValidating: true,
        validation: action.validation,
      });

    case FINISH_VALIDATION:
      return updateFieldState({
        isValidating: false,
        validation: null,
        validatedOnceOrMore: true,
        error: action.error,
      });

    default:
      return state;
  }
};
