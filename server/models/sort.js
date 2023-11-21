function mergeRequest(leftArr, rightArr) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < leftArr.length && rightIndex < rightArr.length) {
    if (leftArr[leftIndex].value > rightArr[rightIndex].value) {
      result.push(leftArr[leftIndex]);
      leftIndex++;
    } else {
      result.push(rightArr[rightIndex]);
      rightIndex++;
    }
  }
  return result.concat(leftArr.slice(leftIndex)).concat(rightArr.slice(rightIndex));
}

export function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  }

  const { length } = arr;
  const middle = Math.floor(length / 2);
  const leftArr = arr.slice(0, middle);
  const rightArr = arr.slice(middle);
  return mergeRequest(mergeSort(leftArr), mergeSort(rightArr));
}

export default mergeSort;
