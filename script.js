// ============================================================
// SEMANTIC PRIMING x FACE OCCLUSION EXPERIMENT
// 2x3 mixed design
//   Between-subjects: Prime type (positive / neutral / negative)
//   Within-subjects:  Face occlusion (full / left-occluded / right-occluded)
// ============================================================

// ------------------------------------------------------------
// 1. PARAMETERS FROM SOSCISURVEY
// ------------------------------------------------------------
var debug      = (typeof window.debug      !== 'undefined') ? parseInt(window.debug,         10) : 0;
var dispSize   = (typeof window.dispSize   !== 'undefined') ? parseInt(window.dispSize,      10) : 3;
var doPractice = (typeof window.doPractice !== 'undefined') ? parseInt(window.doPractice,    10) : 1;
var primeTime  = (typeof window.primeTime  !== 'undefined') ? parseInt(window.primeTime,     10) : 67;
var expGroup   = (typeof window.expGroup   !== 'undefined') ? parseInt(window.expGroup,      10) : 1;
var expVersion = (typeof window.expVersion !== 'undefined') ? parseInt(window.expVersion,    10) : 1;

// ------------------------------------------------------------
// 2. PRIME WORD LISTS
// ------------------------------------------------------------
var PRIME_WORDS = {
  positive: ['driven', 'kunnig', 'skicklig', 'varm', 'charmig', 'hjälpsam', 'ödmjuk', 'ärlig', 'populär', 'smart', 'omtyckt', 'logisk', 'vettig', 'stark', 'lugn', 'livlig', 'rättvis', 'klok', 'sann', 'effektiv', 'vänlig', 'rolig', 'skön', 'pålitlig', 'lojal', 'social', 'stabil', 'snäll'],
  neutral:  ['sten', 'skärm', 'väska', 'bild', 'papper', 'stol', 'dörr', 'vatten', 'text', 'system', 'penna', 'träd', 'hall', 'lista', 'bord', 'nummer', 'moln', 'låda', 'karta', 'sand', 'ljud', 'kedja', 'fönster', 'siffra', 'plats', 'skiva', 'serie', 'vägg'],
  negative: ['falsk', 'taskig', 'fientlig', 'snål', 'dryg', 'girig', 'trög', 'tjatig', 'korkad', 'självisk', 'ytlig', 'mesig', 'kall', 'svag', 'våldsam', 'elak', 'tråkig', 'stel', 'stressig', 'dålig', 'arrogant', 'klantig', 'slarvig', 'kräsen', 'gnällig', 'bitter', 'ignorant', 'fjantig']
  };

var GROUP_MAP = { 1: 'positive', 2: 'neutral', 3: 'negative' };
var primeCondition = GROUP_MAP[expGroup] || 'neutral';
var primeWords     = PRIME_WORDS[primeCondition];

// ------------------------------------------------------------
// 3. FACE IMAGE SETS PER VERSION
// ------------------------------------------------------------
var VERSION_MAP = {
  1: { full: [1,4,5,8,9,12,13,16,17,20,21,24,25,28],         leftOcc: [2,3,6,7,10,11,14],    rightOcc: [15,18,19,22,23,26,27] },
  2: { full: [1,4,5,8,9,12,13,16,17,20,21,24,25,28],         leftOcc: [15,18,19,22,23,26,27],    rightOcc: [2,3,6,7,10,11,14] },
  3: { full: [2,3,6,7,10,11,14,15,18,19,22,23,26,27],       leftOcc: [1,4,5,8,9,12,13],          rightOcc: [16,17,20,21,24,25,28]  },
  4: { full: [2,3,6,7,10,11,14,15,18,19,22,23,26,27],       leftOcc: [16,17,20,21,24,25,28],     rightOcc: [1,4,5,8,9,12,13]       }
};

var versionSets = VERSION_MAP[expVersion] || VERSION_MAP[1];

// Helper: pad face number to two digits
function faceKey(n) {
  var s = String(n);
  if (s.length < 2) { s = '0' + s; }
  return 'face' + s + '.jpg';
}

