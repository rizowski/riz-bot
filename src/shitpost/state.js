// In-memory toggle; resets to enabled on restart, matching the always-on
// behavior of the original shitpost-bot-rs.
let enabled = true;

export function isEnabled() {
  return enabled;
}

export function setEnabled(value) {
  enabled = value;
}
