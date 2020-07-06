/* eslint-disable consistent-return */
import _ from 'lodash';
import getFiles from './parsers/parsing.js';
import form from './stylish.js';

// eslint-disable-next-line consistent-return

const difference = (object1, object2) => {
  const keysOfFirst = _.keys(object1).sort();
  const keysOfSecond = _.keys(object2).sort();
  const keys = _.union(keysOfFirst, keysOfSecond).sort();
  // eslint-disable-next-line array-callback-return
  const diff = keys.flatMap((key) => {
    const first = object1[key];
    const second = object2[key];
    if (_.has(object1, key) && _.has(object2, key)) {
      if (typeof (first) === 'object' && typeof (second) === 'object') {
        return { name: key, value: difference(first, second), transformation: 'deepChange' };
      }
      if (first === second) {
        return { name: key, value: first, transformation: 'unchanged' };
      }
      if (first !== second) {
        return {
          name: key, firstValue: first, secondValue: second, transformation: 'changed',
        };
      }
    }
    if (first === undefined) {
      return { name: key, value: second, transformation: 'added' };
    }
    if (second === undefined) {
      return { name: key, value: first, transformation: 'deleted' };
    }
  });
  return diff;
};

export default (path1, path2, formatter = 'stylish') => {
  const [firstObj, secondObj] = getFiles(path1, path2);
  const transition = difference(firstObj, secondObj);

  return form(transition);
};
