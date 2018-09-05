export const isString = arg =>
  typeof arg === 'string' || arg instanceof String;

export const isFunction = arg => typeof arg === 'function';

export const isArray = arg => Array.isArray(arg);

export const isPromise = arg => arg != null && isFunction(arg.then);

export const createRangeArray = (start, end = start) =>
  Array.from(Array(1 + (end - start)).keys()).map(item => item + start);

export const isDateRange = (startDate, finalDate) => startDate !== finalDate;

export const toFlatArray = (result, arg) => (Array.isArray(arg)
  ? [...result, ...arg]
  : [...result, arg]);

export const toFlatArrayDeep = (result, arg) => (Array.isArray(arg)
  ? [...result, ...arg.reduce(toFlatArrayDeep, [])]
  : [...result, arg]);

export const toFlatObject = (result, obj) => ({ ...result, ...obj });

export const toFlatEntries = (result, [key, value]) =>
  ({ ...result, [key]: value });

export const pickBy = (obj, fn) => Object.entries(obj)
  .filter(([key, value]) => fn(value, key))
  .reduce(toFlatEntries, {});

export const parsePath = (path = []) => (isString(path)
  ? path
    .replace(/['"\]]/g, '')
    .split(/[.[]/g)
    .filter(item => item !== '')
  : path);

export const get = (target = {}, path) => {
  const keys = parsePath(path);

  return keys.reduce((result, key) =>
    (result != null ? result[key] : result), target);
};

export const set = (target = {}, path, value) => {
  const keys = parsePath(path);
  const [key, ...nextKeys] = keys;

  const nextValue = (nextKeys.length > 0)
    ? set(target[key], nextKeys, value)
    : value;

  return {
    ...target,
    [key]: nextValue,
  };
};

export const groupByDeep = (collection = [], ...iteratees) => {
  const paths = collection.map(value => iteratees
    .map(iteratee => iteratee(value)));

  return paths.reduce((result, path, index) => {
    const currentValue = get(result, path) || [];
    const newValue = currentValue.concat([collection[index]]);

    return { ...result, ...set(result, path, newValue) };
  }, {});
};

export const mapByKey = (collection = [], key, value) =>
  collection.reduce((acc, actual) => {
    acc[actual[key]] = actual[value];
    return acc;
  }, {});
