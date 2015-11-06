//function get_easily_pronounced_random_phrase($length = 5) {      // shuffling a large array is always result with better letter sequences.


/**
 * return a one readable phrase, of random content
 * @param {number=} length   - optional (if missing, default is 5) length of the returned word.
 * @return {string}
 */
function get_easily_pronounced_random_phrase(length /* = 5 (default) */) {
  "use strict";

  var seed, vowels,
      not_in_start, okish;

  length = ("number" === typeof length) ? length : 5; //default

  /**
   * Repeat a string
   * multiplier has to be greater than or equal to 0.
   * If the multiplier is set to 0, the function
   * will return an empty string.
   *
   * @param {number=} multiplier - Number of time the input string should be repeated.
   * @return {string}
   */
  String.prototype.repeat = String.prototype.repeat || function (multiplier) {
    multiplier = ("number" === typeof multiplier) ? Math.max(0, multiplier) : 0;
    return ((new Array(multiplier + 1)).join(this));
  };

  function array_duplicate(array, times) {
    return array.join('|||').repeat(times).split('|||');
  }


  Array.prototype.shuffle = Array.prototype.shuffle || function () {
    var len = this.length,
        i, rnd, holder;

    for (i = 0; i < (len * 2); i += 1) {
      rnd = ~~(Math.random() * len);
      holder = this[(i % len)];
      this[(i % len)] = this[rnd];
      this[rnd] = holder;
    }
    return this;
  };

  String.prototype.shuffle = String.prototype.shuffle || function () {
    return this.split('').shuffle().join('');
  };


  /**
   * replace using regular expression
   * @param {Array.<string>|string=} pattern        - string or an array of strings (regular expressions, optional with i,g,.. regex flags).
   * @param {Array.<string>|string=} replacement    - an array of strings.
   * @param {string}                 subject        - string to do replacements on.
   //   * @param {number=}                limit          - * PHP - TODO:implement it
   //   * @param {number=}                count          - * PHP - TODO:implement it
   * @return {string}                               - the original strings, have applied with all replacements.
   */
  function preg_replace(pattern, replacement, subject /*, limit, count */) {

    //PHP defaults
//    limit = ("undefined" === typeof limit) ? (-1) : limit;
//    count = ("undefined" === typeof count) ? null : count;

    //variable fixing
    subject = ("string" === typeof subject) ? subject : "";

    //variable averaging (for algorithm)
    pattern = ("string" === typeof pattern) ? [pattern] : pattern; //represent as an array
    replacement = ("string" === typeof replacement) ? [replacement] : replacement; //represent as an array


    pattern.forEach(function (element, index) {
      subject = subject.replace(element, replacement[index % replacement.length]);
    });

    return subject;
  }


  //-----------------------------------------------------------------------------------------------------------------
  //baseline a-z
  seed = 'abcdefghijklmnopqrstuvwxyz';
  seed = seed.repeat(2);  //duplicate
  seed = seed.shuffle();


  //-----------------------------------------------------------------------------------------------------------------
  //interlace more vowels
  vowels = [
//    '', '', '', '', '', '', //                        add nothing (on large scale its 40% not adding)
    'a', 'e', 'i', 'o', 'u', 'y', 'ee', 'oa', 'oo' // add ok vowels (on large scale its 60% adding)
  ];
  vowels = array_duplicate(vowels, 10);
  vowels = vowels.shuffle();

  //make word better pronounced by adding vowels.
  seed = seed.split('');
  seed = seed.map(function (seed_element, index) {
    return seed_element + (vowels[index % vowels.length]);
  });
  seed = seed.join('');


  //-----------------------------------------------------------------------------------------------------------------
  //replace 24 bad combinations
  not_in_start = [
    /ck/gi, /cm/gi, /dr/gi, /ds/gi,
    /ft/gi, /gh/gi, /gn/gi, /kr/gi,
    /ks/gi, /ls/gi, /lt/gi, /lr/gi,
    /mp/gi, /mt/gi, /ms/gi, /ng/gi,
    /ns/gi, /rd/gi, /rg/gi, /rs/gi,
    /rt/gi, /ss/gi, /ts/gi, /tch/gi
  ];

  okish = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', //                 replacements: delete (on large scale its 26.9% of deleting the bad combination)
    'a', 'e', 'i', 'o', 'u', 'y', 'b', 'c', 'd', 'f', 'g', 'h', //                    replacements: single letter (on large scale its 73% of replacing the bad combination with 1-or-2 letter alternative).
    'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'z',
    'pt', 'gl', 'gr', 'ch', 'ph', 'ee', 'oa', 'oo', 'ps', 'sh', 'st', 'th', 'wh']; // replacements: allowed pairs

  okish = array_duplicate(okish, 6);
  okish = okish.shuffle();

  seed = preg_replace(not_in_start, okish, seed);


  //-----------------------------------------------------------------------------------------------------------------
  //replace duplicated pairs (oo: ok, ooo: not ok).
  seed = preg_replace(
    [
      /aa/gi, /bb/gi, /cc/gi, /dd/gi, /ee/gi, /ff/gi, /gg/gi, /hh/gi, /ii/gi, /jj/gi, /kk/gi,
      /ll/gi, /mm/gi, /nn/gi, /pp/gi, /qq/gi, /rr/gi, /ss/gi, /tt/gi, /uu/gi, /vv/gi,
      /ww/gi, /xx/gi, /yy/gi, /zz/gi,
      /ooo/gi
    ],
    [
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
    ],
    seed
  );


  //-----------------------------------------------------------------------------------------------------------------
  //cut proper length
  length = Math.min(Math.max(3, length), seed.length); //make sure requested word is not too small or too big.

  return String.prototype.substr.call(seed, 0, length);
}