// Root-level files registry — all 28 faces declared explicitly
// so lab.js preloads them (same literal format as the working static script)
var ALL_FACE_KEYS = {
  "face01.jpg": "embedded\u002Fface01.jpg",
  "face02.jpg": "embedded\u002Fface02.jpg",
  "face03.jpg": "embedded\u002Fface03.jpg",
  "face04.jpg": "embedded\u002Fface04.jpg",
  "face05.jpg": "embedded\u002Fface05.jpg",
  "face06.jpg": "embedded\u002Fface06.jpg",
  "face07.jpg": "embedded\u002Fface07.jpg",
  "face08.jpg": "embedded\u002Fface08.jpg",
  "face09.jpg": "embedded\u002Fface09.jpg",
  "face10.jpg": "embedded\u002Fface10.jpg",
  "face11.jpg": "embedded\u002Fface11.jpg",
  "face12.jpg": "embedded\u002Fface12.jpg",
  "face13.jpg": "embedded\u002Fface13.jpg",
  "face14.jpg": "embedded\u002Fface14.jpg",
  "face15.jpg": "embedded\u002Fface15.jpg",
  "face16.jpg": "embedded\u002Fface16.jpg",
  "face17.jpg": "embedded\u002Fface17.jpg",
  "face18.jpg": "embedded\u002Fface18.jpg",
  "face19.jpg": "embedded\u002Fface19.jpg",
  "face20.jpg": "embedded\u002Fface20.jpg",
  "face21.jpg": "embedded\u002Fface21.jpg",
  "face22.jpg": "embedded\u002Fface22.jpg",
  "face23.jpg": "embedded\u002Fface23.jpg",
  "face24.jpg": "embedded\u002Fface24.jpg",
  "face25.jpg": "embedded\u002Fface25.jpg",
  "face26.jpg": "embedded\u002Fface26.jpg",
  "face27.jpg": "embedded\u002Fface27.jpg",
  "face28.jpg": "embedded\u002Fface28.jpg",
  "face99.jpg": "embedded\u002Fface99.jpg"
};

