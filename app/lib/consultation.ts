// Demo-only scheduling rules. Replace this adapter when a real calendar is connected.
export const consultationConfig = {
  timezone: 'Europe/London',
  windowDays: 60,
  duration: 30,
  formats: ['Telephone', 'Video', 'In person'],
  weekly: {5: {start: 9 * 60, end: 17 * 60}} as Record<number, {start: number; end: number}>,
};
export const concerns = ['Receding hairline', 'Thinning hair', 'Baldness', 'Transplant scar', 'Alopecia', 'Other'];
export function londonNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {timeZone: consultationConfig.timezone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).formatToParts(now);
  const get = (name:string) => parts.find(p => p.type === name)!.value;
  return {day: `${get('year')}-${get('month')}-${get('day')}`, minute: Number(get('hour')) * 60 + Number(get('minute'))};
}
export function dateValue(day:string) {return new Date(`${day}T12:00:00Z`)}
export function addDays(day:string, count:number) {const d=dateValue(day); d.setUTCDate(d.getUTCDate()+count); return d.toISOString().slice(0,10)}
export function monthDays(month:string) {
  const first=dateValue(`${month}-01`);
  const count=new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate();
  return {offset:(first.getUTCDay()+6)%7,days:Array.from({length:count},(_,i)=>`${month}-${String(i+1).padStart(2,'0')}`)};
}
export function shiftMonth(month:string, amount:number) {const d=dateValue(`${month}-01`);d.setUTCMonth(d.getUTCMonth()+amount);return d.toISOString().slice(0,7)}
function hash(value:string) {return [...value].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7)}
export function slotsFor(day:string, now=new Date()) {
  const current=londonNow(now);
  if(day<current.day || day>addDays(current.day,consultationConfig.windowDays))return [];
  const hours=consultationConfig.weekly[dateValue(day).getUTCDay()];
  if(!hours)return [];
  const seed=hash(day), full=seed%7===0, limited=seed%3===0;
  const count=Math.floor((hours.end-hours.start)/consultationConfig.duration);
  return Array.from({length:count},(_,i)=>{
    const minute=hours.start+i*consultationConfig.duration;
    const available=!full && (limited ? i===seed%count || i===(seed+5)%count : hash(`${day}:${i}`)%5>0) && !(day===current.day&&minute<=current.minute);
    return {time:`${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`,available};
  });
}
export function displayDay(day:string) {return new Intl.DateTimeFormat('en-GB',{timeZone:consultationConfig.timezone,weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(dateValue(day))}
export function displayTime(time:string) {const [h,m]=time.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h<12?'am':'pm'}`}
export function photoError(file:Pick<File,'type'|'size'>) {if(!['image/jpeg','image/png','image/webp'].includes(file.type))return 'Choose a JPG, PNG or WebP image.';if(file.size>5*1024*1024)return 'Each photograph must be 5 MB or smaller.';if(file.size===0)return 'This file is empty. Please choose another photograph.';return '';}
