export const categoryRules = [
  {
    category: 'INBOX',
    icon: 'inbox',
    commonRules: {
      patterns: [
        {
          regex: '(.*)you\\s*(have)?\\s*received\\s*(rs|inr)(.*)',
          tags: [],
        },
        {
          regex:
            '(.*)amount\\s*of\\s*(rs|inr)(.*)(debited|deposited|withdrawn|credited)(.*)',
          tags: [],
        },
        {
          regex:
            '(.*)your\\s*account\\s*statement(.*)for(.*)(transaction|month)(.*)',
          tags: [],
        },
        {
          regex:
            '(.*)bill\\s*for(.*)month(.*)(issued|generated)(.*)(rs|inr)(.*)',
          tags: [],
        },
        {
          regex: '(.*)you\\s*paid(.*)rs(.*)with(.*)(wallet|debit|credit)(.*)',
          tags: [],
        },
        {
          regex:
            '(.*)your(.*)(shipment|package|item|order)(.*)(attempted|tracked|delivered|placed)(.*)',
          tags: [],
        },
        {
          regex:
            '(.*)your(.*)(otp|one\\s*time\\s*password|pin)\\s*(is\\s*)?([0-9]+)?(.*)',
          tags: [],
        },
        {
          regex:
            '(.*)you\\s*have\\s*consumed\\s*[0-9]+%(.*)(data|quota|broadband|usage)(.*)',
          tags: [],
        },
        {
          regex:
            '(.*)you\\s*have\\s*not\\s*utilised\\s*your(.*)\\s*(rs)(.*)amount\\s*expires\\s*on(.*)',
          tags: [],
        },
        {
          regex:
            'your\\s*unused\\s*(free)?\\s*cash\\s*(will)?\\s*expire(s)?\\s*(tomorrow|on|today)(.*)',
          tags: [],
        },
        {
          regex:
            '(.*)your\\s*[a-z ]+card\\s*has\\s*been\\s*(used|swiped)(.*)(on|at|rs|balance)(.*)',
          tags: [],
        },
        {
          regex:
            '(.*)(pay|shortfall|rs)(.*)your\\s*premium\\s*for\\s*policy\\s*no\\s*(\\.)[0-9]+(.*)',
          tags: [],
        },
        {
          regex: '(.*)bill\\s*for\\s*rs(.*)(due|paid|ignore)(.*)',
        },
        {
          regex: '(.*)rs(.*)notes(.*)(bill|payment|accepted)(.*)',
        },
        {
          regex: 'refund\\s*initiated(.*)\\s*rs(.*)',
        },
        {
          regex: 'rs(.*)spent\\s*on\\s*your(.*)(card|ending|at)(.*)',
        },
      ],
    },
    senderSpecificRules: [
      {
        senderTag: 'HIMAGI',
        patterns: [
          {
            regex: '(.*)your\\s*medical\\s*record(s)?\\s*no(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'ICICIB',
        patterns: [
          {
            regex: '(.*)your\\s*icici(.*)(bank|iwish|goal)(.*)created(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'MVKRBT',
        patterns: [
          {
            regex:
              '(.*)service\\s*(is|has been|was)\\s*(activated|deactivated)(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'IPAYTM',
        patterns: [
          {
            regex: '(.*)enter(.*)charge\\s*your\\s*(paytm|wallet)(.*)',
            tags: [],
          },
          {
            regex: 'paytm\\s*has\\s*(added|rs|wallet)(.*)',
          },
          {
            regex:
              '(.*)paytm\\s*order(.*)(rs|items|successful|balance|wallet)(.*)',
          },
        ],
      },
      {
        senderTag: 'EPFOHO',
        patterns: [
          {
            regex: '(.*)your\\s*transfer(.*)(claim|approved)(.*)',
          },
        ],
      },
      {
        senderTag: 'PRACTO',
        patterns: [
          {
            regex: '(.*)you\\s*have\\s*an\\s*appointment\\s*at(.*)on(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'NURTRY',
        patterns: [
          {
            regex: '(.*)(prnt|parent)(.*)order(s)?\\s*issued\\s*by(.*)',
            tags: [],
          },
          {
            regex:
              '(.*)(prnt|parent)(.*)revise\\s*(pg|page)\\s*(no|number)(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'FCHRGE',
        patterns: [
          {
            regex: '(.*)your\\s*recharge\\s*for(.*)is\\s*pending(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'MYTSKY',
        patterns: [
          {
            regex:
              '(.*)tatasky\\s*wo\\s*no(.*)\\s*will\\s*be\\s*attended\\s*in\\s*[0-9]+\\s*hours(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'AIRDSL',
        patterns: [
          {
            regex:
              '(.*)[0-9]+\\s*gb(.*)has\\s*activated(.*)airtel\\s*broadband\\s*id(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'IOBCHN',
        patterns: [
          {
            regex: '(.*)instalment(.*)rs(.*)iob\\s*loan(.*)due\\s*on(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'HDFSEC',
        patterns: [
          {
            regex:
              'halert\\s*:\\s*(technical)?\\s*pick\\s*of\\s*the\\s*month\\s*buy\\s*[a-z]+(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'BMSHOW',
        patterns: [
          {
            regex:
              '(.*)your\\s*ticket\\s*has\\s*been\\s*generated\\s*and\\s*sent\\s*to\\s*your\\s*email\\s*id\\s*for(.*)',
            tags: [],
          },
        ],
      },
    ],
  },
  {
    category: 'PROMOTION',
    icon: 'tag',
    commonRules: {
      patterns: [
        {
          regex:
            'bumper\\s*offer\\s*from\\s*[a-z]+\\s*bank\\s*personal\\s*loan\\s*just(.*)(benefits|more\\s*info)(.*)',
          tags: [],
        },
        {
          regex:
            'av(a|ä)il\\s*pers(ö|o)(n|ñ)al\\s*loa(n|ñ)\\s*from(.*)b(a|ä)(n|ñ)k\\s*(.*)(salaried\\s*employees|lowest\\s*rate|pf)(.*)',
          tags: [],
        },
        {
          regex:
            'play\\s*rummy\\s*free!\\s*rs(.*)(welcome\\s*bonus|click\\s*here|win\\s*real\\s*money)(.*)',
        },
      ],
    },
    senderSpecificRules: [
      {
        senderTag: 'APOLLO',
        patterns: [
          {
            regex:
              '(.*)screening\\s*examination\\s*by(.*)from(.*)b/w(.*)at(.*)call(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'RUNBUD',
        patterns: [
          {
            regex:
              'earn\\s*a\\s*medal\\s*on\\s*last\\s*[a-z]+\\s*of(.*)oxfordgolfcourse\\s*helipad,pune\\s*[0-9 ]+',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'LEVISL',
        patterns: [
          {
            regex:
              'celebrate(.*)and\\s*get\\s*rs.(.*)off\\s*on(.*)starting\\s*today.\\s*you\\s*can\\s*also\\s*redeem\\s*your\\s*existing\\s*points\\s*on\\s*this\\s*purchase.\\s*offer\\s*valid\\s*only\\s*until(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'JABONG',
        patterns: [
          {
            regex:
              "omg(!!)?\\s*puma@(.*)\\s*yes..it's\\s*true!\\s*only\\s*for[0-9 ]+hrs!\\s*be\\s*the\\s*first\\s*one\\s*to\\s*grab!(.*)",
            tags: [],
          },
        ],
      },
      {
        senderTag: 'EASEMY',
        patterns: [
          {
            regex:
              'air-fares@\\s*easemytrip.com(.*)rates\\s*starting\\s*rs(.*)\\s*zero\\s*convenience-fee(.*)rs(.*)crore\\s*firm(.*)million\\s*happy\\s*customers\\s*support\\s*team,\\s*email:\\s*care@easemytrip.com',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'TXTMSG',
        patterns: [
          {
            regex:
              'we\\s*deal\\s*in\\s*(home|mortgage|car\\s*loans)(.*)from\\s*(all|banks|private|finance)(.*)(ct|contact|clk2|click\\s*to|cal|call|bk|back)\\s*(.*)(http|dsus)(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'UBERIN',
        patterns: [
          {
            regex:
              'hyderabad,\\s*today\\s*(.*)\\s*we’re\\s*bringing\\s*you\\s*free\\s*biryani\\s*on-demand(.*)details-\\s*(.*)(http|uber)(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'ZRODHA',
        patterns: [
          {
            regex:
              'have\\s*you\\s*got\\s*your\\s*child\\s*a\\s*copy\\s*of[a-z ]+yet?\\s*(.*)(order\\s*now|introduce|basics\\s*of\\s*finance)(.*).\\s*(http|msg)(.*)',
            tags: [],
          },
        ],
      },
      {
        senderTag: 'ZIVAME',
        patterns: [
          {
            regex:
              'the\\s*mad,\\s*mad\\s*[a-z]*\\s*sale!\\s*(get\\s*a\\s*free|on\\s*offer|shop\\s*now)(.*)http(.*)',
            tags: [],
          },
        ],
      },
    ],
  },
];

export const getRegexList = () => {
  let regexes = {};
  categoryRules.forEach(o => {
    let {category, commonRules, senderSpecificRules} = o;
    let commonRulesRegexArray = [];
    let senderSpecificRegexArray = [];
    commonRules.patterns.forEach(on => {
      commonRulesRegexArray.push(new RegExp(on.regex));
    });
    senderSpecificRules.forEach(spr => {
      let {patterns} = spr;
      patterns.forEach(p => {
        senderSpecificRegexArray.push(new RegExp(p.regex));
      });
    });
    regexes = {
      ...regexes,
      [category]: [...commonRulesRegexArray, ...senderSpecificRegexArray],
    };
  });
  return regexes;
};
