const Kuroshiro = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

const charOpts = {
  to: 'hiragana',
  mode: 'okurigana',
  delimiter_start: '[',
  delimiter_end: ']'
};

(async () => {
  const text = process.argv[2];
  if (!text) { return console.log("No text specificed"); }
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());
  const converted = await kuroshiro.convert(text, charOpts);
  // spacing fixing up for anki
  const formatted = converted
    .split('')
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
    .join('')
    .replace(/\n /g, '\n');
  // print it
  return console.log(`---\n\n${formatted}\n\n---\n`);
})()