const main = require('./main');

async function translate ({ text, skipTranslate }) {
  // formated for anki  
  const { formatted, english, definitions } = await main({text, skipTranslate});
  
  const formattedDefinitions = definitions
    .map(
      (d) =>
        `<b>${d.japanese}${(d.pronunciation && `[${d.pronunciation}]`) || ""}</b> ${d.english.join(" ")}`
    )
    .join("<br/>");

  return { formatted, english, definitions, formattedDefinitions }

}

module.exports = translate;