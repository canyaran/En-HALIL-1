// ===== FİİL ÇEKİM SİSTEMİ (V1, V2, V3 KULLANARAK) =====

let currentVerbData = null;
let timelineAnimationRunning = false;
let timelineLoopActive = false;
let currentConjugation = null;

let verbEnGroups = null;
let verbEnLetters = [];
let currentEnLetter = '';
let verbTrGroups = null;
let verbTrLetters = [];
let currentTrLetter = '';
let enHighlight = { direct: new Set(), synonyms: new Set() };
let trHighlight = { direct: new Set(), synonyms: new Set() };
let trToEnMap = null;

const defaultObjectEn = 'football';
const defaultObjectTr = 'futbol';

const timeExpressions = {
    'simple-past': 'yesterday',
    'past-continuous-1': 'at 5 PM',
    'past-continuous-2': 'at 5 PM',
    'past-perfect': 'before dinner',
    'past-perfect-continuous': 'for 2 hours',
    'simple-present-1': 'every day',
    'simple-present-2': 'every day',
    'present-continuous-1': 'now',
    'present-continuous-2': 'now',
    'present-continuous-3': 'now',
    'present-perfect-1': 'already',
    'present-perfect-2': 'already',
    'present-perfect-continuous-1': 'for an hour',
    'present-perfect-continuous-2': 'for an hour',
    'simple-future': 'tomorrow',
    'future-continuous': 'at 5 PM',
    'future-perfect': 'by tomorrow',
    'future-perfect-continuous': 'for 2 hours'
};

const timeExpressionsTr = {
    'simple-past': 'dün',
    'past-continuous-1': 'saat 17:00\'de',
    'past-continuous-2': 'saat 17:00\'de',
    'past-perfect': 'akşam yemeğinden önce',
    'past-perfect-continuous': '2 saat boyunca',
    'simple-present-1': 'her gün',
    'simple-present-2': 'her gün',
    'present-continuous-1': 'şu anda',
    'present-continuous-2': 'şu anda',
    'present-continuous-3': 'şu anda',
    'present-perfect-1': 'çoktan',
    'present-perfect-2': 'çoktan',
    'present-perfect-continuous-1': '1 saattir',
    'present-perfect-continuous-2': '1 saattir',
    'simple-future': 'yarın',
    'future-continuous': 'saat 17:00\'de',
    'future-perfect': 'yarına kadar',
    'future-perfect-continuous': '2 saat boyunca'
};

const verbTrMap = {
    accept: 'kabul et',
    achieve: 'başar',
    act: 'davran',
    add: 'ekle',
    admire: 'hayran ol',
    admit: 'itiraf et',
    advise: 'tavsiye et',
    afford: 'karşılayabil',
    agree: 'katıl',
    allow: 'izin ver',
    announce: 'duyur',
    answer: 'cevap ver',
    apologize: 'özür dile',
    appear: 'görün',
    apply: 'başvur',
    argue: 'tartış',
    arrive: 'var',
    ask: 'sor',
    attach: 'ekle',
    attack: 'saldır',
    attempt: 'denemeye çalış',
    attend: 'katıl',
    avoid: 'kaçın',
    bake: 'pişir',
    balance: 'denge kur',
    ban: 'yasakla',
    become: 'ol',
    begin: 'başla',
    believe: 'inan',
    belong: 'ait ol',
    blame: 'suçla',
    bless: 'kutsal say',
    boil: 'kaynat',
    book: 'rezervasyon yap',
    borrow: 'ödünç al',
    break: 'kır',
    breathe: 'nefes al',
    bring: 'getir',
    brush: 'fırçala',
    build: 'inşa et',
    burn: 'yak',
    buy: 'satın al',
    call: 'ara',
    can: 'yapabil',
    calculate: 'hesapla',
    cancel: 'iptal et',
    care: 'önemse',
    carry: 'taşı',
    catch: 'yakala',
    cause: 'neden ol',
    celebrate: 'kutla',
    change: 'değiştir',
    check: 'kontrol et',
    cheer: 'tezahürat yap',
    choose: 'seç',
    clean: 'temizle',
    climb: 'tırman',
    close: 'kapat',
    collect: 'topla',
    combine: 'birleştir',
    come: 'gel',
    comment: 'yorum yap',
    compare: 'karşılaştır',
    complain: 'şikayet et',
    complete: 'tamamla',
    concentrate: 'konsantre ol',
    confirm: 'doğrula',
    connect: 'bağla',
    consider: 'değerlendir',
    contain: 'içer',
    continue: 'devam et',
    control: 'kontrol et',
    convince: 'ikna et',
    cook: 'pişir',
    copy: 'kopyala',
    cost: 'mâl ol',
    count: 'say',
    cover: 'kapa',
    create: 'oluştur',
    cross: 'geç',
    cry: 'ağla',
    cut: 'kes',
    damage: 'zarar ver',
    dance: 'dans et',
    decide: 'karar ver',
    decorate: 'süsle',
    delay: 'ertele',
    deliver: 'teslim et',
    demand: 'talep et',
    deny: 'inkar et',
    depend: 'bağlı ol',
    describe: 'tanımla',
    design: 'tasarla',
    destroy: 'yok et',
    develop: 'geliştir',
    die: 'öl',
    disagree: 'katılma',
    disappear: 'kaybol',
    discuss: 'tartış',
    dislike: 'hoşlanma',
    divide: 'böl',
    do: 'yap',
    doubt: 'şüphe et',
    download: 'indir',
    drag: 'sürükle',
    draw: 'çiz',
    dress: 'giyin',
    drink: 'iç',
    drive: 'sür',
    drop: 'düşür',
    dry: 'kurut',
    earn: 'kazan',
    eat: 'ye',
    edit: 'düzenle',
    educate: 'eğit',
    employ: 'istihdam et',
    enable: 'sağla',
    encourage: 'teşvik et',
    end: 'bitir',
    enjoy: 'keyif al',
    enter: 'gir',
    escape: 'kaç',
    establish: 'kur',
    evaluate: 'değerlendir',
    examine: 'incele',
    excite: 'heyecanlandır',
    excuse: 'affet',
    exercise: 'egzersiz yap',
    exist: 'var ol',
    expand: 'genişlet',
    expect: 'bekle',
    experience: 'deneyimle',
    explain: 'açıkla',
    explore: 'keşfet',
    export: 'ihraç et',
    express: 'ifade et',
    extend: 'uzat',
    face: 'karşılaş',
    fail: 'başarısız ol',
    fall: 'düş',
    fear: 'kork',
    feel: 'hisset',
    fill: 'doldur',
    film: 'çek',
    find: 'bul',
    finish: 'bitir',
    fire: 'işten çıkar',
    fix: 'düzelt',
    flow: 'ak',
    fly: 'uç',
    focus: 'odaklan',
    follow: 'takip et',
    forget: 'unut',
    forgive: 'affet',
    form: 'oluştur',
    force: 'zorla',
    frighten: 'korkut',
    fry: 'kızart',
    gain: 'elde et',
    gather: 'topla',
    get: 'al',
    give: 'ver',
    go: 'git',
    grab: 'kavra',
    graduate: 'mezun ol',
    greet: 'selamla',
    grow: 'büyü',
    guess: 'tahmin et',
    guide: 'rehberlik et',
    handle: 'ele al',
    happen: 'ol',
    hate: 'nefret et',
    have: 'sahip ol',
    hear: 'duy',
    help: 'yardım et',
    hide: 'sakla',
    hit: 'vur',
    hold: 'tut',
    hope: 'umut et',
    hug: 'sarıl',
    hunt: 'avlan',
    hurry: 'acele et',
    hurt: 'incit',
    identify: 'tanımla',
    ignore: 'görmezden gel',
    imagine: 'hayal et',
    improve: 'geliştir',
    include: 'içer',
    increase: 'artır',
    indicate: 'belirt',
    influence: 'etkile',
    inform: 'bilgilendir',
    injure: 'yarala',
    insist: 'ısrar et',
    install: 'kur',
    intend: 'niyet et',
    interest: 'ilgilendir',
    interrupt: 'böl',
    introduce: 'tanıt',
    invent: 'icat et',
    invest: 'yatırım yap',
    invite: 'davet et',
    involve: 'içer',
    iron: 'ütüle',
    irritate: 'rahatsız et',
    join: 'katıl',
    joke: 'şaka yap',
    judge: 'yargıla',
    jump: 'zıpla',
    keep: 'sakla',
    kick: 'tekmele',
    kill: 'öldür',
    kiss: 'öp',
    know: 'bil',
    knock: 'vur',
    lack: 'eksik ol',
    land: 'iniş yap',
    last: 'sür',
    laugh: 'gül',
    launch: 'başlat',
    learn: 'öğren',
    leave: 'ayrıl',
    lend: 'ödünç ver',
    let: 'izin ver',
    lie: 'yalan söyle',
    lift: 'kaldır',
    like: 'sev',
    limit: 'sınırla',
    link: 'bağla',
    list: 'listele',
    listen: 'dinle',
    live: 'yaşa',
    lock: 'kilitle',
    look: 'bak',
    lose: 'kaybet',
    love: 'sev',
    make: 'yap',
    manage: 'yönet',
    mark: 'işaretle',
    marry: 'evlen',
    match: 'eşleştir',
    matter: 'önemli ol',
    mean: 'anlamına gel',
    measure: 'ölç',
    meet: 'tanış',
    mention: 'bahset',
    mind: 'önemse',
    miss: 'özle',
    mix: 'karıştır',
    move: 'taşın',
    name: 'adlandır',
    need: 'ihtiyaç duy',
    nod: 'baş sall',
    note: 'not et',
    notice: 'fark et',
    obey: 'itaat et',
    obtain: 'elde et',
    occur: 'meydana gel',
    offer: 'teklif et',
    open: 'aç',
    operate: 'işlet',
    order: 'sipariş et',
    organize: 'organize et',
    own: 'sahip ol',
    pack: 'paketle',
    paint: 'boya',
    park: 'park et',
    pass: 'geç',
    pause: 'durakla',
    pay: 'öde',
    perform: 'perform et',
    permit: 'izin ver',
    pick: 'seç',
    place: 'yerleştir',
    plan: 'planla',
    plant: 'ek',
    play: 'oyna',
    please: 'memnun et',
    plug: 'fişe tak',
    point: 'işaret et',
    polish: 'parlat',
    post: 'gönder',
    pour: 'dök',
    practice: 'pratik yap',
    prefer: 'tercih et',
    prepare: 'hazırla',
    present: 'sun',
    press: 'bas',
    pretend: 'mış gibi yap',
    prevent: 'önle',
    print: 'yazdır',
    produce: 'üret',
    promise: 'söz ver',
    protect: 'koru',
    provide: 'sağla',
    publish: 'yayınla',
    pull: 'çek',
    push: 'it',
    put: 'koy',
    question: 'sorgula',
    race: 'yarış',
    rain: 'yağmur yağ',
    raise: 'yükselt',
    reach: 'ulaş',
    read: 'oku',
    realize: 'fark et',
    receive: 'al',
    recognize: 'tanı',
    recommend: 'öner',
    record: 'kayıt et',
    recover: 'iyileş',
    reduce: 'azalt',
    refer: 'atıf yap',
    reflect: 'yansıt',
    refuse: 'reddet',
    regret: 'pişman ol',
    reject: 'reddet',
    relax: 'rahatla',
    release: 'serbest bırak',
    rely: 'güven',
    remain: 'kal',
    remember: 'hatırla',
    remind: 'hatırlat',
    remove: 'çıkar',
    rent: 'kirala',
    repair: 'tamir et',
    repeat: 'tekrarla',
    replace: 'değiştir',
    reply: 'yanıtla',
    report: 'rapor et',
    request: 'talep et',
    require: 'gerektir',
    rescue: 'kurtar',
    research: 'araştır',
    reserve: 'rezerve et',
    resist: 'diren',
    resolve: 'çöz',
    respect: 'saygı duy',
    respond: 'yanıt ver',
    rest: 'dinlen',
    return: 'geri dön',
    reveal: 'ortaya çıkar',
    review: 'gözden geçir',
    ride: 'bin',
    ring: 'çala',
    rise: 'yüksel',
    roll: 'yuvarla',
    rub: 'ov',
    rule: 'yönet',
    run: 'koş',
    rush: 'acele et',
    save: 'biriktir',
    say: 'söyle',
    scare: 'korkut',
    scratch: 'tırmala',
    scream: 'çığlık at',
    search: 'ara',
    see: 'gör',
    sell: 'sat',
    send: 'gönder',
    sense: 'hisset',
    separate: 'ayır',
    serve: 'servis et',
    set: 'ayarla',
    share: 'paylaş',
    shave: 'tıraş ol',
    shop: 'alışveriş yap',
    show: 'göster',
    shut: 'kapat',
    sing: 'şarkı söyle',
    sit: 'otur',
    ski: 'kayak yap',
    sleep: 'uyu',
    slip: 'kay',
    slow: 'yavaşla',
    smile: 'gülümse',
    smoke: 'sigara iç',
    snow: 'kar yağ',
    solve: 'çöz',
    sound: 'kulağa gel',
    speak: 'konuş',
    spend: 'harca',
    stand: 'ayakta dur',
    start: 'başla',
    stay: 'kal',
    step: 'adım at',
    stop: 'dur',
    store: 'sakla',
    stretch: 'ger',
    study: 'çalış',
    succeed: 'başar',
    suffer: 'acı çek',
    suggest: 'öner',
    supply: 'tedarik et',
    support: 'destekle',
    suppose: 'varsay',
    surprise: 'şaşırt',
    surround: 'çevrele',
    survive: 'hayatta kal',
    suspect: 'şüphelen',
    switch: 'değiştir',
    take: 'al',
    talk: 'konuş',
    taste: 'tadına bak',
    teach: 'öğret',
    tell: 'söyle',
    test: 'test et',
    thank: 'teşekkür et',
    think: 'düşün',
    throw: 'fırlat',
    tie: 'bağla',
    tip: 'bahşiş ver',
    tire: 'yor',
    touch: 'dokun',
    tour: 'gez',
    trace: 'izle',
    trade: 'ticaret yap',
    train: 'eğit',
    transfer: 'transfer et',
    translate: 'çevir',
    transport: 'taşı',
    trap: 'tuzak kur',
    travel: 'seyahat et',
    treat: 'davran',
    trust: 'güven',
    try: 'dene',
    turn: 'çevir',
    type: 'yaz',
    understand: 'anla',
    unite: 'birleştir',
    unlock: 'kilidini aç',
    update: 'güncelle',
    upload: 'yükle',
    urge: 'teşvik et',
    use: 'kullan',
    value: 'değer ver',
    vary: 'değiş',
    visit: 'ziyaret et',
    vote: 'oy ver',
    wait: 'bekle',
    walk: 'yürü',
    want: 'iste',
    warm: 'ısın',
    warn: 'uyar',
    wash: 'yıka',
    waste: 'israf et',
    watch: 'izle',
    water: 'sula',
    wave: 'el salla',
    welcome: 'karşıla',
    whisper: 'fısılda',
    win: 'kazan',
    wish: 'dile',
    wonder: 'merak et',
    work: 'çalış',
    worry: 'endişelen',
    wrap: 'sar',
    write: 'yaz',
    yell: 'bağır',
    zoom: 'yakınlaştır'
};

