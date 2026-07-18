export const emojis = {
  zack: { id: '401543766084943892', name: 'zack' },
  bepsi: { id: '410166385918869504', name: 'bepsi' },
  gkappa: { id: '423160844650676244', name: 'gkappa' },
  letsgo: { id: '436328704059113475', name: 'letsgo' },
  gzack: { id: '610223670123560970', name: 'gzack' },
  party_parrot: { id: '397874122232954901', name: 'party_parrot', animated: true },
  ultrafastparrot: { id: '397874139848769557', name: 'ultrafastparrot', animated: true },
  parrotwave7: { id: '397874137529319425', name: 'parrotwave7', animated: true },
  parrotwave6: { id: '397874138959839233', name: 'parrotwave6', animated: true },
  parrotwave5: { id: '397874134929113088', name: 'parrotwave5', animated: true },
  parrotwave4: { id: '397874133523890178', name: 'parrotwave4', animated: true },
  parrotwave3: { id: '397874131539853322', name: 'parrotwave3', animated: true },
  parrotwave2: { id: '397874132664188930', name: 'parrotwave2', animated: true },
  parrotwave1: { id: '397874130185093131', name: 'parrotwave1', animated: true },
  wendyparrot: { id: '399242434300870658', name: 'wendyparrot', animated: true },
  friday: { id: '461542773741453315', name: 'friday' },
  wowee: { id: '530134993226170369', name: 'wowee' },
  snoop: { id: '808392623621931028', name: 'snoop' },
  feelsbadman: { id: '301512177469227008', name: 'feelsbadman' },
};

export const parrotWaves = [7, 6, 5, 4, 3, 2, 1].map((n) => emojis[`parrotwave${n}`]);

const LETTER_A = 0x1f1e6;
const A_CODE = 'a'.codePointAt(0);

// Regional indicator for a-z, used to spell words with reactions.
export function letter(char) {
  const offset = char.toLowerCase().codePointAt(0) - A_CODE;

  if (offset < 0 || offset > 25) {
    return null;
  }

  return String.fromCodePoint(LETTER_A + offset);
}
