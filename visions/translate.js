function translateText(text, target, cb) {
    // [START translate_translate_text]
    // Imports the Google Cloud client library
    const Translate = require('@google-cloud/translate');
  
    // Creates a client
    const translate = new Translate();
  
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // const text = 'The text to translate, e.g. Hello, world!';
    // const target = 'The target language, e.g. ru';
  
    // Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    translate
      .translate(text, target)
      .then(results => {
        let translations = results[0];
        translations = Array.isArray(translations)
          ? translations
          : [translations];
  
        cb(translations);
      })
      .catch(err => {
        console.error('ERROR:', err);
        cb({err:err});
      });
    // [END translate_translate_text]
  }
  
module.exports = translateText;