const verbSynonyms = {"accept": ["admit", "bear", "have", "take"], "achieve": ["reach"], "act": ["do", "move", "play", "pretend", "represent", "work"], "add": ["bring", "lend", "supply"], "admit": ["accept", "allow", "hold", "include", "take"], "advise": ["suggest"], "afford": ["give", "open"], "agree": ["check", "hold", "match"], "allow": ["admit", "leave", "let", "permit", "provide", "reserve"], "announce": ["declare"], "answer": ["do", "reply", "resolve", "respond", "serve"], "apologize": ["excuse"], "appear": ["look"], "apply": ["employ", "give", "hold", "practice", "use"], "argue": ["indicate"], "arise": ["develop", "grow", "rise"], "arrange": ["do", "dress", "order", "put", "set"], "arrive": ["come", "get"], "ask": ["demand", "expect", "involve", "need", "require", "take"], "attempt": ["seek", "try", "undertake"], "attend": ["hang", "look", "see", "serve"], "awake": ["wake"], "be": ["cost", "exist", "follow", "live", "represent"], "bear": ["accept", "carry", "contain", "deliver", "expect", "have", "hold", "pay", "stand", "suffer", "support", "wear"], "beat": ["get", "stick"], "become": ["get", "go", "turn"], "begin": ["get", "start"], "believe": ["consider", "think", "trust"], "belong": ["go"], "bend": ["turn"], "bet": ["calculate", "count", "depend", "look", "play"], "bid": ["call", "invite", "offer", "press", "wish"], "bind": ["hold", "stick", "tie"], "bite": ["burn", "sting"], "blame": ["pick"], "bleed": ["run"], "bless": ["sign"], "blow": ["spoil", "waste"], "book": ["hold", "reserve"], "break": ["burst", "check", "develop", "die", "discover", "fail", "give", "go", "interrupt", "pause", "reveal", "ruin", "separate", "split", "stop", "wear"], "breathe": ["rest"], "breed": ["cover"], "bring": ["add", "get", "land", "lend", "play", "take", "work"], "broadcast": ["send", "spread"], "brush": ["sweep"], "build": ["establish", "make"], "burn": ["bite", "cut", "fire", "sting"], "burst": ["break", "split"], "bury": ["forget", "sink"], "calculate": ["bet", "count", "depend", "forecast", "look"], "call": ["bid", "cry", "name", "promise", "ring", "scream", "shout", "visit", "yell"], "cancel": ["scratch"], "care": ["deal", "handle", "like", "manage", "wish", "worry"], "carry": ["bear", "contain", "expect", "express", "extend", "hold", "pack", "post", "run", "take", "transport"], "catch": ["get", "grab", "overtake", "see", "watch"], "cause": ["do", "get", "have", "make"], "celebrate": ["keep", "observe"], "change": ["switch", "transfer", "vary"], "check": ["agree", "break", "contain", "control", "delay", "hold", "learn", "mark", "match", "see", "stop", "train", "watch"], "cheer": ["urge"], "choose": ["prefer", "select", "take"], "clean": ["pick"], "clear": ["earn", "gain", "make", "pass", "realize", "solve"], "climb": ["rise"], "cling": ["hang", "stick"], "close": ["shut"], "collect": ["gather"], "combine": ["mix", "unite"], "come": ["arrive", "do", "fall", "follow", "get", "occur"], "comment": ["notice"], "commit": ["give", "invest", "place", "practice", "pull", "put", "send", "trust"], "communicate": ["pass"], "complain": ["kick"], "complete": ["finish"], "concentrate": ["focus", "reduce"], "concern": ["interest", "refer", "relate", "touch", "worry"], "confirm": ["support"], "confuse": ["throw"], "connect": ["join", "link", "relate", "tie", "unite"], "consider": ["believe", "count", "deal", "see", "study", "take", "think", "weigh"], "contain": ["bear", "carry", "check", "control", "hold", "stop", "take"], "continue": ["cover", "extend", "keep", "remain", "stay"], "control": ["check", "contain", "hold", "operate", "see"], "cook": ["fix", "make", "prepare"], "correct": ["set"], "cost": ["be"], "count": ["bet", "calculate", "consider", "depend", "look", "matter", "weigh"], "cover": ["breed", "continue", "cross", "deal", "extend", "handle", "hide", "report", "treat"], "create": ["make", "produce"], "cross": ["cover", "spoil", "sweep"], "cry": ["call", "scream", "shout", "weep", "yell"], "cut": ["burn", "edit", "ignore", "reduce"], "deal": ["care", "consider", "cover", "handle", "manage", "sell", "share", "take", "trade", "treat"], "decide": ["resolve", "settle"], "declare": ["announce", "hold"], "decorate": ["dress"], "delay": ["check", "stay"], "deliver": ["bear", "have", "present", "rescue", "return", "save"], "demand": ["ask", "involve", "need", "require", "take"], "deny": ["refuse"], "depend": ["bet", "calculate", "count", "look"], "describe": ["discover", "draw", "identify", "name", "report", "trace"], "design": ["plan"], "desire": ["hope", "trust", "want"], "destroy": ["ruin"], "develop": ["arise", "break", "educate", "get", "grow", "prepare", "produce", "rise", "train"], "die": ["break", "fail", "go", "pass"], "dig": ["grind"], "discover": ["break", "describe", "find", "hear", "identify", "learn", "name", "notice", "observe", "reveal", "see", "strike"], "divide": ["separate", "split"], "do": ["act", "answer", "arrange", "cause", "come", "dress", "exercise", "make", "manage", "perform", "practice", "serve", "set"], "drag": ["draw", "sweep"], "draw": ["describe", "drag", "force", "get", "guide", "make", "pass", "pull", "run", "string", "tie", "trace", "withdraw"], "dress": ["arrange", "decorate", "do", "set"], "drive": ["force", "get", "push", "ride", "take"], "drop": ["miss", "shed", "sink", "spend", "swing", "throw"], "dwell": ["lie", "live"], "earn": ["clear", "gain", "make", "realize"], "eat": ["feed"], "edit": ["cut"], "educate": ["develop", "prepare", "train"], "employ": ["apply", "hire", "use"], "end": ["finish", "stop"], "enjoy": ["love"], "enter": ["introduce", "record"], "entertain": ["hold"], "escape": ["miss", "run"], "establish": ["build", "give", "install", "launch", "make", "plant", "prove", "show"], "evaluate": ["judge", "measure", "value"], "examine": ["prove", "see", "study", "test", "try"], "excite": ["shake"], "excuse": ["apologize", "explain"], "exercise": ["do", "practice", "work"], "exist": ["be", "live", "survive"], "expand": ["extend"], "expect": ["ask", "bear", "carry", "look", "require", "wait"], "experience": ["feel", "get", "have", "know", "live", "receive", "see"], "explain": ["excuse"], "explore": ["research", "search"], "express": ["carry", "show"], "extend": ["carry", "continue", "cover", "expand", "go", "lead", "offer", "pass", "run", "stretch"], "face": ["look", "present"], "fail": ["break", "die", "go"], "fall": ["come", "flow", "hang", "light", "pass", "return", "settle", "shine", "strike"], "fancy": ["see"], "feed": ["eat", "flow", "give", "run"], "feel": ["experience", "find", "sense"], "fight": ["press", "push"], "fill": ["meet", "satisfy", "take"], "film": ["shoot", "take"], "find": ["discover", "feel", "get", "happen", "notice", "observe", "obtain", "receive", "recover", "rule", "see"], "finish": ["complete", "end", "stop"], "fire": ["burn", "raise"], "fix": ["cook", "get", "limit", "make", "prepare", "repair", "set"], "flee": ["fly"], "flow": ["fall", "feed", "hang", "run"], "fly": ["flee"], "focus": ["concentrate"], "follow": ["be", "come", "observe", "succeed", "trace", "watch"], "forbid": ["prevent"], "force": ["draw", "drive", "pull", "push", "thrust"], "forecast": ["calculate"], "forget": ["bury", "leave"], "form": ["make", "organize", "spring", "work"], "frighten": ["scare"], "gain": ["clear", "earn", "gather", "hit", "make", "reach", "realize", "win"], "gather": ["collect", "gain", "meet"], "get": ["arrive", "beat", "become", "begin", "bring", "catch", "cause", "come", "develop", "draw", "drive", "experience", "find", "fix", "go", "grow", "have", "let", "make", "obtain", "produce", "receive", "start", "stick", "suffer", "take"], "give": ["afford", "apply", "break", "commit", "establish", "feed", "have", "hold", "leave", "make", "open", "pass", "pay", "present", "reach", "return", "throw"], "go": ["become", "belong", "break", "die", "extend", "fail", "get", "last", "lead", "live", "move", "operate", "pass", "run", "sound", "start", "survive", "travel", "work"], "grab": ["catch"], "greet": ["recognize"], "grind": ["dig"], "grow": ["arise", "develop", "get", "produce", "raise", "rise", "turn"], "guess": ["imagine", "judge", "pretend", "suppose", "think"], "guide": ["draw", "lead", "pass", "point", "run", "take"], "handle": ["care", "cover", "deal", "manage", "treat"], "hang": ["attend", "cling", "fall", "flow"], "happen": ["find", "occur", "pass"], "have": ["accept", "bear", "cause", "deliver", "experience", "get", "give", "hold", "let", "make", "own", "receive", "suffer", "take", "throw"], "hear": ["discover", "learn", "listen", "see", "try"], "help": ["serve"], "hide": ["cover"], "hire": ["employ", "rent", "take"], "hit": ["gain", "make", "murder", "reach", "remove", "shoot", "strike"], "hold": ["admit", "agree", "apply", "bear", "bind", "book", "carry", "check", "contain", "control", "declare", "entertain", "give", "have", "keep", "maintain", "make", "obtain", "reserve", "support", "take", "throw", "withstand"], "hope": ["desire", "trust"], "hunt": ["run", "trace"], "hurry": ["rush", "speed"], "hurt": ["injure", "suffer"], "identify": ["describe", "discover", "name", "place"], "ignore": ["cut"], "imagine": ["guess", "suppose", "think"], "impress": ["move", "print", "strike"], "include": ["admit"], "indicate": ["argue", "point", "show", "suggest"], "influence": ["work"], "injure": ["hurt"], "install": ["establish"], "intend": ["mean", "think"], "interest": ["concern", "worry"], "interrupt": ["break"], "introduce": ["enter", "present"], "invest": ["commit", "place", "put"], "invite": ["bid", "receive"], "involve": ["ask", "demand", "need", "require", "take"], "iron": ["press"], "join": ["connect", "link", "unite"], "judge": ["evaluate", "guess", "try"], "jump": ["leap", "rise", "spring", "start"], "keep": ["celebrate", "continue", "hold", "maintain", "observe", "prevent", "save"], "kick": ["complain"], "know": ["experience", "live", "love", "recognize"], "lack": ["miss"], "land": ["bring"], "last": ["go", "live", "survive"], "launch": ["establish"], "lay": ["place", "put", "set"], "lead": ["extend", "go", "guide", "leave", "pass", "result", "run", "take"], "lean": ["list", "run", "tend", "tip"], "leap": ["jump", "spring"], "learn": ["check", "discover", "hear", "read", "see", "study", "take", "teach", "watch"], "leave": ["allow", "forget", "give", "lead", "provide", "result"], "lend": ["add", "bring"], "let": ["allow", "get", "have", "permit", "rent"], "lie": ["dwell", "rest"], "light": ["fall"], "like": ["care", "wish"], "limit": ["fix", "set"], "link": ["connect", "join", "relate", "tie", "unite"], "list": ["lean", "name"], "listen": ["hear", "mind"], "live": ["be", "dwell", "exist", "experience", "go", "know", "last", "survive"], "load": ["stretch"], "lock": ["operate"], "look": ["appear", "attend", "bet", "calculate", "count", "depend", "expect", "face", "search", "see", "wait"], "lose": ["miss", "suffer"], "love": ["enjoy", "know"], "maintain": ["hold", "keep", "observe"], "make": ["build", "cause", "clear", "cook", "create", "do", "draw", "earn", "establish", "fix", "form", "gain", "get", "give", "have", "hit", "hold", "name", "prepare", "pretend", "produce", "reach", "realize", "take", "throw", "work"], "manage": ["care", "deal", "do", "handle"], "mark": ["check", "note", "notice", "set"], "marry": ["tie"], "match": ["agree", "check", "meet", "touch"], "matter": ["count", "weigh"], "mean": ["intend", "think"], "measure": ["evaluate", "value"], "meet": ["fill", "gather", "match", "play", "receive", "satisfy", "see", "suffer", "touch"], "mention": ["name", "note", "observe", "refer"], "mind": ["listen"], "miss": ["drop", "escape", "lack", "lose"], "mistake": ["slip"], "mix": ["combine"], "move": ["act", "go", "impress", "run", "strike", "travel"], "murder": ["hit", "remove"], "name": ["call", "describe", "discover", "identify", "list", "make", "mention", "refer"], "need": ["ask", "demand", "involve", "require", "take", "want"], "note": ["mark", "mention", "notice", "observe"], "notice": ["comment", "discover", "find", "mark", "note", "observe"], "observe": ["celebrate", "discover", "find", "follow", "keep", "maintain", "mention", "note", "notice", "respect", "watch"], "obtain": ["find", "get", "hold", "receive"], "occur": ["come", "happen", "pass"], "offer": ["bid", "extend", "provide"], "open": ["afford", "give", "spread"], "operate": ["control", "go", "lock", "run", "work"], "order": ["arrange", "place", "put", "say", "tell"], "organize": ["form", "prepare"], "overcome": ["overtake"], "overtake": ["catch", "overcome", "pass"], "own": ["have"], "pack": ["carry", "take"], "pass": ["clear", "communicate", "die", "draw", "extend", "fall", "give", "go", "guide", "happen", "lead", "occur", "overtake", "reach", "return", "run", "sink", "spend"], "pause": ["break"], "pay": ["bear", "give"], "perform": ["do"], "permit": ["allow", "let"], "pick": ["blame", "clean"], "place": ["commit", "identify", "invest", "lay", "order", "point", "post", "put", "send", "set"], "plan": ["design"], "plant": ["establish", "set"], "play": ["act", "bet", "bring", "meet", "represent", "run", "work"], "plug": ["punch"], "point": ["guide", "indicate", "place", "show"], "polish": ["shine"], "post": ["carry", "place", "send"], "practice": ["apply", "commit", "do", "exercise", "use"], "prefer": ["choose"], "prepare": ["cook", "develop", "educate", "fix", "make", "organize", "set", "train"], "present": ["deliver", "face", "give", "introduce", "represent", "show"], "press": ["bid", "fight", "iron", "push", "urge", "weigh"], "pretend": ["act", "guess", "make"], "prevent": ["forbid", "keep"], "print": ["impress", "publish"], "process": ["serve", "treat", "work"], "produce": ["create", "develop", "get", "grow", "make", "raise"], "promise": ["call"], "prove": ["establish", "examine", "raise", "rise", "show", "test", "try"], "provide": ["allow", "leave", "offer", "supply"], "publish": ["print", "release", "write"], "pull": ["commit", "draw", "force", "tear"], "punch": ["plug"], "push": ["drive", "fight", "force", "press"], "put": ["arrange", "commit", "invest", "lay", "order", "place", "set"], "question": ["wonder"], "quit": ["stop"], "race": ["run", "rush", "speed"], "raise": ["fire", "grow", "produce", "prove", "upgrade"], "reach": ["achieve", "gain", "give", "hit", "make", "pass", "strive", "touch"], "react": ["respond"], "read": ["learn", "record", "say", "show", "study", "take", "translate", "understand"], "realize": ["clear", "earn", "gain", "make", "recognize", "see", "understand"], "receive": ["experience", "find", "get", "have", "invite", "meet", "obtain", "welcome"], "recognize": ["greet", "know", "realize", "spot"], "recommend": ["urge"], "record": ["enter", "read", "show"], "recover": ["find"], "reduce": ["concentrate", "cut", "shrink"], "refer": ["concern", "mention", "name", "relate", "touch"], "reflect": ["shine"], "refuse": ["deny", "reject", "resist"], "reject": ["refuse", "resist"], "relate": ["concern", "connect", "link", "refer", "touch"], "release": ["publish", "turn"], "rely": ["swear", "trust"], "remain": ["continue", "rest", "stay"], "remember": ["think"], "remove": ["hit", "murder", "take", "transfer", "withdraw"], "rent": ["hire", "let", "take"], "repair": ["fix"], "reply": ["answer", "respond"], "report": ["cover", "describe"], "represent": ["act", "be", "play", "present"], "require": ["ask", "demand", "expect", "involve", "need", "take", "want"], "rescue": ["deliver"], "research": ["explore", "search"], "reserve": ["allow", "book", "hold"], "resist": ["refuse", "reject", "stand", "withstand"], "resolve": ["answer", "decide", "settle", "solve"], "respect": ["observe", "value"], "respond": ["answer", "react", "reply"], "rest": ["breathe", "lie", "remain", "stay"], "result": ["lead", "leave"], "retire": ["withdraw"], "return": ["deliver", "fall", "give", "pass"], "reveal": ["break", "discover"], "ride": ["drive", "sit"], "ring": ["call", "surround"], "rise": ["arise", "climb", "develop", "grow", "jump", "prove"], "roll": ["wave", "wind", "wrap"], "rub": ["scratch"], "ruin": ["break", "destroy"], "rule": ["find"], "run": ["bleed", "carry", "draw", "escape", "extend", "feed", "flow", "go", "guide", "hunt", "lead", "lean", "move", "operate", "pass", "play", "race", "tend", "work"], "rush": ["hurry", "race", "speed"], "satisfy": ["fill", "meet"], "save": ["deliver", "keep", "spare", "write"], "say": ["order", "read", "suppose", "tell"], "scare": ["frighten"], "scratch": ["cancel", "rub", "strike"], "scream": ["call", "cry", "shout", "yell"], "search": ["explore", "look", "research", "seek"], "see": ["attend", "catch", "check", "consider", "control", "discover", "examine", "experience", "fancy", "find", "hear", "learn", "look", "meet", "realize", "understand", "visit", "watch"], "seek": ["attempt", "search", "try"], "select": ["choose", "take"], "sell": ["deal", "trade"], "send": ["broadcast", "commit", "place", "post", "transport"], "sense": ["feel", "smell"], "separate": ["break", "divide", "sort", "split", "tell"], "serve": ["answer", "attend", "do", "help", "process"], "set": ["arrange", "correct", "do", "dress", "fix", "lay", "limit", "mark", "place", "plant", "prepare", "put"], "settle": ["decide", "fall", "resolve", "sink"], "shake": ["excite"], "share": ["deal"], "shed": ["drop", "spill", "throw"], "shine": ["fall", "polish", "reflect", "strike"], "shoot": ["film", "hit", "take", "tear"], "shout": ["call", "cry", "scream", "yell"], "show": ["establish", "express", "indicate", "point", "present", "prove", "read", "record"], "shrink": ["reduce"], "shut": ["close"], "sign": ["bless"], "sing": ["talk"], "sink": ["bury", "drop", "pass", "settle"], "sit": ["ride"], "slide": ["slip"], "slip": ["mistake", "slide", "steal"], "smell": ["sense"], "solve": ["clear", "resolve", "work"], "sort": ["separate"], "sound": ["go"], "spare": ["save"], "speak": ["talk"], "speed": ["hurry", "race", "rush"], "spell": ["write"], "spend": ["drop", "pass"], "spill": ["shed", "talk"], "split": ["break", "burst", "divide", "separate"], "spoil": ["blow", "cross"], "spot": ["recognize"], "spread": ["broadcast", "open"], "spring": ["form", "jump", "leap"], "stand": ["bear", "resist", "suffer", "support"], "start": ["begin", "get", "go", "jump"], "stay": ["continue", "delay", "remain", "rest", "stick"], "steal": ["slip"], "step": ["tread"], "stick": ["beat", "bind", "cling", "get", "stay", "sting"], "sting": ["bite", "burn", "stick"], "stop": ["break", "check", "contain", "end", "finish", "quit"], "stretch": ["extend", "load"], "strike": ["discover", "fall", "hit", "impress", "move", "scratch", "shine", "take"], "string": ["draw"], "strive": ["reach"], "study": ["consider", "examine", "learn", "read", "take"], "succeed": ["follow", "win"], "suffer": ["bear", "get", "have", "hurt", "lose", "meet", "stand", "support"], "suggest": ["advise", "indicate"], "supply": ["add", "provide"], "support": ["bear", "confirm", "hold", "stand", "suffer"], "suppose": ["guess", "imagine", "say", "think"], "surround": ["ring"], "survive": ["exist", "go", "last", "live"], "swear": ["rely", "trust"], "sweep": ["brush", "cross", "drag", "swing"], "swing": ["drop", "sweep"], "switch": ["change", "throw", "trade"], "take": ["accept", "admit", "ask", "bring", "carry", "choose", "consider", "contain", "deal", "demand", "drive", "fill", "film", "get", "guide", "have", "hire", "hold", "involve", "lead", "learn", "make", "need", "pack", "read", "remove", "rent", "require", "select", "shoot", "strike", "study", "train", "withdraw"], "talk": ["sing", "speak", "spill"], "taste": ["try"], "teach": ["learn"], "tear": ["pull", "shoot"], "tell": ["order", "say", "separate"], "tend": ["lean", "run"], "test": ["examine", "prove", "try"], "think": ["believe", "consider", "guess", "imagine", "intend", "mean", "remember", "suppose"], "throw": ["confuse", "drop", "give", "have", "hold", "make", "shed", "switch", "thrust"], "thrust": ["force", "throw"], "tie": ["bind", "connect", "draw", "link", "marry"], "tip": ["lean"], "tire": ["wear"], "touch": ["concern", "match", "meet", "reach", "refer", "relate"], "trace": ["describe", "draw", "follow", "hunt"], "trade": ["deal", "sell", "switch"], "train": ["check", "develop", "educate", "prepare", "take"], "transfer": ["change", "remove", "transport"], "translate": ["read", "understand"], "transport": ["carry", "send", "transfer"], "travel": ["go", "move", "trip"], "tread": ["step"], "treat": ["cover", "deal", "handle", "process"], "trip": ["travel"], "trouble": ["upset"], "trust": ["believe", "commit", "desire", "hope", "rely", "swear"], "try": ["attempt", "examine", "hear", "judge", "prove", "seek", "taste", "test"], "turn": ["become", "bend", "grow", "release", "work"], "understand": ["read", "realize", "see", "translate"], "undertake": ["attempt"], "unite": ["combine", "connect", "join", "link"], "upgrade": ["raise"], "upset": ["trouble"], "urge": ["cheer", "press", "recommend"], "use": ["apply", "employ", "practice"], "value": ["evaluate", "measure", "respect"], "vary": ["change"], "visit": ["call", "see"], "wait": ["expect", "look"], "wake": ["awake"], "want": ["desire", "need", "require"], "waste": ["blow"], "watch": ["catch", "check", "follow", "learn", "observe", "see"], "wave": ["roll"], "wear": ["bear", "break", "tire"], "weave": ["wind"], "weep": ["cry"], "weigh": ["consider", "count", "matter", "press"], "welcome": ["receive"], "win": ["gain", "succeed"], "wind": ["roll", "weave", "wrap"], "wish": ["bid", "care", "like"], "withdraw": ["draw", "remove", "retire", "take"], "withstand": ["hold", "resist"], "wonder": ["question"], "work": ["act", "bring", "exercise", "form", "go", "influence", "make", "operate", "play", "process", "run", "solve", "turn"], "worry": ["care", "concern", "interest"], "wrap": ["roll", "wind"], "write": ["publish", "save", "spell"], "yell": ["call", "cry", "scream", "shout"]};

