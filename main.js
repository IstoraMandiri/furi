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

async function main ({ text: _text, skipTranslate }) {
  const text = _text.replace(/\s+/g, ''); // remove whitespace
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());
  const converted = await kuroshiro.convert(text, charOpts);
  const english = !skipTranslate && (await require('@k3rn31p4nic/google-translate-api')(text, { from: 'ja', to: 'en' })).text;

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
  
  // get the definitions  
  const definitions = await dict(encodeURI(text));
  // print it
  return { formatted, english, definitions }
}

module.exports = main