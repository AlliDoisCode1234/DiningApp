/**
 *
 * @param {*} error
 * generate an iterator from an error where the first chunk is an "Error" string, and the second chunk is error stack
 */
const generateIteratorFromError = (error) =>
  generateMessageIteratorFromCallbacks(
    () => "Error",
    () => error.stack
  );

/**
 *
 * @param  {...any} parts
 * takes a list of functions, executes that function and returns a chunk as part of an iterator
 */
async function* generateMessageIteratorFromCallbacks(...parts) {
  for (let index = 0; index < parts.length; index++) {
    if (index !== parts.length - 1) {
      yield parts[index]() + " ";
    } else {
      yield parts[index]();
    }
  }
}

export default {
  generateIteratorFromError,
  generateMessageIteratorFromCallbacks,
};