// ===== TIMELINE ANİMASYON SİSTEMİ =====

// Daktilo efekti - harf harf yazma
function typewriterEffect(element, text, speed = 80) {
    return new Promise((resolve) => {
        element.textContent = '';
        element.classList.add('typing');
        let i = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
                resolve();
            }
        }
        type();
    });
}

// Marker'ı belirtilen noktaya taşı
function moveMarker(container, pointIndex) {
    const marker = container.querySelector('.timeline-marker');
    const points = container.querySelectorAll('.timeline-point');
    const totalPoints = points.length;

    // Pozisyon hesapla: %10'dan başlayıp %90'da bitecek şekilde
    const startPercent = 10;
    const endPercent = 90;
    const range = endPercent - startPercent;
    const position = startPercent + (pointIndex / (totalPoints - 1)) * range;

    marker.style.left = position + '%';
    marker.classList.add('animating');
    setTimeout(() => marker.classList.remove('animating'), 500);
}

// Tek bir noktayı aktifleştir ve fiili yaz
async function activatePoint(container, pointIndex, verbForm) {
    const points = container.querySelectorAll('.timeline-point');

    // Önceki aktif noktaları temizle
    points.forEach(p => p.classList.remove('active'));

    // Yeni noktayı aktifleştir
    const point = points[pointIndex];
    point.classList.add('active');

    // Marker'ı taşı
    moveMarker(container, pointIndex);

    // Fiili daktilo efektiyle yaz (daha yavaş: 100ms per character)
    const verbElement = point.querySelector('.point-verb');
    await typewriterEffect(verbElement, verbForm, 100);

    // 5 saniye bekle (nokta başına)
    await new Promise(resolve => setTimeout(resolve, 5000));
}

