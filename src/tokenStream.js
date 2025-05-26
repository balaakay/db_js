export function tokenStream(input) {
  let current = null
  const keywords = [
    'select', 'from', 'where', 'create', 'database', 'table', 
    'group by', 'order by', 'delete', 'insert', 'update', 'true', 'false',
  ]
  return {
    next: next,
    peek: peek,
    eof:  eof,
    die:  input.die,
  }
  function read_while(predicate) {
    var str = ""
    while (!input.eof() && predicate(input.peek()))
      str += input.next()
    return str
  }
  function is_keyword(x) {
    console.log("is this a keyword? ", keywords.includes(x))
    return keywords.includes(x)
  }
  function is_digit(ch) {
    return "0123456789".indexOf(ch) >= 0
  }
  function is_id_start(ch) {
    return /[a-z_]/i.test(ch)
  }
  function is_id(ch) {
    return is_id_start(ch) || "!?-<>=0123456789".indexOf(ch) >= 0
  }
  function is_op_char(ch) {
    return "!%^*+-=&<>|".indexOf(ch) >= 0
  }
  function is_punc(ch) {
    return "{}[](),;".indexOf(ch) >= 0
  }
  function is_whitespace(ch) {
    return "\n\t ".indexOf(ch) >= 0
  }
  function read_number() {
    let has_dot = false
    let number = read_while(function(ch) {
      if (ch == ".") {
        if (has_dot) return false
        // is this the right implementation? the above if statement looks impossible to trigger
        has_dot = true
        return true
      }
      return is_digit(ch)
    })
    return { type: "num", value: parseFloat(number) }
  }
  function read_ident() {
    let id = read_while(is_id)
    console.log("reading_ident")
    console.log(id)
    // TODO
    // this isn't actually returning the keyword objects, do further testing
    return {
      type  : is_keyword(id) ? "kw" : "var",
      value : id
    }
  }
  function read_escaped(end) {
    let escaped = false, str = ""
    input.next()
    while (!input.eof()) {
      let ch = input.next()
      if (escaped) {
        str += ch
        escaped = false
      } else if (ch == "\\") {
        escaped = true
      } else if (ch == end) {
        break
      } else {
        str += ch
      }
    }
    return str
  }
  function read_string() {
    return { type: "str", value: read_escaped('"') }
  }
  function skip_comment() {
    read_while(function(ch) { return ch != "\n" })
    input.next()
  }
  function read_next() {
    read_while(is_whitespace)
    if (input.eof()) return null
    let ch = input.peek()
    if (ch == "-") {
      let possible_comment = input.comment_peek()
      if (possible_comment == "-") {
        skip_comment()
        return read_next()
      }
    }
    if (ch == '"') return read_string()
    if (is_digit(ch)) return read_number()
    if (is_id_start(ch)) return read_ident()
    if (is_punc(ch)) return {
      type  : "punc",
      value : input.next()
    }
    if (is_op_char(ch)) return {
      type  : "op",
      value : read_while(is_op_char)
    }
    input.die("Can't handle character: " + ch)
  }
  function peek() {
    return current || (current + read_next())
  }
  function next() {
    let tok = current
    current = null
    return tok || read_next()
  }
  function eof() {
    return peek() == ""
  }
}


