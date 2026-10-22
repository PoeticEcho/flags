export const nameColours=['파란','검정','노란','흰','빨간','초록','보라','분홍','주황','갈색','회색','하늘색','남색','연두','민트색','청록','금빛','은빛','살구색','자주색'];
export const nameAnimals=['코뿔소','참새','기린','양','사자','호랑이','코끼리','토끼','여우','곰','고래','돌고래','펭귄','부엉이','사슴','다람쥐','판다','수달','고양이','강아지'];
const combinations=nameColours.flatMap(colour=>nameAnimals.map(animal=>colour+animal));

export function resolveCountryName(art,gallery,random=Math.random) {
 const entered=art.countryName?.trim().slice(0,60);
 if(entered)return entered;
 const used=new Set(gallery.filter(item=>item.custom&&item.id!==art.savedCountryId).map(item=>item.countryName?.trim()));
 const available=combinations.filter(name=>!used.has(name));
 if(available.length)return available[Math.floor(random()*available.length)];
 // Exhaust the 400 plain names before using a numbered name; skip existing
 // numbered names too, including names entered by the user.
 const base=combinations[Math.floor(random()*combinations.length)];
 let number=2;
 while(used.has(base+number))number++;
 return base+number;
}