// Bir sütunun timeline animasyonunu çalıştır
async function animateColumnTimeline(column, verbs) {
    const container = document.querySelector(`.${column}-column .timeline-container`);
    if (!container) return;

    // Tüm noktaları sırayla animasyonla
    for (let i = 0; i < verbs.length; i++) {
        await activatePoint(container, i, verbs[i]);
    }
}

// Tüm timeline'ları aynı anda animasyonla (paralel) - tek seferlik
async function animateAllTimelinesOnce(conjugation) {
    // Her sütun için fiil formlarını hazırla
    const pastVerbs = [
        conjugation.v2,           // Simple Past: played
        conjugation.ing,          // Past Continuous: playing
        conjugation.v3,           // Past Perfect: played
        conjugation.ing           // Past Perfect Continuous: playing
    ];

    const presentVerbs = [
        conjugation.v1,           // Simple Present: play
        conjugation.ing,          // Present Continuous: playing
        conjugation.v3,           // Present Perfect: played
        conjugation.ing           // Present Perfect Continuous: playing
    ];

    const futureVerbs = [
        conjugation.v1,           // Simple Future: play
        conjugation.ing,          // Future Continuous: playing
        conjugation.v3,           // Future Perfect: played
        conjugation.ing           // Future Perfect Continuous: playing
    ];

    // Önce tüm timeline'ları temizle
    resetAllTimelines();

    // Kısa gecikme ile animasyonları başlat (görsel efekt için)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Üç sütunu paralel olarak animasyonla
    await Promise.all([
        animateColumnTimeline('past', pastVerbs),
        animateColumnTimeline('present', presentVerbs),
        animateColumnTimeline('future', futureVerbs)
    ]);
}

