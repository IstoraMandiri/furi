#!/usr/bin/env node

const main = require('./main');

// disable console.log
console.log = () => {};

const log = (text) => {
  process.stdout.write(`${text}\n`);
};


(async () => {
  // TODO if we're part of a CLI process
  // TODO if we're included
  const [_a, _b, ..._text] = process.argv;
  const text = _text.join(" ");
  if (text.length < 1) {
    return log("No text specificed");
  }
  log(_text)
  const { formatted, english, definitions } = await main({text});
  const formattedDefinitions = definitions
    .map(
      (d) =>
        `~ ${d.japanese}${(d.pronunciation && `[${d.pronunciation}]`) || ""} ${d.english.join(" ")}`
    )
    .join("\n");

  return log(`---\n\n${formatted}\n\n${english}\n\n${formattedDefinitions}\n\n---`);


})();
