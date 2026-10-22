// The user's 48-country learning set, transcribed from the supplied reference.
// Caribbean and Central American countries belong to North America here.
export const priorityGroups = [
  {id:'Asia', ko:'아시아', en:'Asia', codes:['KR','MN','VN','SG','AE','UZ','IN','JP','CN','TH','TR','PH']},
  {id:'Europe', ko:'유럽', en:'Europe', codes:['NL','DK','DE','RU','CH','ES','GB','IT','CZ','PT','FR','FI']},
  {id:'NorthAmerica', ko:'북아메리카', en:'North America', codes:['MX','US','CA','DO','CR','CU']},
  {id:'SouthAmerica', ko:'남아메리카', en:'South America', codes:['VE','BO','BR','AR','UY','CL','CO','PE']},
  {id:'Africa', ko:'아프리카', en:'Africa', codes:['GH','NG','ZA','BW','ET','EG','KE','TZ']},
  {id:'Oceania', ko:'오세아니아', en:'Oceania', codes:['NZ','AU']},
];
export const priorityCountryCodes = priorityGroups.flatMap(group => group.codes);

// Classroom names match the supplied cards; keep former labels as search aliases.
export const classroomNames = {
  KR:{ko:'대한민국',en:'Republic of Korea'},
  KP:{ko:'북한',en:'North Korea'},
  MN:{ko:'몽골'},
  TR:{ko:'튀르키예'},
  ZA:{ko:'남아프리카공화국'},
};
