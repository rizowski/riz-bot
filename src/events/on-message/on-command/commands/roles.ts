interface Features {
  match: RegExp;
  roleId: string;
}

export const features: Features[] = [
  {
    match: /plex/i,
    roleId: '572168140998443011',
  },
  {
    match: /admin|bot/i,
    roleId: '572120296052752394',
  },
  {
    match: /dota/i,
    roleId: '579118074720944160',
  },
];
