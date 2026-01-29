// ===== FİİL ÇEKİM SİSTEMİ (V1, V2, V3 KULLANARAK) =====

let currentVerbData = null;
let timelineAnimationRunning = false;
let timelineLoopActive = false;
let currentConjugation = null;

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
function getSentenceStructures(conjugation) {
    // Örnek nesne ve zaman ifadeleri
    const objects = {
        past: 'football',
        present: 'football',
        future: 'football'
    };

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

    return {
        // PAST TENSES
        'simple-past': {
            subject: 'I',
            auxiliary: null,
            verb: conjugation.v2,
            object: 'football',
            time: timeExpressions['simple-past']
        },
        'past-continuous-1': {
            subject: 'I',
            auxiliary: 'was',
            verb: conjugation.ing,
            object: 'football',
            time: timeExpressions['past-continuous-1']
        },
        'past-continuous-2': {
            subject: 'They',
            auxiliary: 'were',
            verb: conjugation.ing,
            object: 'football',
            time: timeExpressions['past-continuous-2']
        },
        'past-perfect': {
            subject: 'I',
            auxiliary: 'had',
            verb: conjugation.v3,
            object: 'football',
            time: timeExpressions['past-perfect']
        },
        'past-perfect-continuous': {
            subject: 'I',
            auxiliary: 'had been',
            verb: conjugation.ing,
            object: 'football',
            time: timeExpressions['past-perfect-continuous']
        },

        // PRESENT TENSES
        'simple-present-1': {
            subject: 'I',
            auxiliary: null,
            verb: conjugation.v1,
            object: 'football',
            time: timeExpressions['simple-present-1']
        },
        'simple-present-2': {
            subject: 'He',
            auxiliary: null,
            verb: conjugation.thirdPerson,
            object: 'football',
            time: timeExpressions['simple-present-2']
        },
        'present-continuous-1': {
            subject: 'I',
            auxiliary: 'am',
            verb: conjugation.ing,
            object: 'football',
            time: timeExpressions['present-continuous-1']
        },
        'present-continuous-2': {
            subject: 'You',
            auxiliary: 'are',
            verb: conjugation.ing,
            object: 'football',
            time: timeExpressions['present-continuous-2']
        },
        'present-continuous-3': {
            subject: 'He',
            auxiliary: 'is',
            verb: conjugation.ing,
            object: 'football',
            time: timeExpressions['present-continuous-3']
        },
        'present-perfect-1': {
            subject: 'I',
            auxiliary: 'have',
            verb: conjugation.v3,
            object: 'football',
            time: timeExpressions['present-perfect-1']
        },
        'present-perfect-2': {
            subject: 'He',
            auxiliary: 'has',
            verb: conjugation.v3,
            object: 'football',
            time: timeExpressions['present-perfect-2']
        },
        'present-perfect-continuous-1': {
            subject: 'I',
            auxiliary: 'have been',
            verb: conjugation.ing,
            object: 'football',
            time: timeExpressions['present-perfect-continuous-1']
        },
        'present-perfect-continuous-2': {
            subject: 'He',
            auxiliary: 'has been',
            verb: conjugation.ing,
            object: 'football',
            time: timeExpressions['present-perfect-continuous-2']
        },

        // FUTURE TENSES
        'simple-future': {
            subject: 'I',
            auxiliary: 'will',
            verb: conjugation.v1,
            object: 'football',
            time: timeExpressions['simple-future']
        },
        'future-continuous': {
            subject: 'I',
            auxiliary: 'will be',
            verb: conjugation.ing,
            object: 'football',
            time: timeExpressions['future-continuous']
        },
        'future-perfect': {
            subject: 'I',
            auxiliary: 'will have',
            verb: conjugation.v3,
            object: 'football',
            time: timeExpressions['future-perfect']
        },
        'future-perfect-continuous': {
            subject: 'I',
            auxiliary: 'will have been',
            verb: conjugation.ing,
            object: 'football',
            time: timeExpressions['future-perfect-continuous']
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

// Tüm sentence structure'ları güncelle
function updateAllSentenceStructures(conjugation) {
    const structures = getSentenceStructures(conjugation);

    Object.entries(structures).forEach(([key, structure]) => {
        const container = document.querySelector(`[data-structure="${key}"]`);
        if (container) {
            container.innerHTML = buildSentenceStructureHTML(structure);
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
    const verb = verbInput.value.trim();

    // Hata kontrolü
    errorMsg.textContent = '';

    if (!verb) {
        errorMsg.textContent = '⚠️ Lütfen bir fiil giriniz!';
        verbInfoBox.style.display = 'none';
        return;
    }

    if (verb.length < 2) {
        errorMsg.textContent = '⚠️ Fiil en az 2 karakter olmalıdır!';
        verbInfoBox.style.display = 'none';
        return;
    }

    // Fiil çekimi
    const conjugation = conjugateVerb(verb);
    const tenses = generateTenses(conjugation);

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

    // Timeline animasyonlarını başlat
    animateAllTimelines(conjugation);

    // Arama girişinde fokus çıkar
    verbInput.blur();
}

// ===== ONE-PAGE LAYOUT (TAB SİSTEMİ YOK) =====
// Tüm tense'ler aynı anda görünüyor - setup gerekli değil

// ===== ENTER TUŞU İLE ARAMA =====

function setupEventListeners() {
    const verbInput = document.getElementById('verbInput');
    const searchBtn = document.getElementById('searchBtn');

    verbInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchVerb();
        }
    });

    searchBtn.addEventListener('click', searchVerb);
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

    // Sayfa yüklendiğinde örnek fiil göster
    loadExampleVerb();
});
