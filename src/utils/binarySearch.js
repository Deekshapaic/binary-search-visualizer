/**
 * Search in array using Binary Search Algorithm
 * @param {Array} arr => Array to search in.
 * @param {Number} sn => Number to be search.
 * @param {Boolean} isSorted => Flag to check if array is sorted or not.
 */
export const binarySearch = (arr, sn, isSorted) => {
  const meta = [];
  let it = 1;
  let lowerBound = 0;
  let upperBound = arr.length - 1;

  while (lowerBound <= upperBound) {
    let mid = Math.floor((lowerBound + upperBound) / 2);
    meta.push({ lowerBound, upperBound, mid, iteration: it++ });
    if (arr[mid] === sn) return [mid, meta];
    if (sn > arr[mid]) lowerBound = mid + 1;
    else upperBound = mid - 1;
  }

  return [-1, meta];
};

export const recursiveBinarySearch = (arr, sn, lowerBound = 0, upperBound = arr.length - 1, meta = [], iteration = 1) => {
  if (lowerBound > upperBound) {
    return [-1, meta];
  }

  const mid = Math.floor((lowerBound + upperBound) / 2);
  meta.push({ lowerBound, upperBound, mid, iteration });

  if (arr[mid] === sn) {
    return [mid, meta];
  }

  if (sn > arr[mid]) {
    return recursiveBinarySearch(arr, sn, mid + 1, upperBound, meta, iteration + 1);
  }

  return recursiveBinarySearch(arr, sn, lowerBound, mid - 1, meta, iteration + 1);
};

export const linearSearch = (arr, sn) => {
  const meta = [];

  for (let index = 0; index < arr.length; index += 1) {
    meta.push({ index, value: arr[index], iteration: index + 1 });
    if (arr[index] === sn) {
      return [index, meta];
    }
  }

  return [-1, meta];
};
