#!/usr/bin/env node

const Kuroshiro = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
var Dictionary = require("japaneasy");
var dict = new Dictionary({
  dictionary: "glossing",
  noRepeat: true,
});

const charOpts = {
  to: "hiragana",
  mode: "okurigana",
  delimiter_start: "[",
  delimiter_end: "]",
};

// disable console.log
console.log = () => {};

const log = (text) => {
  process.stdout.write(`${text}\n`);
};

(async () => {
  const [_a, _b, ..._text] = process.argv;
  const text = _text.join(" ");
  if (text.length < 1) {
    return log("No text specificed");
  }
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());
  const converted = await kuroshiro.convert(text, charOpts);
  // spacing fixing up for anki
  const formatted = converted
    .split("")
    .map((char, i) => {
      // if the last previous is a kana, add a space
      if (
        converted[i - 1] &&
        Kuroshiro.Util.isKanji(char) &&
        !Kuroshiro.Util.isKanji(converted[i - 1])
      ) {
        return ` ${char}`;
      }
      return char;
    })
    .join("")
    .replace(/\n /g, "\n");

  const definitions = await dict(text);
  const formattedDefinitions = definitions
    .map(
      (d) =>
        `${d.japanese}${(d.pronunciation && `[${d.pronunciation}]`) || ""} ${d.english.join(" ")}`
    )
    .join("\n");
  // print it
  return log(`---\n\n${formatted}\n\n${formattedDefinitions}\n\n---`);
})();
