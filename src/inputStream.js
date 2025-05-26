export function inputStream(input) {
  let pos = 0, line = 1, col = 0;
  return {
    next: next,
    peek: peek,
    comment_peek: comment_peek,
    eof:  eof,
    die:  die,
  }
  function next() {
    var ch = input.charAt(pos++);
    if (ch == "\n") line++, col = 0; else col++;
    return ch;
  }
  function peek() {
    return input.charAt(pos)
  }
  function comment_peek() {
    return input.charAt(pos + 1)
  }
  function eof() {
    return peek() == null
  }
  function die(msg) {
    throw new Error(msg + "(" + line + ":" + col + ")")
  }
}