/**
 * generate valid number between two ranges,
 * its ok to generate negative numbers.
 * @param {number=} min - lower-range limit
 * @param {number=} max - upper-range limit
 */
function mt_rand(min, max) {
  var
    MIN_INTEGER = Number && Number.MIN_SAFE_INTEGER || 2147483647, //JavaScript native min lower-limit.
    MAX_INTEGER = Number && Number.MAX_SAFE_INTEGER || 2147483647; //JavaScript native max upper-limit.

  //normalize input (not number or float)
  min = ("number" === typeof min) ? ~~min : MIN_INTEGER;
  max = ("number" === typeof max) ? ~~max : MAX_INTEGER;

  //buffer-overflow prevention.
  min = min < MIN_INTEGER ? MIN_INTEGER : min;
  min = min > MAX_INTEGER ? MAX_INTEGER : min;
  max = max < MIN_INTEGER ? MIN_INTEGER : max;
  max = max > MAX_INTEGER ? MAX_INTEGER : max;

  max = ((max - min) + 1); //lowering upper-limit.
  return min + ~~(Math.random() * max);
}

function get_paragraphs_of_easily_pronounced_random_phrases() {
  "use strict";
  var result = [],
      paragraphs, sentences, words,
      paragraph, sentence, word;

  /*
   //  1-5 paragraphs
   //    each: 3-5 sentences
   //      each: 5-12 words
   //        each: 3-6 letters
   */
  paragraphs = [];
  for (paragraphs = mt_rand(1, 5); paragraphs > 0; paragraphs -= 1) {
    paragraph = [];
    for (sentences = mt_rand(3, 5); sentences > 0; sentences -= 1) {
      sentence = [];
      for (words = mt_rand(5, 12); words > 0; words -= 1) {
        word = get_easily_pronounced_random_phrase(mt_rand(3, 6));
        sentence.push(word);
      }
      paragraph.push(sentence);
    }
    result.push(paragraph);
  }

  return result;
}

function get_paragraphs_html(paragraphs) {
  "use strict";
  var html = [];
//  return JSON.stringify(paragraphs);

  paragraphs.forEach(function (paragraph) {
    html.push("<span class=\"paragraph\">");
    paragraph.forEach(function (sentence) {
      html.push("<span class=\"sentence\">");
      sentence.forEach(function (word) {
        html.push("<span class=\"word\">");
        html.push(word);
        html.push("</span>");
      })
      html.push("</span>");
    })
    html.push("</span>");
  });
//  for (var paragraph in paragraphs) {
////    html.push('||PARAGRAPH_START||');
//    for (var sentence in paragraph) {
////      html.push('||SENTENCE_START||');
//      for (var word in sentence) {
////        html.push('||WORD_START||');
//        html.push(word);
////        html.push('||WORD_END||');
//      }
////      html.push('||SENTENCE_END||');
//    }
////    html.push('||PARAGRAPH_END||');
//  }

  return html.join('')
    .replace("/\|\|PARAGRAPH_START\|\|/g", '<p>')
    .replace("/\|\|PARAGRAPH_END\|\|/g", '</p>')
    .replace("/\|\|SENTENCE_START\|\|/g", '<span class="sentence">')
    .replace("/\|\|SENTENCE_END\|\|/g", '</span>')
    .replace("/\|\|WORD_START\|\|/g", '<span class="word">')
    .replace("/\|\|WORD_END\|\|/g", '</span>')
    ;
}
/*



 header('Content-Type: text/plain; charset=utf-8');
 echo get_easily_pronounced_random_phrase(mt_rand(3, 6));

 for ($p = mt_rand(3, 5); $p > 0; $p -= 1) { //paragraphs
 for ($i = mt_rand(3, 5); $i > 0; $i -= 1) { //sentences
 for ($j = mt_rand(5, 12); $i > 0; $j -= 1) { //words
 echo get_easily_pronounced_random_phrase(mt_rand(3, 6));
 echo ' ';
 }
 echo '. ';
 }
 echo '\n';
 }

 */