// Sonsuz döngüde timeline animasyonu
async function animateAllTimelines(conjugation) {
    // Önceki döngüyü durdur
    timelineLoopActive = false;

    // Kısa bekle (önceki döngünün durması için)
    await new Promise(resolve => setTimeout(resolve, 100));

    if (timelineAnimationRunning) return;
    timelineAnimationRunning = true;
    timelineLoopActive = true;
    currentConjugation = conjugation;

    // Sonsuz döngü başlat
    while (timelineLoopActive) {
        await animateAllTimelinesOnce(conjugation);

        // Döngü arasında 2 saniye bekle
        if (timelineLoopActive) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    timelineAnimationRunning = false;
}

// Timeline animasyonunu durdur
function stopTimelineAnimation() {
    timelineLoopActive = false;
}

function updateTenseStrip(conjugation) {
    const pastEl = document.getElementById('tensePast');
    const presentEl = document.getElementById('tensePresent');
    const futureEl = document.getElementById('tenseFuture');

    if (pastEl) pastEl.textContent = conjugation.v2;
    if (presentEl) presentEl.textContent = conjugation.v1;
    if (futureEl) futureEl.textContent = `will ${conjugation.v1}`;
}

// Tüm timeline'ları sıfırla
function resetAllTimelines() {
    const containers = document.querySelectorAll('.timeline-container');

    containers.forEach(container => {
        const points = container.querySelectorAll('.timeline-point');
        const marker = container.querySelector('.timeline-marker');

        // Tüm noktaları pasifleştir
        points.forEach(point => {
            point.classList.remove('active');
            const verbElement = point.querySelector('.point-verb');
            verbElement.textContent = '';
            verbElement.classList.remove('typing');
        });

        // Marker'ı başa al
        marker.style.left = '10%';
    });
}

function getVerbData(verb) {
    // Verb database'den bul
    const found = findVerb(verb);
    if (found) {
        return found;
    }

    // Bulunamadıysa düzenli fiil olarak çek
    return null;
}

// ===== FİİL ÇEKİM FONKSİYONLARI =====

// Düzenli fiilleri çekimi
function conjugateRegularVerb(v1) {
    const ing = v1.endsWith('e') ? v1.slice(0, -1) + 'ing' : v1 + 'ing';
    const thirdPerson = v1.endsWith('s') || v1.endsWith('x') || v1.endsWith('z') || v1.endsWith('ch') || v1.endsWith('sh')
        ? v1 + 'es'
        : v1 + 's';

    return {
        v1: v1,
        v2: v1 + 'ed',
        v3: v1 + 'ed',
        ing: ing,
        thirdPerson: thirdPerson
    };
}

// Fiil çekimini belirle (V1, V2, V3'ü kullanarak)
function conjugateVerb(input) {
    const lowerInput = input.toLowerCase().trim();

    // Verb database'den bul
    let verbData = findVerb(lowerInput);

    if (verbData) {
        // Düzensiz fiil bulundu
        const ing = verbData.v1.endsWith('e')
            ? verbData.v1.slice(0, -1) + 'ing'
            : verbData.v1 + 'ing';
        const thirdPerson = verbData.v1.endsWith('s') || verbData.v1.endsWith('x') || verbData.v1.endsWith('z') || verbData.v1.endsWith('ch') || verbData.v1.endsWith('sh')
            ? verbData.v1 + 'es'
            : verbData.v1 + 's';

        return {
            v1: verbData.v1,
            v2: verbData.v2,
            v3: verbData.v3,
            ing: ing,
            thirdPerson: thirdPerson
        };
    }

    // Düzenli fiil çekimi (V1'i belirle)
    return conjugateRegularVerb(lowerInput);
}

// ===== SENTENCE STRUCTURE (Cümle Yapısı) =====

// Cümle bileşeni oluştur
function createSentencePart(type, value, label) {
    return `
        <div class="sentence-part part-${type}">
            <span class="part-value">${value}</span>
            <span class="part-label">${label}</span>
        </div>
    `;
}

// Artı işareti ekle
function createPlus() {
    return '<span class="sentence-plus">+</span>';
}

// Tense yapılarını tanımla
function getUserContext() {
    const objectEn = (document.getElementById('objectInput')?.value || '').trim();
    const objectTr = (document.getElementById('objectTrInput')?.value || '').trim();
    const timeEn = (document.getElementById('timeInput')?.value || '').trim();
    const timeTr = (document.getElementById('timeTrInput')?.value || '').trim();
    const verbTr = (document.getElementById('verbTrInput')?.value || '').trim();
    const youForm = (document.getElementById('youForm')?.value || 'sen').trim();

    return {
        objectEn,
        objectTr,
        timeEn,
        timeTr,
        verbTr,
        youForm
    };
}

function getSentenceStructures(conjugation, context) {
    const objectEn = context.objectEn || defaultObjectEn;
    const objectTr = context.objectTr || defaultObjectTr;

    return {
        // PAST TENSES
        'simple-past': {
            subject: 'I',
            auxiliary: null,
            verb: conjugation.v2,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['simple-past'],
            timeTr: context.timeTr || timeExpressionsTr['simple-past']
        },
        'past-continuous-1': {
            subject: 'I',
            auxiliary: 'was',
            verb: conjugation.ing,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['past-continuous-1'],
            timeTr: context.timeTr || timeExpressionsTr['past-continuous-1']
        },
        'past-continuous-2': {
            subject: 'They',
            auxiliary: 'were',
            verb: conjugation.ing,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['past-continuous-2'],
            timeTr: context.timeTr || timeExpressionsTr['past-continuous-2']
        },
        'past-perfect': {
            subject: 'I',
            auxiliary: 'had',
            verb: conjugation.v3,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['past-perfect'],
            timeTr: context.timeTr || timeExpressionsTr['past-perfect']
        },
        'past-perfect-continuous': {
            subject: 'I',
            auxiliary: 'had been',
            verb: conjugation.ing,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['past-perfect-continuous'],
            timeTr: context.timeTr || timeExpressionsTr['past-perfect-continuous']
        },

        // PRESENT TENSES
        'simple-present-1': {
            subject: 'I',
            auxiliary: null,
            verb: conjugation.v1,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['simple-present-1'],
            timeTr: context.timeTr || timeExpressionsTr['simple-present-1']
        },
        'simple-present-2': {
            subject: 'He',
            auxiliary: null,
            verb: conjugation.thirdPerson,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['simple-present-2'],
            timeTr: context.timeTr || timeExpressionsTr['simple-present-2']
        },
        'present-continuous-1': {
            subject: 'I',
            auxiliary: 'am',
            verb: conjugation.ing,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['present-continuous-1'],
            timeTr: context.timeTr || timeExpressionsTr['present-continuous-1']
        },
        'present-continuous-2': {
            subject: 'You',
            auxiliary: 'are',
            verb: conjugation.ing,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['present-continuous-2'],
            timeTr: context.timeTr || timeExpressionsTr['present-continuous-2']
        },
        'present-continuous-3': {
            subject: 'He',
            auxiliary: 'is',
            verb: conjugation.ing,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['present-continuous-3'],
            timeTr: context.timeTr || timeExpressionsTr['present-continuous-3']
        },
        'present-perfect-1': {
            subject: 'I',
            auxiliary: 'have',
            verb: conjugation.v3,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['present-perfect-1'],
            timeTr: context.timeTr || timeExpressionsTr['present-perfect-1']
        },
        'present-perfect-2': {
            subject: 'He',
            auxiliary: 'has',
            verb: conjugation.v3,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['present-perfect-2'],
            timeTr: context.timeTr || timeExpressionsTr['present-perfect-2']
        },
        'present-perfect-continuous-1': {
            subject: 'I',
            auxiliary: 'have been',
            verb: conjugation.ing,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['present-perfect-continuous-1'],
            timeTr: context.timeTr || timeExpressionsTr['present-perfect-continuous-1']
        },
        'present-perfect-continuous-2': {
            subject: 'He',
            auxiliary: 'has been',
            verb: conjugation.ing,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['present-perfect-continuous-2'],
            timeTr: context.timeTr || timeExpressionsTr['present-perfect-continuous-2']
        },

        // FUTURE TENSES
        'simple-future': {
            subject: 'I',
            auxiliary: 'will',
            verb: conjugation.v1,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['simple-future'],
            timeTr: context.timeTr || timeExpressionsTr['simple-future']
        },
        'future-continuous': {
            subject: 'I',
            auxiliary: 'will be',
            verb: conjugation.ing,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['future-continuous'],
            timeTr: context.timeTr || timeExpressionsTr['future-continuous']
        },
        'future-perfect': {
            subject: 'I',
            auxiliary: 'will have',
            verb: conjugation.v3,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['future-perfect'],
            timeTr: context.timeTr || timeExpressionsTr['future-perfect']
        },
        'future-perfect-continuous': {
            subject: 'I',
            auxiliary: 'will have been',
            verb: conjugation.ing,
            object: objectEn,
            objectTr: objectTr,
            time: context.timeEn || timeExpressions['future-perfect-continuous'],
            timeTr: context.timeTr || timeExpressionsTr['future-perfect-continuous']
        }
    };
}

// Cümle yapısını HTML olarak oluştur
function buildSentenceStructureHTML(structure) {
    let html = '';

    // Subject (Özne)
    html += createSentencePart('subject', structure.subject, 'Subject');
    html += createPlus();

    // Auxiliary (Yardımcı fiil) - varsa
    if (structure.auxiliary) {
        html += createSentencePart('auxiliary', structure.auxiliary, 'Auxiliary');
        html += createPlus();
    }

    // Main Verb (Ana fiil)
    html += createSentencePart('verb', structure.verb, 'Verb');
    html += createPlus();

    // Object (Nesne)
    html += createSentencePart('object', structure.object, 'Object');
    html += createPlus();

    // Time Expression (Zaman ifadesi)
    html += createSentencePart('time', structure.time, 'Time');

    return html;
}

function joinParts(parts) {
    return parts.filter(Boolean).join(' ');
}

function getLastVowel(text) {
    const vowels = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'];
    for (let i = text.length - 1; i >= 0; i--) {
        const ch = text[i];
        if (vowels.includes(ch)) return ch;
    }
    return 'a';
}

function vowelHarmony(vowel, options) {
    if (['a', 'ı'].includes(vowel)) return options[0];
    if (['e', 'i'].includes(vowel)) return options[1];
    if (['o', 'u'].includes(vowel)) return options[2];
    return options[3];
}

function isVoicelessConsonant(ch) {
    return ['p', 'ç', 't', 'k', 'f', 'h', 's', 'ş'].includes(ch);
}

function getLastConsonant(text) {
    for (let i = text.length - 1; i >= 0; i--) {
        const ch = text[i];
        if (!['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'].includes(ch)) return ch;
    }
    return '';
}

function pastSuffixForStem(stem) {
    const lastVowel = getLastVowel(stem);
    const lastConsonant = getLastConsonant(stem);
    const isVoiceless = isVoicelessConsonant(lastConsonant);
    if (isVoiceless) return vowelHarmony(lastVowel, ['tı', 'ti', 'tu', 'tü']);
    return vowelHarmony(lastVowel, ['dı', 'di', 'du', 'dü']);
}

function normalizeTrStem(verbTr) {
    if (!verbTr) return '';
    let stem = verbTr.toLowerCase().trim();
    if (stem.endsWith('mek') || stem.endsWith('mak')) {
        stem = stem.slice(0, -3);
    }
    return stem;
}

function parseTrVerbPhrase(verbTrInput) {
    const raw = (verbTrInput || '').trim();
    if (!raw) return { prefix: '', stem: '' };

    const parts = raw.split(/\s+/);
    if (parts.length === 1) {
        return { prefix: '', stem: normalizeTrStem(raw) };
    }

    const last = parts[parts.length - 1];
    const prefix = parts.slice(0, -1).join(' ');
    return { prefix, stem: normalizeTrStem(last) };
}

function addPersonSuffix(base, subject, lastVowel, formalYou = false) {
    const lower = subject.toLowerCase();
    if (lower === 'i') return base + vowelHarmony(lastVowel, ['ım', 'im', 'um', 'üm']);
    if (lower === 'you') {
        return base + (formalYou
            ? vowelHarmony(lastVowel, ['sınız', 'siniz', 'sunuz', 'sünüz'])
            : vowelHarmony(lastVowel, ['sın', 'sin', 'sun', 'sün']));
    }
    if (lower === 'we') return base + vowelHarmony(lastVowel, ['ız', 'iz', 'uz', 'üz']);
    if (lower === 'they') return base + vowelHarmony(lastVowel, ['lar', 'ler', 'lar', 'ler']);
    return base;
}

function needsBufferY(word) {
    const last = word[word.length - 1];
    return ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'].includes(last);
}

function conjugateTrPresentContinuous(stem, subject, isNegative = false, formalYou = false) {
    if (!stem) return '';
    const negStem = isNegative ? stem + vowelHarmony(getLastVowel(stem), ['ma', 'me', 'ma', 'me']) : stem;
    const lastVowel = getLastVowel(negStem);
    const suffix = vowelHarmony(lastVowel, ['ıyor', 'iyor', 'uyor', 'üyor']);
    let base = negStem;
    if (needsBufferY(base)) {
        base = base.slice(0, -1);
    }
    const form = base + suffix;
    return addPersonSuffix(form, subject, suffix[suffix.length - 1], formalYou);
}

function conjugateTrPast(stem, subject, isNegative = false, formalYou = false) {
    if (!stem) return '';
    const negStem = isNegative ? stem + vowelHarmony(getLastVowel(stem), ['ma', 'me', 'ma', 'me']) : stem;
    const suffix = pastSuffixForStem(negStem);
    return addPersonSuffix(negStem + suffix, subject, suffix[suffix.length - 1], formalYou);
}

function conjugateTrPerfect(stem, subject, isNegative = false, formalYou = false) {
    if (!stem) return '';
    const negStem = isNegative ? stem + vowelHarmony(getLastVowel(stem), ['ma', 'me', 'ma', 'me']) : stem;
    const lastVowel = getLastVowel(negStem);
    const suffix = vowelHarmony(lastVowel, ['mış', 'miş', 'muş', 'müş']);
    return addPersonSuffix(negStem + suffix, subject, suffix[suffix.length - 1], formalYou);
}

function conjugateTrFuture(stem, subject, isNegative = false, formalYou = false) {
    if (!stem) return '';
    const negStem = isNegative ? stem + vowelHarmony(getLastVowel(stem), ['ma', 'me', 'ma', 'me']) : stem;
    const lastVowel = getLastVowel(negStem);
    const suffix = vowelHarmony(lastVowel, ['acak', 'ecek', 'acak', 'ecek']);
    const form = (needsBufferY(negStem) ? negStem + 'y' : negStem) + suffix;
    return addPersonSuffix(form, subject, suffix[suffix.length - 1], formalYou);
}

function conjugateTrAorist(stem, subject, isNegative = false, formalYou = false) {
    if (!stem) return '';
    if (isNegative) {
        const neg = stem + vowelHarmony(getLastVowel(stem), ['ma', 'me', 'ma', 'me']);
        const lastVowel = getLastVowel(neg);
        const negSuffix = vowelHarmony(lastVowel, ['z', 'z', 'z', 'z']);
        return addPersonSuffix(neg + negSuffix, subject, lastVowel, formalYou);
    }
    const lastVowel = getLastVowel(stem);
    const suffix = vowelHarmony(lastVowel, ['ar', 'er', 'ar', 'er']);
    return addPersonSuffix(stem + suffix, subject, suffix[suffix.length - 1], formalYou);
}

function getQuestionParticle(vowel) {
    return vowelHarmony(vowel, ['mı', 'mi', 'mu', 'mü']);
}

function getQuestionSuffix(subject, vowel, formalYou = false) {
    const lower = subject.toLowerCase();
    if (lower === 'i') return vowelHarmony(vowel, ['yım', 'yim', 'yum', 'yüm']);
    if (lower === 'you') {
        return formalYou
            ? vowelHarmony(vowel, ['sınız', 'siniz', 'sunuz', 'sünüz'])
            : vowelHarmony(vowel, ['sın', 'sin', 'sun', 'sün']);
    }
    if (lower === 'we') return vowelHarmony(vowel, ['yız', 'yiz', 'yuz', 'yüz']);
    if (lower === 'they') return vowelHarmony(vowel, ['lar', 'ler', 'lar', 'ler']);
    return '';
}

function conjugateTr(tenseKey, stem, subject, isNegative = false, formalYou = false) {
    if (!stem) return '';
    if (tenseKey === 'simple-present-1' || tenseKey === 'simple-present-2') {
        return conjugateTrAorist(stem, subject, isNegative, formalYou);
    }
    if (tenseKey.startsWith('present-continuous')) {
        return conjugateTrPresentContinuous(stem, subject, isNegative, formalYou);
    }
    if (tenseKey === 'simple-past') {
        return conjugateTrPast(stem, subject, isNegative, formalYou);
    }
    if (tenseKey.startsWith('past-continuous')) {
        return conjugateTrPast(conjugateTrPresentContinuous(stem, subject, isNegative, formalYou), subject, false, formalYou);
    }
    if (tenseKey === 'past-perfect') {
        return conjugateTrPast(conjugateTrPerfect(stem, subject, isNegative, formalYou), subject, false, formalYou);
    }
    if (tenseKey === 'past-perfect-continuous') {
        return conjugateTrPast(conjugateTrPresentContinuous(stem, subject, isNegative, formalYou), subject, false, formalYou);
    }
    if (tenseKey === 'present-perfect-1' || tenseKey === 'present-perfect-2') {
        return conjugateTrPerfect(stem, subject, isNegative, formalYou);
    }
    if (tenseKey.startsWith('present-perfect-continuous')) {
        return conjugateTrPresentContinuous(stem, subject, isNegative, formalYou);
    }
    if (tenseKey === 'simple-future') {
        return conjugateTrFuture(stem, subject, isNegative, formalYou);
    }
    if (tenseKey === 'future-continuous') {
        return conjugateTrPresentContinuous(stem, subject, isNegative, formalYou);
    }
    if (tenseKey === 'future-perfect' || tenseKey === 'future-perfect-continuous') {
        return conjugateTrPerfect(stem, subject, isNegative, formalYou);
    }
    return stem;
}

function getTurkishSubject(subject, youForm = 'sen') {
    const map = {
        'I': 'Ben',
        'You': youForm === 'siz' ? 'Siz' : 'Sen',
        'He': 'O',
        'She': 'O',
        'It': 'O',
        'We': 'Biz',
        'They': 'Onlar'
    };
    return map[subject] || subject;
}

function buildTurkishSentence(subjectTr, verbTr, objectTr, timeTr, isQuestion, questionVowel, subjectEn, formalYou) {
    if (!isQuestion) {
        const core = joinParts([subjectTr, objectTr, verbTr, timeTr]);
        return `${core}.`;
    }

    const particle = getQuestionParticle(questionVowel);
    const suffix = getQuestionSuffix(subjectEn, questionVowel, formalYou);
    const core = joinParts([subjectTr, objectTr, verbTr, `${particle}${suffix}`, timeTr]);
    return `${core}?`;
}

function buildSentence(subject, auxFirst, auxRest, verb, object, time, isQuestion) {
    if (isQuestion) {
        const question = joinParts([auxFirst, subject, auxRest, verb, object, time]);
        return `${question}?`;
    }

    const negative = joinParts([subject, auxFirst, 'not', auxRest, verb, object, time]);
    return `${negative}.`;
}

function getDoAux(subject, tenseKey) {
    if (tenseKey === 'simple-past') return 'did';

    const lower = subject.toLowerCase();
    if (lower === 'he' || lower === 'she' || lower === 'it') return 'does';
    return 'do';
}

function buildVariants(tenseKey, structure, conjugation) {
    const subject = structure.subject;
    const object = structure.object;
    const time = structure.time;
    const baseVerb = conjugation.v1;

    if (!structure.auxiliary) {
        const aux = getDoAux(subject, tenseKey);
        return {
            negative: buildSentence(subject, aux, '', baseVerb, object, time, false),
            question: buildSentence(subject, aux.charAt(0).toUpperCase() + aux.slice(1), '', baseVerb, object, time, true)
        };
    }

    const auxParts = structure.auxiliary.split(' ');
    const auxFirst = auxParts[0];
    const auxRest = auxParts.slice(1).join(' ');
    const verb = structure.verb;

    return {
        negative: buildSentence(subject, auxFirst, auxRest, verb, object, time, false),
        question: buildSentence(subject, auxFirst.charAt(0).toUpperCase() + auxFirst.slice(1), auxRest, verb, object, time, true)
    };
}

// Tüm sentence structure'ları güncelle
function updateAllSentenceStructures(conjugation) {
    const context = getUserContext();
    const structures = getSentenceStructures(conjugation, context);

    Object.entries(structures).forEach(([key, structure]) => {
        const container = document.querySelector(`[data-structure="${key}"]`);
        if (container) {
            const variants = buildVariants(key, structure, conjugation);
            const formalYou = context.youForm === 'siz';
            const subjectTr = getTurkishSubject(structure.subject, context.youForm);
            const verbTrInput = context.verbTr || conjugation.v1;
            const { prefix: trPrefix, stem: trStem } = parseTrVerbPhrase(verbTrInput);
            const objectTr = structure.objectTr || structure.object;
            const timeTr = structure.timeTr || structure.time;

            const trPositiveBase = trStem ? conjugateTr(key, trStem, structure.subject, false, formalYou) : verbTrInput;
            const trNegativeBase = trStem ? conjugateTr(key, trStem, structure.subject, true, formalYou) : verbTrInput;
            const trPositiveVerb = trPrefix ? `${trPrefix} ${trPositiveBase}` : trPositiveBase;
            const trNegativeVerb = trPrefix ? `${trPrefix} ${trNegativeBase}` : trNegativeBase;
            const qVowel = getLastVowel(trPositiveBase);

            const trPositive = buildTurkishSentence(subjectTr, trPositiveVerb, objectTr, timeTr, false, qVowel, structure.subject, formalYou);
            const trNegative = buildTurkishSentence(subjectTr, trNegativeVerb, objectTr, timeTr, false, qVowel, structure.subject, formalYou);
            const trQuestion = buildTurkishSentence(subjectTr, trPositiveVerb, objectTr, timeTr, true, qVowel, structure.subject, formalYou);

            container.innerHTML = `
                ${buildSentenceStructureHTML(structure)}
                <div class="sentence-variants">
                    <div class="variant-line"><span class="variant-label">Olumsuz:</span>${variants.negative}</div>
                    <div class="variant-line"><span class="variant-label">Soru:</span>${variants.question}</div>
                    <div class="variant-line"><span class="variant-label">Türkçe (Yaklaşık):</span>${trPositive}</div>
                    <div class="variant-line"><span class="variant-label">Türkçe (Olumsuz):</span>${trNegative}</div>
                    <div class="variant-line"><span class="variant-label">Türkçe (Soru):</span>${trQuestion}</div>
                </div>
            `;
        }
    });
}

// ===== TENSE OLUŞTURMA (V1, V2, V3 KULLANARAK) =====

function generateTenses(conjugation) {
    return {
        // PRESENT TENSES
        'simple-present-1': conjugation.v1,
        'simple-present-2': conjugation.thirdPerson,
        'present-continuous-1': conjugation.ing,
        'present-continuous-2': conjugation.ing,
        'present-continuous-3': conjugation.ing,
        'present-perfect-1': conjugation.v3,
        'present-perfect-2': conjugation.v3,
        'present-perfect-continuous-1': conjugation.ing,
        'present-perfect-continuous-2': conjugation.ing,

        // PAST TENSES
        'simple-past': conjugation.v2,
        'past-continuous-1': conjugation.ing,
        'past-continuous-2': conjugation.ing,
        'past-perfect': conjugation.v3,
        'past-perfect-continuous': conjugation.ing,

        // FUTURE TENSES
        'simple-future': conjugation.v1,
        'future-continuous': conjugation.ing,
        'future-perfect': conjugation.v3,
        'future-perfect-continuous': conjugation.ing,
    };
}

// ===== ANIMASYON GÖSTER =====

function showVerbWithAnimation(elementId, verb) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.textContent = '';
    element.style.opacity = '0';

    // Reset animation
    element.style.animation = 'none';
    setTimeout(() => {
        element.textContent = verb;
        element.style.animation = 'verbHighlight 0.6s ease-out forwards';
    }, 10);
}

