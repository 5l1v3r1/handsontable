import { arrayMap, arrayFilter } from '../../helpers/array';
import IndexMap from './indexMap';

/**
 * Map from visual index to physical index.
 */
class VisualIndexMap extends IndexMap {
  constructor(initValueOrFn = index => index) {
    super(initValueOrFn);

    this.list = [];
    this.initValueOrFn = initValueOrFn;
  }

  /**
   * Add values to list and reorganize.
   *
   * @private
   * @param {Number} insertionIndex Position inside actual list.
   * @param {Array} insertedIndexes List of inserted indexes.
   */
  addValueAndReorganize(insertionIndex, insertedIndexes) {
    this.increaseIndexes(insertionIndex, insertedIndexes);
    this.insertIndexes(insertionIndex, insertedIndexes);
  }

  /**
   * Remove values from the list and reorganize.
   *
   * @private
   * @param {Array} removedIndexes List of removed indexes.
   */
  removeValuesAndReorganize(removedIndexes) {
    this.filterIndexes(removedIndexes);
    this.decreaseIndexes(removedIndexes);
  }

  /**
   * Transform list of values after insertion.
   *
   * @private
   * @param {Number} insertionIndex Position inside actual list.
   * @param {Array} insertedIndexes List of inserted indexes.
   */
  increaseIndexes(insertionIndex, insertedIndexes) {
    const firstInsertedIndex = insertedIndexes[0];
    const amountOfIndexes = insertedIndexes.length;

    this.list = arrayMap(this.list, (index) => {
      if (index >= firstInsertedIndex) {
        return index + amountOfIndexes;
      }

      return index;
    });
  }

  /**
   * Insert new indexes to the list.
   *
   * @private
   * @param {Number} insertionIndex Position inside actual list.
   * @param {Array} insertedIndexes List of inserted indexes.
   */
  insertIndexes(insertionIndex, insertedIndexes) {
    this.list = [...this.list.slice(0, insertionIndex), ...insertedIndexes, ...this.list.slice(insertionIndex)];
  }

  /**
   * Filter indexes from the list.
   *
   * @private
   * @param {Array} removedIndexes List of removed indexes.
   */
  filterIndexes(removedIndexes) {
    this.list = arrayFilter(this.list, index => removedIndexes.includes(index) === false);
  }

  /**
   * Transform list of indexes after removal.
   *
   * @private
   * @param {Array} removedIndexes List of removed indexes.
   */
  decreaseIndexes(removedIndexes) {
    this.list = arrayMap(this.list, index => index - removedIndexes.filter(removedRow => removedRow < index).length);
  }
}

export default VisualIndexMap;
