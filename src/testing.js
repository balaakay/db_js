import { tokenStream } from './tokenStream.js'
import { inputStream } from './inputStream.js'


const sample_input = "select * from uwtsl04 where uwtsl04_wattage = 54;"


let tokenizer = tokenStream(inputStream(sample_input))

let eof = tokenizer.eof()
while (!eof) {
  console.log(tokenizer.next())
  eof = tokenizer.eof()
}