// ===== FIIL ARAMA VE GÖSTER =====

function searchVerb() {
    const verbInput = document.getElementById('verbInput');
    const errorMsg = document.getElementById('errorMsg');
    const verbInfoBox = document.getElementById('verbInfoBox');
    const verbTrInput = document.getElementById('verbTrInput');
    const verb = verbInput.value.trim();

    // Hata kontrolü
    errorMsg.textContent = '';

    if (!verb) {
        errorMsg.textContent = '⚠️ Lütfen bir fiil giriniz!';
        verbInfoBox.style.display = 'none';
        stopTimelineAnimation();
        resetAllTimelines();
        const pastEl = document.getElementById('tensePast');
        const presentEl = document.getElementById('tensePresent');
        const futureEl = document.getElementById('tenseFuture');
        if (pastEl) pastEl.textContent = '-';
        if (presentEl) presentEl.textContent = '-';
        if (futureEl) futureEl.textContent = '-';
        return;
    }

    if (verb.length < 2) {
        errorMsg.textContent = '⚠️ Fiil en az 2 karakter olmalıdır!';
        verbInfoBox.style.display = 'none';
        stopTimelineAnimation();
        resetAllTimelines();
        const pastEl = document.getElementById('tensePast');
        const presentEl = document.getElementById('tensePresent');
        const futureEl = document.getElementById('tenseFuture');
        if (pastEl) pastEl.textContent = '-';
        if (presentEl) presentEl.textContent = '-';
        if (futureEl) futureEl.textContent = '-';
        return;
    }

    // Fiil çekimi
    const conjugation = conjugateVerb(verb);
    const tenses = generateTenses(conjugation);

    setHighlightsFromEn(conjugation.v1);
    selectEnVerb(conjugation.v1);

    if (verbTrInput) {
        const guess = verbTrMap[conjugation.v1];
        if (!verbTrInput.value.trim() && guess) {
            verbTrInput.value = guess;
        }
        const trValue = verbTrInput.value.trim() || guess;
        if (trValue) {
            selectTrVerb(trValue);
        }
    }

    // V1, V2, V3 bilgilerini göster
    document.getElementById('v1-form').textContent = conjugation.v1;
    document.getElementById('v2-form').textContent = conjugation.v2;
    document.getElementById('v3-form').textContent = conjugation.v3;
    verbInfoBox.style.display = 'block';

    // Tüm tense'leri göster
    Object.entries(tenses).forEach(([id, verbForm]) => {
        showVerbWithAnimation(id, verbForm);
    });

    // Sentence structure'ları güncelle
    updateAllSentenceStructures(conjugation);

    stopTimelineAnimation();
    resetAllTimelines();
    updateTenseStrip(conjugation);

    // Arama girişinde fokus çıkar
    verbInput.blur();
}

