const weaponDrops = [
    'AK-47',
    'AK-74U',
    'M4 CARBINE',
    'M16A4',
    'G36C',
    'MP5',
    'P90',
    'R700',
    'M40A3',
    'BARRETT .50CAL',
    'M249 SAW',
    'RPD',
    'DESERT EAGLE',
    'USP .45',
    'C4',
    'CLAYMORE',
    'FRAG',
    'FLASH',
    'SMOKE',
    'STUN',
    'PROMOD'
];

const combatTerms = [
    'HEADSHOT',
    'NO SCOPES',
    'SND',
    'TDM',
    'DEFUSE',
    'RUSH B',
    'MID CONTROL'
];

const syntaxBackground = document.getElementById('syntax-background');

function randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

if (syntaxBackground) {
    for (let i = 0; i < 55; i++) {
        const span = document.createElement('span');
        let dropText = randomFrom(weaponDrops);

        // Mix in tactical callouts so the rain has varied phrases.
        if (Math.random() > 0.65) {
            dropText = `${dropText} // ${randomFrom(combatTerms)}`;
        }

        span.textContent = dropText;
        span.className = 'syntax-drop';
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDuration = `${Math.random() * 7 + 7}s`;
        span.style.animationDelay = `${Math.random() * 2.5}s`;
        span.style.fontSize = `${Math.floor(Math.random() * 7) + 13}px`;
        span.style.opacity = `${Math.random() * 0.45 + 0.4}`;

        syntaxBackground.appendChild(span);
    }
}
