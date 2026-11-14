// Иллюстрации для секции «Всё для удобных платежей».
// Цвета берутся из CSS-переменной --c карточки (см. Features.css: классы a1, a2, a3, w).
const F = 'font-family="Onest,system-ui,sans-serif"'

export const ART = {
	guarantee: `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
    <circle class="a2" cx="80" cy="80" r="78"/>
    <g class="a1"><rect x="44" y="44" width="72" height="72" rx="18"/><rect x="44" y="44" width="72" height="72" rx="18" transform="rotate(30 80 80)"/><rect x="44" y="44" width="72" height="72" rx="18" transform="rotate(60 80 80)"/></g>
    <path d="M60 81l14 14 27-29" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="a3" cx="132" cy="34" r="9"/><circle class="a3" cx="26" cy="124" r="6"/></svg>`,

	issue: `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
    <circle class="a2" cx="80" cy="80" r="78"/>
    <rect class="a3" x="40" y="40" width="96" height="62" rx="12" transform="rotate(8 88 71)"/>
    <g transform="rotate(-10 80 80)"><rect class="a1" x="28" y="50" width="96" height="62" rx="12"/>
      <rect class="w" opacity=".9" x="38" y="62" width="18" height="13" rx="3"/>
      <rect class="w" opacity=".5" x="38" y="92" width="44" height="6" rx="3"/><rect class="w" opacity=".5" x="88" y="92" width="22" height="6" rx="3"/></g>
    <circle class="w" cx="122" cy="118" r="23"/><circle class="a1" cx="122" cy="118" r="19"/>
    <path class="w" d="M127 104l-14 18h10l-3 14 15-19h-10z"/></svg>`,

	topup: `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
    <circle class="a2" cx="80" cy="80" r="78"/>
    <circle class="a3" cx="108" cy="76" r="32"/>
    <text class="a1" x="108" y="88" text-anchor="middle" font-size="36" font-weight="700" ${F}>$</text>
    <circle class="a1" cx="56" cy="88" r="36"/>
    <text class="w" x="56" y="101" text-anchor="middle" font-size="38" font-weight="700" ${F}>₽</text>
    <path d="M70 34q22-14 44 0" fill="none" class="a1s" stroke-width="5" stroke-linecap="round"/><path d="M108 24l8 10-12 3" fill="none" class="a1s" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

	cabinet: `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
    <circle class="a2" cx="80" cy="80" r="78"/>
    <rect class="a1" x="50" y="20" width="60" height="120" rx="16"/>
    <rect class="w" x="56" y="32" width="48" height="96" rx="9"/>
    <rect class="a3" x="62" y="42" width="36" height="24" rx="5"/><rect class="a1" x="66" y="48" width="9" height="7" rx="2"/>
    <rect class="a1" x="62" y="78" width="36" height="18" rx="9"/><circle class="w" cx="89" cy="87" r="6.5"/>
    <rect class="a3" x="62" y="106" width="36" height="6" rx="3"/><rect class="a3" x="62" y="116" width="22" height="6" rx="3"/>
    <circle class="a3" cx="128" cy="44" r="10"/><circle class="a3" cx="30" cy="112" r="7"/></svg>`,
}