// ===== ONE-PAGE LAYOUT (TAB SİSTEMİ YOK) =====
// Tüm tense'ler aynı anda görünüyor - setup gerekli değil

// ===== ENTER TUŞU İLE ARAMA =====

function setupEventListeners() {
    const verbInput = document.getElementById('verbInput');
    const searchBtn = document.getElementById('searchBtn');
    const errorMsg = document.getElementById('errorMsg');
    const objectInput = document.getElementById('objectInput');
    const objectTrInput = document.getElementById('objectTrInput');
    const timeInput = document.getElementById('timeInput');
    const timeTrInput = document.getElementById('timeTrInput');
    const verbTrInput = document.getElementById('verbTrInput');

    verbInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchVerb();
        }
    });

    verbInput.addEventListener('input', () => {
        errorMsg.textContent = '';
    });

    searchBtn.addEventListener('click', searchVerb);

    const refreshStructures = () => {
        if (currentConjugation) {
            updateAllSentenceStructures(currentConjugation);
        }
    };

    [objectInput, objectTrInput, timeInput, timeTrInput, verbTrInput].forEach((el) => {
        if (!el) return;
        el.addEventListener('input', refreshStructures);
    });

    const youForm = document.getElementById('youForm');
    if (youForm) {
        youForm.addEventListener('change', refreshStructures);
    }

    if (verbTrInput) {
        verbTrInput.addEventListener('input', () => {
            setHighlightsFromTr(verbTrInput.value);
            if (currentEnLetter) renderEnButtons(currentEnLetter);
            if (currentTrLetter) renderTrButtons(currentTrLetter);
        });
    }

    document.querySelectorAll('.chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            const targetId = chip.getAttribute('data-target');
            const targetTrId = chip.getAttribute('data-target-tr');
            const value = chip.getAttribute('data-value') || '';
            const valueTr = chip.getAttribute('data-value-tr') || '';

            const target = document.getElementById(targetId);
            if (target) target.value = value;

            const targetTr = document.getElementById(targetTrId);
            if (targetTr) targetTr.value = valueTr;

            refreshStructures();
        });
    });
}