// ------------------------------------------------------------
// 4. SHUFFLE HELPERS
// ------------------------------------------------------------
function shuffleArray(arr) {
  var a = arr.slice();
  var i, j, tmp;
  for (i = a.length - 1; i > 0; i--) {
    j   = Math.floor(Math.random() * (i + 1));
    tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function buildTrials() {
  var trials = [];
  var i, n;

  for (i = 0; i < versionSets.full.length; i++) {
    n = versionSets.full[i];
    trials.push({ faceId: n, occlude: 'none',  faceKey: faceKey(n), occ_left: '0', occ_right: '0' });
  }
  for (i = 0; i < versionSets.leftOcc.length; i++) {
    n = versionSets.leftOcc[i];
    trials.push({ faceId: n, occlude: 'left',  faceKey: faceKey(n), occ_left: '1', occ_right: '0' });
  }
  for (i = 0; i < versionSets.rightOcc.length; i++) {
    n = versionSets.rightOcc[i];
    trials.push({ faceId: n, occlude: 'right', faceKey: faceKey(n), occ_left: '0', occ_right: '1' });
  }

  return shuffleArray(trials);
}

function makePrimeCycler(words) {
  let index = 0;
  
  return function next() {
    // Return the word at the current index, 
    // then increment and wrap around using the modulo operator
    const word = words[index];
    index = (index + 1) % words.length;
    return word;
  };
}

function generateMask(length) {
  var chars = "&@#§%XWKHBRQ";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

var T_FORWARD_MASK = 100;
var T_PRIME        = primeTime;
var T_BACK_MASK    = 100;
var T_FACE         = 2500;

var FONT_SIZE       = 48;
var VP             = [800, 600];

if (dispSize === 1) {
  var box_W        = 700;
  var box_H        = 525;
  var box_top      = -25;
  var box_left     = 0;

  var img_w       = 400;
  var img_h       = 500;
  
} else if (dispSize === 2) {
  var box_W        = 600;
  var box_H        = 450;
  var box_top      = -50;
  var box_left     = 0;

  var img_w       = 320;
  var img_h       = 400;

} else if (dispSize === 3) {
  var box_W        = 600;
  var box_H        = 450;
  var box_top      = -50;
  var box_left     = 0;

  var img_w       = 296;
  var img_h       = 400;
};

function makeTrialSequence(trial, primeWord, isLast) {

  var fMask = generateMask(9);
  var bMask = generateMask(9);

  // Generate random duration between 2000 and 4000 ms
  var T_FIXATION = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;

  var screens = [
    // --- 1. FIXATION CROSS ---
    {
      "type": "lab.canvas.Screen",
      "title": "Fixation",
      "timeout": T_FIXATION,
      "viewport": VP,
      "files": {},
      "parameters": {},
      "responses": { "": "" },
      "messageHandlers": {},
      "content": [
        {
          "type": "rect",
          "left": box_left,
          "top": box_top,
          "width": box_W,
          "height": box_H,
          "stroke": "black",
          "strokeWidth": 3,
          "fill": "#f8f8f8"
        },
        {
          "type": "i-text",
          "left": box_left, "top": box_top, "angle": 0,
          "fill": "#000000",
          "text": "+",
          "fontStyle": "normal", "fontWeight": "normal",
          "fontSize": FONT_SIZE, "fontFamily": "sans-serif",
          "lineHeight": 1.16, "textAlign": "center"
        }
      ]
    },

    // --- 2. FORWARD MASK ---
    {
      "type": "lab.canvas.Screen",
      "title": "ForwardMask",
      "timeout": T_FORWARD_MASK,
      "viewport": VP,
      "files": {},
      "parameters": {},
      "responses": { "": "" },
      "messageHandlers": {},
      "content": [
        {
          "type": "rect",
          "left": box_left,
          "top": box_top,
          "width": box_W,
          "height": box_H,
          "stroke": "black",
          "strokeWidth": 3,
          "fill": "#f8f8f8"
        },
        {
          "type": "i-text",
          "left": box_left, "top": box_top, "angle": 0,
          "fill": "#000000",
          "text": "${ this.parameters.f_mask }",
          "fontStyle": "normal", "fontWeight": "bold",
          "fontSize": FONT_SIZE, "fontFamily": "monospace",
          "lineHeight": 1.16, "textAlign": "center"
        }
      ]
    },

    // --- 3. PRIME WORD ---
    {
      "type": "lab.canvas.Screen",
      "title": "Prime",
      "timeout": T_PRIME,
      "viewport": VP,
      "files": {},
      "parameters": {},
      "responses": { "": "" },
      "messageHandlers": {},
      "content": [
        {
          "type": "rect",
          "left": box_left,
          "top": box_top,
          "width": box_W,
          "height": box_H,
          "stroke": "black",
          "strokeWidth": 3,
          "fill": "#f8f8f8"
        },
        {
          "type": "i-text",
          "left": box_left, "top": box_top, "angle": 0,
          "fill": "#000000",
          "text": "${ this.parameters.prime_word }",
          "fontStyle": "normal", "fontWeight": "normal",
          "fontSize": FONT_SIZE, "fontFamily": "sans-serif",
          "lineHeight": 1.16, "textAlign": "center"
        }
      ]
    },

    // --- 4. BACKWARD MASK ---
    {
      "type": "lab.canvas.Screen",
      "title": "BackwardMask",
      "timeout": T_BACK_MASK,
      "viewport": VP,
      "files": {},
      "parameters": {},
      "responses": { "": "" },
      "messageHandlers": {},
      "content": [
        {
          "type": "rect",
          "left": box_left,
          "top": box_top,
          "width": box_W,
          "height": box_H,
          "stroke": "black",
          "strokeWidth": 3,
          "fill": "#f8f8f8"
        },
        {
          "type": "i-text",
          "left": box_left, "top": box_top, "angle": 0,
          "fill": "#000000",
          "text": "${ this.parameters.b_mask }",
          "fontStyle": "normal", "fontWeight": "bold",
          "fontSize": FONT_SIZE, "fontFamily": "monospace",
          "lineHeight": 1.16, "textAlign": "center"
        }
      ]
    },

    // --- 5. TARGET FACE ---
    {
      "type": "lab.canvas.Screen",
      "title": "FaceTarget",
      "timeout": T_FACE,
      "viewport": VP,
      "files": {},
      "parameters": {},
      "responses": { "": "" },
      "messageHandlers": {},
      "content": [
        {
          "type": "rect",
          "left": box_left,
          "top": box_top,
          "width": box_W,
          "height": box_H,
          "stroke": "black",
          "strokeWidth": 3,
          "fill": "#f8f8f8"
        },
        {
          "type": "image",
          "left": box_left, "top": box_top, "angle": 0,
          "width": img_w, "height": img_h,
          "src": "${ this.files[this.parameters.face_key] }"
        },
        {
          "type": "rect",
          "left": box_left - img_w/4, "top": box_top,
          "width": img_w/2, "height": img_h,
          "fill": "${ this.parameters.occ_left === '1' ? 'black' : 'rgba(0,0,0,0)' }"
        },
        {
          "type": "rect",
          "left": box_left + img_w/4, "top": box_top,
          "width": img_w/2, "height": img_h,
          "fill": "${ this.parameters.occ_right === '1' ? 'black' : 'rgba(0,0,0,0)' }"
        }
      ]
    },

    // --- 6. ATTRACTIVENESS RATING ---
    {
      "type": "lab.html.Screen",
      "title": "Rating",
      "files": {},
      "parameters": {},
      "responses": {
        "click button[data-response=\"1\"]": "1",
        "click button[data-response=\"2\"]": "2",
        "click button[data-response=\"3\"]": "3",
        "click button[data-response=\"4\"]": "4",
        "click button[data-response=\"5\"]": "5",
        "click button[data-response=\"6\"]": "6",
        "click button[data-response=\"7\"]": "7",
        "click button[data-response=\"8\"]": "8",
        "click button[data-response=\"9\"]": "9"
      },
      "messageHandlers": {},
      "content": "<div style=\"display: flex; flex-direction: column; min-height: 100%;\"><header class=\"content-vertical-center content-horizontal-center\" style=\"padding-bottom:0.5rem;\"><p style=\"font-size:1.1rem;margin:0;\">Hur <strong>attraktiv</strong> var personen på bilden?</p></header><main style=\"flex: 1; padding: 0px;\"></main><footer class=\"content-vertical-bottom content-horizontal-center\"><div class=\"rating-container\"><div class=\"rating-buttons\" style=\"display: flex; justify-content: space-between; gap: 5px; padding: 0 60px;\"><button class=\"rating-btn\" data-response=\"1\" style=\"color:black;font-size:18px;font-weight:bold;\">1</button><button class=\"rating-btn\" data-response=\"2\" style=\"color:black;font-size:18px;font-weight:bold;\">2</button><button class=\"rating-btn\" data-response=\"3\" style=\"color:black;font-size:18px;font-weight:bold;\">3</button><button class=\"rating-btn\" data-response=\"4\" style=\"color:black;font-size:18px;font-weight:bold;\">4</button><button class=\"rating-btn\" data-response=\"5\" style=\"color:black;font-size:18px;font-weight:bold;\">5</button><button class=\"rating-btn\" data-response=\"6\" style=\"color:black;font-size:18px;font-weight:bold;\">6</button><button class=\"rating-btn\" data-response=\"7\" style=\"color:black;font-size:18px;font-weight:bold;\">7</button><button class=\"rating-btn\" data-response=\"8\" style=\"color:black;font-size:18px;font-weight:bold;\">8</button><button class=\"rating-btn\" data-response=\"9\" style=\"color:black;font-size:18px;font-weight:bold;\">9</button></div><div class=\"rating-labels\" style=\"display: flex; justify-content: space-between; width: 100%; margin-bottom: 0.5rem;\"><span style=\"flex:1;text-align:left;\">väldigt oattraktiv</span><span style=\"flex:1;text-align:center;\">medel</span><span style=\"flex:1;text-align:right;\">väldigt attraktiv</span></div></div></footer></div>"
    }
  ];

  // If not the last trial, add between-trial break
  if (!isLast) {
    screens.push(
      {
        "type": "lab.canvas.Screen",
        "title": "InterTrialReminder",
        "viewport": VP,
        "responses": {
          "keypress(Space)": "continue"
        },
        "content": [
          {
            "type": "rect",
            "left": box_left, "top": box_top, "width": box_W, "height": box_H,
            "stroke": "black", "strokeWidth": 3, "fill": "#f8f8f8"
          },
          {
            "type": "i-text",
            "left": box_left, "top": box_top - 20,
            "fill": "#333333",
            "text": "Gör dig redo för nästa ansikte",
            "fontSize": 24, "fontFamily": "sans-serif"
          },
          {
            "type": "rect",
            "left": box_left, "top": box_top + 200,
            "width": 160, "height": 30,
            "fill": "#ebebeb", "stroke": "#adadad", "strokeWidth": 1,
            "rx": 5, "ry": 5
          },
          {
            "type": "i-text",
            "left": box_left, "top": box_top + 200,
            "fill": "#333333",
            "text": "MELLANSLAG",
            "fontSize": 14, "fontWeight": "bold", "fontFamily": "monospace"
          },
          {
            "type": "i-text",
            "left": box_left, "top": box_top + 165,
            "fill": "#999999",
            "text": "Tryck för att fortsätta",
            "fontSize": 12, "fontFamily": "sans-serif"
          }
        ]
      });
  }

  return {
    "type": "lab.flow.Sequence",
    "title": "Trial_face" + trial.faceId,
    "parameters": {
      "face_key":        trial.faceKey,
      "face_id":         String(trial.faceId),
      "occlusion":       trial.occlude,
      "occ_left":        trial.occ_left,
      "occ_right":       trial.occ_right,
      "prime_word":      primeWord,
      "prime_condition": primeCondition,
      "exp_group":       String(expGroup),
      "exp_version":     String(expVersion),
      "f_mask":          fMask,
      "b_mask":          bMask
    },
    "responses":       { "": "" },
    "messageHandlers": {},
    "files":           {},
    "content": screens
  };
}

// ============================================================
// 6. ASSEMBLE STUDY
// ============================================================
var trials    = buildTrials();
var nextPrime = makePrimeCycler(primeWords);
var i, n;

var trialSequences = [];
for (i = 0; i < trials.length; i++) {
  var isLast = (i === trials.length - 1);
  trialSequences.push(makeTrialSequence(trials[i], nextPrime(), isLast));
}

var practicePrime = 'kxjvnsb'; // dummy prime word that isn't in the real lists
var practiceImg = 99;
var practiceTrials = [];
if (doPractice) {

  practiceTrials.push(makeTrialSequence(
      { faceId: practiceImg, occlude: 'none', faceKey: faceKey(practiceImg), occ_left: '0', occ_right: '0' },
      practicePrime,
      0
  ));
  practiceTrials.push(makeTrialSequence(
      { faceId: practiceImg, occlude: 'left', faceKey: faceKey(practiceImg), occ_left: '1', occ_right: '0' },
      practicePrime, // dummy prime word that isn't in the real lists
      0
  ));
  practiceTrials.push(makeTrialSequence(
      { faceId: practiceImg, occlude: 'none', faceKey: faceKey(practiceImg), occ_left: '0', occ_right: '0' },
      practicePrime, // dummy prime word that isn't in the real lists
      0
  ));
  practiceTrials.push(makeTrialSequence(
      { faceId: practiceImg, occlude: 'right', faceKey: faceKey(practiceImg), occ_left: '0', occ_right: '1' },
      practicePrime, // dummy prime word that isn't in the real lists
      1
  ));
}

var debugBlock = debug
  ? '<div style="position:absolute;top:10px;left:10px;font-size:0.9rem;color:#666;"><strong>DEBUG:</strong><br>expGroup = ' + expGroup + '<br>expVersion = ' + expVersion + '<br>dispSize = ' + dispSize + '</div>'
  : '';

var study = lab.util.fromObject({
  "messageHandlers": {},
  "title": "root",
  "type": "lab.flow.Sequence",
  "plugins": [
    { "type": "lab.plugins.Metadata",    "path": undefined },
    { "type": "lab.plugins.PostMessage", "path": undefined }
  ],
  "metadata": {
    "title": "Semantic Priming x Face Occlusion",
    "description": "2x3 mixed design: prime valence (between) x face occlusion level (within)",
    "contributors": ""
  },
  "parameters": {},
  "files": ALL_FACE_KEYS,
  "responses": {},
  "content": [

    // INSTRUCTIONS
    {
      "type": "lab.html.Screen",
      "title": "Instructions",
      "responses": { "keypress(Space)": "continue" },
      "parameters": {},
      "files": {},
      "messageHandlers": {},
      "content": "<div style=\"display: flex; flex-direction: column; min-height: 100%;\"><header class=\"content-vertical-center content-horizontal-center\" style=\"padding: 0px;\"><h1 style=\"margin: 5px;\">V\u00e4lkommen!</h1></header>" + debugBlock + "<main style=\"flex: 1; padding: 0px;\"><p>I det h\u00e4r experimentet kommer du att se <strong>ansikten</strong> och bed\u00f6ma hur <strong>attraktiva</strong> du tycker de \u00e4r.</p><p>Varje f\u00f6rs\u00f6k b\u00f6rjar med ett <strong>fixationskors (+)</strong> i mitten av sk\u00e4rmen. Fokusera alltid p\u00e5 korset tills ansiktet visas.</p>Innan varje ansikte visas kommer du att se tecken som snabbt blinkar på skärmen. Dessa är en del av övergången mellan försöken och kräver ingen respons.<p></p><p>Efter ansiktet visas, bedöm hur attraktiv personen \u00e4r p\u00e5 en skala fr\u00e5n <strong>1 (väldigt oattraktiv)</strong> till <strong>9 (väldigt attraktiv)</strong> genom att klicka p\u00e5 motsvarande knapp.</p><p>Det finns inga rätt eller fel svar, men fokusera på bilderna då de endast visas en kort tid.</p><br></br><p>Du kommer först att börja med fyra övningsomgångar.</p></main><footer class=\"content-vertical-center content-horizontal-center\">Tryck på <kbd>mellanslag</kbd> för att gå vidare.</footer></div>"
    },

    // PRACTICE INTRO
    {
      "type": "lab.html.Screen",
      "title": "PracticeIntro",
      "responses": { "keypress(Space)": "continue" },
      "parameters": {},
      "files": {},
      "messageHandlers": {},
      "content": "<div style=\"display: flex; flex-direction: column; min-height: 100%;\"><header class=\"content-vertical-center content-horizontal-center\"><h2 style=\"margin: 5px;\">Övningsexempel</h2></header><main style=\"flex: 1; padding: 0px;\"><p>F\u00f6rst f\u00e5r du g\u00f6ra <strong>fyra \u00f6vningsf\u00f6rs\u00f6k</strong> f\u00f6r att bekanta dig med uppgiften. Dessa ing\u00e5r inte i studien.</p><p>Under övningen används samma exempelansikte i varje omgång.</p></main><footer class=\"content-vertical-center content-horizontal-center\">Tryck p\u00e5 <kbd>mellanslag</kbd> f\u00f6r att b\u00f6rja \u00f6vningen.</footer></div>"
    },

    // PRACTICE BLOCK
    {
      "type": "lab.flow.Sequence",
      "title": "PracticeBlock",
      "parameters": {},
      "files": {},
      "responses": { "": "" },
      "messageHandlers": {},
      "content": practiceTrials
    },

    // MAIN TASK INTRO
    {
      "type": "lab.html.Screen",
      "title": "TaskIntro",
      "responses": { "keypress(Space)": "continue" },
      "parameters": {},
      "files": {},
      "messageHandlers": {},
      "content": "<div style=\"display: flex; flex-direction: column; min-height: 100%;\"><header class=\"content-vertical-center content-horizontal-center\"><h2 style=\"margin: 5px;\">Huvuduppgiften b\u00f6rjar nu</h2></header><main style=\"flex: 1; padding: 0px;\"><p>Övningen är slut. Nu börjar den riktiga studien.</p><p>Uppgiften består av totalt 28 olika ansikten och tar cirka 5 minuter att genomföra.</p><p>Kom ihåg att fokusera på varje ansikte och svara enligt skalan <strong>1 (väldigt oattraktiv)</strong> till <strong>9 (väldigt attraktiv)</strong>.</p></main><footer class=\"content-vertical-center content-horizontal-center\">Tryck p\u00e5 <kbd>mellanslag</kbd> f\u00f6r att b\u00f6rja.</footer></div>"
    },

    // MAIN TRIAL BLOCK
    {
      "type": "lab.flow.Sequence",
      "title": "MainBlock",
      "parameters": {},
      "files": {},
      "responses": { "": "" },
      "messageHandlers": {},
      "content": trialSequences
    },

    // THANK YOU
    {
      "type": "lab.html.Screen",
      "title": "Thanks",
      "responses": { "": "" },
      "timeout": 100,
      "parameters": {},
      "files": {},
      "messageHandlers": {},
      "content": "<main style=\"padding: 0px;\"><p>Vänligen vänta</p></main>"
    }

  ]
});

// Run!
study.run()
