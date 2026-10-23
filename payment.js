(function () {
  'use strict';
  const NETWORKS = {
    visa: { id: 'visa', label: 'Visa', lengths: [13, 16, 19], cvcLength: 3 },
    mastercard: { id: 'mastercard', label: 'Mastercard', lengths: [16], cvcLength: 3 },
    amex: { id: 'amex', label: 'American Express', lengths: [15], cvcLength: 4 }
  };
  const digits = value => String(value || '').replace(/\D/g, '');

  function detectNetwork(value) {
    const number = digits(value);
    if (/^4/.test(number)) return NETWORKS.visa;
    if (/^3[47]/.test(number)) return NETWORKS.amex;
    const prefix = Number(number.slice(0, 4));
    if (/^5[1-5]/.test(number) || (number.length >= 4 && prefix >= 2221 && prefix <= 2720)) return NETWORKS.mastercard;
    return null;
  }

  function formatNumber(value) {
    const number = digits(value).slice(0, 19);
    const groups = detectNetwork(number)?.id === 'amex' ? [4, 6, 5, 4] : [4, 4, 4, 4, 3];
    let offset = 0;
    return groups.map(length => {
      const group = number.slice(offset, offset + length);
      offset += length;
      return group;
    }).filter(Boolean).join(' ');
  }

  function passesLuhn(value) {
    const number = digits(value);
    if (!number || /^0+$/.test(number)) return false;
    let sum = 0, double = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = Number(number[i]);
      if (double) { digit *= 2; if (digit > 9) digit -= 9; }
      sum += digit;
      double = !double;
    }
    return sum % 10 === 0;
  }

  function numberError(value) {
    const number = digits(value), network = detectNetwork(number);
    if (!number) return 'Saisissez le numéro de carte.';
    if (!network) return 'Réseau non reconnu. Utilisez une carte Visa, Mastercard ou American Express.';
    if (!network.lengths.includes(number.length) || !passesLuhn(number)) return 'Vérifiez le numéro de carte.';
    return '';
  }

  function formatExpiry(value) {
    const number = digits(value).slice(0, 4);
    return number.length > 2 ? number.slice(0, 2) + ' / ' + number.slice(2) : number;
  }

  function expiryError(value, now = new Date()) {
    const number = digits(value);
    if (number.length !== 4) return 'Saisissez une date au format MM / AA.';
    const month = Number(number.slice(0, 2)), year = 2000 + Number(number.slice(2));
    if (month < 1 || month > 12 || year > now.getFullYear() + 20) return 'Vérifiez la date d’expiration.';
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return 'Cette carte est expirée.';
    return '';
  }

  function cvcError(value, network) {
    const length = network?.cvcLength || 3;
    return new RegExp('^\\d{' + length + '}$').test(String(value || '')) ? '' : `Saisissez les ${length} chiffres du cryptogramme.`;
  }

  function fields() {
    return `<section class="payment-preview payment-entry" aria-labelledby="payment-entry-title">
      <h3 class="sr-only" id="payment-entry-title">Informations de carte</h3>
      <div class="payment-network-logos" aria-label="Réseaux de cartes">
        <span class="payment-network-logo" data-card-network="cb" title="CB : co-marquage possible avec Visa ou Mastercard"><img src="/assets/payments/cb.svg" alt="CB" width="60" height="40"></span>
        <span class="payment-network-logo" data-card-network="visa"><img src="/assets/payments/visa.svg" alt="Visa" width="60" height="40"></span>
        <span class="payment-network-logo" data-card-network="mastercard"><img src="/assets/payments/mastercard.svg" alt="Mastercard" width="60" height="40"></span>
        <span class="payment-network-logo" data-card-network="amex"><img src="/assets/payments/amex.svg" alt="American Express" width="60" height="40"></span>
      </div>
      <label class="payment-number-label" for="card-number">Numéro de carte
        <span class="payment-number-wrap"><input id="card-number" type="text" inputmode="numeric" autocomplete="off" maxlength="23" placeholder="1234 5678 9012 3456" required spellcheck="false" aria-describedby="card-network-status card-number-error"><img id="detected-card-logo" alt="" aria-hidden="true" width="48" height="32" hidden></span>
      </label>
      <p class="payment-network-status" id="card-network-status" role="status" aria-live="polite">Le réseau de votre carte s’affichera automatiquement.</p>
      <p class="payment-error" id="card-number-error" aria-live="polite"></p>
      <div class="form-grid payment-card-details">
        <div><label for="card-expiry">Expiration<input id="card-expiry" type="text" inputmode="numeric" autocomplete="off" maxlength="7" placeholder="MM / AA" required aria-describedby="card-expiry-error"></label><p class="payment-error" id="card-expiry-error" aria-live="polite"></p></div>
        <div><label for="card-cvc">Cryptogramme<input id="card-cvc" type="password" inputmode="numeric" autocomplete="off" maxlength="4" placeholder="123" required aria-describedby="card-cvc-hint card-cvc-error"></label><small id="card-cvc-hint">3 chiffres au dos de la carte.</small><p class="payment-error" id="card-cvc-error" aria-live="polite"></p></div>
      </div>
      <p class="payment-entry-note">Le paiement n’est pas encore activé. Aucun débit ne sera effectué. Les informations de carte ne sont ni enregistrées ni transmises.</p>
    </section>`;
  }

  function setup(form) {
    const number = form.querySelector('#card-number');
    const expiry = form.querySelector('#card-expiry');
    const cvc = form.querySelector('#card-cvc');
    const status = form.querySelector('#card-network-status');
    const icon = form.querySelector('#detected-card-logo');
    const codeHint = form.querySelector('#card-cvc-hint');
    const checked = new Set();

    function setError(input, message) {
      input.setCustomValidity(message);
      input.setAttribute('aria-invalid', String(Boolean(message)));
      form.querySelector('#' + input.id + '-error').textContent = message;
    }
    function check(input) {
      const message = input === number ? numberError(number.value) : input === expiry ? expiryError(expiry.value) : cvcError(cvc.value, detectNetwork(number.value));
      setError(input, message);
      return !message;
    }
    function formatInput(input, formatter) {
      const position = input.selectionStart ?? input.value.length;
      const before = digits(input.value.slice(0, position)).length;
      input.value = formatter(input.value);
      let cursor = 0, count = 0;
      while (cursor < input.value.length && count < before) {
        if (/\d/.test(input.value[cursor])) count++;
        cursor++;
      }
      input.setSelectionRange(cursor, cursor);
    }
    function updateNetwork() {
      const network = detectNetwork(number.value);
      status.textContent = network ? 'Réseau détecté : ' + network.label : number.value ? 'Réseau en cours de détection…' : 'Le réseau de votre carte s’affichera automatiquement.';
      form.querySelectorAll('[data-card-network]').forEach(logo => {
        logo.classList.toggle('is-detected', logo.dataset.cardNetwork === network?.id);
      });
      if (network) {
        icon.src = form.querySelector(`[data-card-network="${network.id}"] img`).src;
      } else { icon.removeAttribute('src'); icon.alt = ''; }
      icon.hidden = !network;
      cvc.placeholder = network?.cvcLength === 4 ? '1234' : '123';
      codeHint.textContent = network?.cvcLength === 4 ? '4 chiffres sur le devant de la carte.' : '3 chiffres au dos de la carte.';
      if (checked.has(cvc)) check(cvc);
    }

    number.addEventListener('input', () => { formatInput(number, formatNumber); updateNetwork(); if (checked.has(number)) check(number); });
    expiry.addEventListener('input', () => { formatInput(expiry, formatExpiry); if (checked.has(expiry)) check(expiry); });
    cvc.addEventListener('input', () => { cvc.value = digits(cvc.value).slice(0, 4); if (checked.has(cvc)) check(cvc); });
    [number, expiry, cvc].forEach(input => {
      input.addEventListener('blur', () => { checked.add(input); check(input); });
      input.addEventListener('invalid', () => { checked.add(input); check(input); });
    });
    function clear() {
      [number, expiry, cvc].forEach(input => { input.value = ''; setError(input, ''); });
      checked.clear(); updateNetwork();
    }
    window.addEventListener('pagehide', clear, { once: true });
    updateNetwork();
    return {
      validate() {
        const valid = [number, expiry, cvc].map(input => { checked.add(input); return check(input); }).every(Boolean);
        if (!valid) form.reportValidity();
        return valid;
      },
      clear
    };
  }

  const api = { detectNetwork, formatNumber, passesLuhn, numberError, formatExpiry, expiryError, cvcError, fields, setup };
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.EOPayment = api;
})();