// Autocomplete listesi
function populateVerbList() {
    const list = document.getElementById('verbList');
    if (!list || typeof getAllV1Forms !== 'function') return;

    const verbs = getAllV1Forms();
    list.innerHTML = verbs.map(verb => `<option value="${verb}"></option>`).join('');
}

function setHighlightsFromEn(enVerb) {
    const verb = (enVerb || '').toLowerCase();
    enHighlight = { direct: new Set(), synonyms: new Set() };
    trHighlight = { direct: new Set(), synonyms: new Set() };

    if (!verb) return;
    enHighlight.direct.add(verb);
    (verbSynonyms[verb] || []).forEach(v => enHighlight.synonyms.add(v));

    const tr = verbTrMap[verb];
    if (tr) trHighlight.direct.add(tr);
    enHighlight.synonyms.forEach(v => {
        const trSyn = verbTrMap[v];
        if (trSyn) trHighlight.synonyms.add(trSyn);
    });

    enHighlight.direct.forEach(v => enHighlight.synonyms.delete(v));
    trHighlight.direct.forEach(v => trHighlight.synonyms.delete(v));
}

function setHighlightsFromTr(trVerb) {
    const verbTr = (trVerb || '').toLowerCase();
    enHighlight = { direct: new Set(), synonyms: new Set() };
    trHighlight = { direct: new Set(), synonyms: new Set() };

    if (!verbTr) return;
    trHighlight.direct.add(verbTr);

    const directEns = Object.keys(verbTrMap).filter(en => verbTrMap[en].toLowerCase() === verbTr);
    directEns.forEach(en => enHighlight.direct.add(en));
    directEns.forEach(en => {
        (verbSynonyms[en] || []).forEach(v => enHighlight.synonyms.add(v));
    });

    enHighlight.synonyms.forEach(v => {
        const trSyn = verbTrMap[v];
        if (trSyn) trHighlight.synonyms.add(trSyn);
    });

    enHighlight.direct.forEach(v => enHighlight.synonyms.delete(v));
    trHighlight.direct.forEach(v => trHighlight.synonyms.delete(v));
}

function getVerbButtonClass(verb, highlight) {
    const isDirect = highlight.direct.has(verb);
    const isSynonym = highlight.synonyms.has(verb);
    let cls = 'verb-button';
    if (isSynonym) cls += ' synonym';
    if (isDirect) cls += ' direct active';
    return cls;
}

function buildTrToEnMap() {
    if (trToEnMap) return;
    trToEnMap = new Map();
    Object.keys(verbTrMap).forEach(en => {
        const tr = verbTrMap[en].toLowerCase();
        if (!trToEnMap.has(tr)) trToEnMap.set(tr, []);
        trToEnMap.get(tr).push(en);
    });
}

function buildVerbPicker() {
    const lettersEl = document.getElementById('verbLetters');
    const buttonsEl = document.getElementById('verbButtons');
    if (!lettersEl || !buttonsEl || typeof getAllV1Forms !== 'function') return;

    const verbs = getAllV1Forms().map(v => v.toLowerCase());
    verbEnGroups = verbs.reduce((acc, v) => {
        const letter = v[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(v);
        return acc;
    }, {});

    verbEnLetters = Object.keys(verbEnGroups).sort();
    lettersEl.innerHTML = verbEnLetters.map(l => `<button class="letter-chip" data-letter="${l}" type="button">${l}</button>`).join('');

    if (verbEnLetters.length) {
        renderEnButtons(verbEnLetters[0]);
        const firstChip = lettersEl.querySelector(`[data-letter="${verbEnLetters[0]}"]`);
        if (firstChip) firstChip.classList.add('active');
    }

    lettersEl.addEventListener('click', (e) => {
        const target = e.target.closest('.letter-chip');
        if (!target) return;
        const letter = target.getAttribute('data-letter');
        lettersEl.querySelectorAll('.letter-chip').forEach(ch => ch.classList.remove('active'));
        target.classList.add('active');
        renderEnButtons(letter);
    });

    buttonsEl.addEventListener('click', (e) => {
        const target = e.target.closest('.verb-button');
        if (!target) return;
        const verb = target.getAttribute('data-verb');
        const input = document.getElementById('verbInput');
        const inputTr = document.getElementById('verbTrInput');
        if (input) {
            input.value = verb;
            searchVerb();
        }
        if (inputTr && verbTrMap[verb]) {
            inputTr.value = verbTrMap[verb];
            if (typeof selectTrVerb === 'function') {
                selectTrVerb(verbTrMap[verb]);
            }
        }
    });
}

function renderEnButtons(letter) {
    const buttonsEl = document.getElementById('verbButtons');
    if (!buttonsEl || !verbEnGroups) return;
    currentEnLetter = letter;
    const list = verbEnGroups[letter] || [];
    buttonsEl.innerHTML = list
        .map(v => `<button class="${getVerbButtonClass(v, enHighlight)}" data-verb="${v}" type="button">${v}</button>`)
        .join('');
}

function selectEnVerb(verb) {
    const lettersEl = document.getElementById('verbLetters');
    if (!lettersEl || !verbEnGroups) return;

    const value = (verb || '').toLowerCase();
    if (!value) return;
    const letter = value[0].toUpperCase();

    const letters = Array.from(lettersEl.querySelectorAll('.letter-chip'));
    letters.forEach(ch => ch.classList.remove('active'));
    const chip = lettersEl.querySelector(`[data-letter="${letter}"]`);
    if (chip) chip.classList.add('active');

    renderEnButtons(letter);
}
function buildVerbTrPicker() {
    const lettersEl = document.getElementById('verbTrLetters');
    const buttonsEl = document.getElementById('verbTrButtons');
    if (!lettersEl || !buttonsEl || !verbTrMap) return;
    buildTrToEnMap();

    const verbs = Array.from(new Set(Object.values(verbTrMap)))
        .map(v => v.toLowerCase())
        .sort((a, b) => a.localeCompare(b, 'tr'));

    verbTrGroups = verbs.reduce((acc, v) => {
        const letter = v[0].toLocaleUpperCase('tr-TR');
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(v);
        return acc;
    }, {});

    verbTrLetters = Object.keys(verbTrGroups).sort((a, b) => a.localeCompare(b, 'tr'));
    lettersEl.innerHTML = verbTrLetters.map(l => `<button class="letter-chip" data-letter="${l}" type="button">${l}</button>`).join('');

    if (verbTrLetters.length) {
        renderTrButtons(verbTrLetters[0]);
        const firstChip = lettersEl.querySelector(`[data-letter="${verbTrLetters[0]}"]`);
        if (firstChip) firstChip.classList.add('active');
    }

    lettersEl.addEventListener('click', (e) => {
        const target = e.target.closest('.letter-chip');
        if (!target) return;
        const letter = target.getAttribute('data-letter');
        lettersEl.querySelectorAll('.letter-chip').forEach(ch => ch.classList.remove('active'));
        target.classList.add('active');
        renderTrButtons(letter);
    });

    buttonsEl.addEventListener('click', (e) => {
        const target = e.target.closest('.verb-button');
        if (!target) return;
        const verbTr = target.getAttribute('data-verb');
        const inputTr = document.getElementById('verbTrInput');
        const inputEn = document.getElementById('verbInput');
        const matchBox = document.getElementById('verbMatch');
        const matchList = document.getElementById('verbMatchList');
        if (inputTr) {
            inputTr.value = verbTr;
            setHighlightsFromTr(verbTr);
            if (enHighlight.direct.size) {
                const firstEn = Array.from(enHighlight.direct)[0];
                selectEnVerb(firstEn);
            } else if (currentEnLetter) {
                renderEnButtons(currentEnLetter);
            }
            if (currentTrLetter) renderTrButtons(currentTrLetter);
            if (currentConjugation) {
                updateAllSentenceStructures(currentConjugation);
            }
        }
        if (inputEn && trToEnMap) {
            const candidates = trToEnMap.get(verbTr.toLowerCase());
            if (candidates && candidates.length) {
                if (candidates.length === 1) {
                    inputEn.value = candidates[0];
                    searchVerb();
                    if (matchBox) matchBox.style.display = 'none';
                } else {
                    if (matchBox && matchList) {
                        matchBox.style.display = 'block';
                        matchList.innerHTML = candidates
                            .map(v => `<button class="verb-button" data-verb="${v}" type="button">${v}</button>`)
                            .join('');
                    }
                }
            }
        }
    });
}

document.addEventListener('click', (e) => {
    const matchList = document.getElementById('verbMatchList');
    if (!matchList) return;
    const target = e.target.closest('.verb-button');
    if (!target || !matchList.contains(target)) return;

    const verb = target.getAttribute('data-verb');
    const inputEn = document.getElementById('verbInput');
    if (inputEn) {
        inputEn.value = verb;
        searchVerb();
    }
});

function renderTrButtons(letter) {
    const buttonsEl = document.getElementById('verbTrButtons');
    if (!buttonsEl || !verbTrGroups) return;
    currentTrLetter = letter;
    const list = verbTrGroups[letter] || [];
    buttonsEl.innerHTML = list
        .map(v => `<button class="${getVerbButtonClass(v, trHighlight)}" data-verb="${v}" type="button">${v}</button>`)
        .join('');
}

function selectTrVerb(verbTr) {
    const lettersEl = document.getElementById('verbTrLetters');
    if (!lettersEl || !verbTrGroups) return;

    const value = (verbTr || '').toLowerCase();
    if (!value) return;
    const letter = value[0].toLocaleUpperCase('tr-TR');
    if (!verbTrGroups[letter]) return;

    lettersEl.querySelectorAll('.letter-chip').forEach(ch => ch.classList.remove('active'));
    const chip = lettersEl.querySelector(`[data-letter="${letter}"]`);
    if (chip) chip.classList.add('active');

    renderTrButtons(letter);
}

// ===== ÖRNEK FİİL YÜKLE =====

function loadExampleVerb() {
    const exampleVerbs = ['play', 'eat', 'go', 'make', 'be', 'have', 'write', 'take', 'see', 'come'];
    const randomVerb = exampleVerbs[Math.floor(Math.random() * exampleVerbs.length)];

    document.getElementById('verbInput').value = randomVerb;
    setTimeout(() => searchVerb(), 500);
}

// ===== SAHİFE YÜKLENME =====

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    populateVerbList();
    buildVerbPicker();
    buildVerbTrPicker();

    // Sayfa yüklendiğinde örnek fiil göster
    loadExampleVerb();
});
