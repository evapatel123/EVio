const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'evio-data.json');
const QUESTIONS_FILE = path.join(DATA_DIR, 'major-questions.json');
const MAJORS_FILE = path.join(DATA_DIR, 'major-profiles.json');

const defaultApplicationSteps = [
  ['Build a balanced college list','Research'],['Confirm application deadlines','Research'],['Review admission requirements','Research'],['Create application accounts','Applications'],['Complete personal information','Applications'],['Draft activities list','Applications'],['Draft honors and awards','Applications'],['Choose recommenders','Recommendations'],['Request recommendation letters','Recommendations'],['Draft personal statement','Essays'],['Revise personal statement','Essays'],['Complete supplemental essays','Essays'],['Proofread all written responses','Essays'],['Prepare testing information','Academics'],['Review transcript and coursework','Academics'],['Complete financial-aid forms','Financial Aid'],['Search and track scholarships','Financial Aid'],['Review application fees or waivers','Applications'],['Final application review','Applications'],['Submit applications and save confirmations','Submission']
].map(([title,category],i)=>({id:`app-${i+1}`,title,category,done:false,order:i+1}));

const defaultDb = {
  profile:{name:'Student',grade:'High School Student',goal:'Explore college and career options'},
  settings:{
    theme:'firefly-dark', reducedMotion:false, reducedTransparency:false, reducedFlashing:false,
    largerText:false, highContrast:false, focusIndicators:true, screenReaderOptimized:false,
    notifications:true, personalizedGuidance:true, hintsBeforeSolutions:true,
    guidanceStyle:'balanced', explanationDepth:'medium', proactiveSuggestions:true, showConfidence:true,
    compactMode:false, glowIntensity:'medium', backgroundEffects:true, cardOpacity:'glass', fontSize:'medium'
  },
  stats:{streak:7},
  tasks:[
    {id:'task-1',title:'Research 3 colleges',meta:'College exploration',due:'Today',tag:'HIGH',done:false},
    {id:'task-2',title:'Complete major quiz',meta:'Major Advisor',due:'Today',tag:'MED',done:false},
    {id:'task-3',title:'Update academic goals',meta:'Planning',due:'Tomorrow',tag:'MED',done:true},
    {id:'task-4',title:'Check scholarship deadlines',meta:'Financial aid',due:'This week',tag:'LOW',done:false}
  ],
  schedule:[
    {id:'slot-1',time:'4:00 PM',title:'Calculus review',meta:'45 min focus block',tone:'green'},
    {id:'slot-2',time:'5:00 PM',title:'College research',meta:'Compare 3 schools',tone:'pink'},
    {id:'slot-3',time:'7:30 PM',title:'Application work',meta:'Activities + notes',tone:'gold'}
  ],
  goals:[{id:'goal-1',title:'Explore majors',progress:80},{id:'goal-2',title:'Research colleges',progress:60},{id:'goal-3',title:'Build study habits',progress:45}],
  study:{dailyGoal:1.5,weeklyGoal:6,weeklyHours:4.5,dailyHours:0,date:new Date().toISOString().slice(0,10)},
  application:{steps:defaultApplicationSteps},
  explore:{events:[],categories:{major:0,college:0,application:0,resources:0,planning:0}},
  collegeFit:{answers:null,score:0,completed:false},
  applicationStory:{answers:null,completed:false},
  resources:[
    {id:'res-1',title:'Common App',category:'applications',label:'APPLICATIONS',description:'Application guidance, essays, deadlines, and requirements.',url:'https://www.commonapp.org/'},
    {id:'res-2',title:'BigFuture',category:'college',label:'COLLEGE SEARCH',description:'College search, planning tools, and scholarship resources.',url:'https://bigfuture.collegeboard.org/'},
    {id:'res-3',title:'Federal Student Aid',category:'financial',label:'FINANCIAL AID',description:'FAFSA information and federal financial aid guidance.',url:'https://studentaid.gov/'},
    {id:'res-4',title:'College Scorecard',category:'college',label:'COLLEGE DATA',description:'Compare college costs, outcomes, and institutional statistics.',url:'https://collegescorecard.ed.gov/'},
    {id:'res-5',title:'Khan Academy',category:'learning',label:'LEARNING',description:'Free academic practice and skill-building resources.',url:'https://www.khanacademy.org/'},
    {id:'res-6',title:'O*NET Online',category:'careers',label:'CAREERS',description:'Explore careers, skills, interests, and occupational pathways.',url:'https://www.onetonline.org/'},
    {id:'res-7',title:'BLS Occupational Outlook',category:'careers',label:'CAREER DATA',description:'Career information, job outlook, and occupational data.',url:'https://www.bls.gov/ooh/'},
    {id:'res-8',title:'Purdue OWL',category:'applications',label:'WRITING',description:'Writing, citation, and academic communication guidance.',url:'https://owl.purdue.edu/'},
    {id:'res-9',title:'NACAC',category:'college',label:'COLLEGE GUIDANCE',description:'Professional college admission counseling resources.',url:'https://www.nacacnet.org/'}
  ],
  quizResults:[]
};

function clone(x){return JSON.parse(JSON.stringify(x));}
function ensureDb(){if(!fs.existsSync(DATA_DIR))fs.mkdirSync(DATA_DIR,{recursive:true});if(!fs.existsSync(DB_FILE))writeDb(clone(defaultDb));}
function writeDb(db){fs.writeFileSync(DB_FILE,JSON.stringify(db,null,2));}
function readDb(){ensureDb();try{return JSON.parse(fs.readFileSync(DB_FILE,'utf8'));}catch{writeDb(clone(defaultDb));return clone(defaultDb);}}
function send(res,status,data,type='application/json'){res.writeHead(status,{'Content-Type':`${type}; charset=utf-8`,'Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(type==='application/json'?JSON.stringify(data):data);}
function body(req){return new Promise((resolve,reject)=>{let raw='';req.on('data',c=>raw+=c);req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{});}catch(e){reject(e);}});});}
function safePath(urlPath){const clean=decodeURIComponent(urlPath.split('?')[0]);const target=clean==='/'?'/index.html':clean;const full=path.normalize(path.join(ROOT,target));return full.startsWith(ROOT)?full:null;}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function applicationProgress(db){const steps=db.application.steps||[];return steps.length?Math.round(steps.filter(s=>s.done).length/steps.length*100):0;}
function weekKey(date=new Date()){const d=new Date(date);const day=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-day);return d.toISOString().slice(0,10);}
function resetStudyPeriod(db){const today=new Date().toISOString().slice(0,10);const wk=weekKey();if(db.study.date!==today)db.study.dailyHours=0;if(db.study.weekKey!==wk)db.study.weeklyHours=0;db.study.date=today;db.study.weekKey=wk;}
function studyStats(db){resetStudyPeriod(db);return {...db.study,weeklyProgress:db.study.weeklyGoal?Math.min(100,Math.round(db.study.weeklyHours/db.study.weeklyGoal*100)):0,dailyProgress:db.study.dailyGoal?Math.min(100,Math.round(db.study.dailyHours/db.study.dailyGoal*100)):0};}
function exploreScore(db){
  const c=db.explore.categories||{}; const quiz= db.quizResults.length?20:0;
  const college=db.collegeFit.completed?25:0; const story=db.applicationStory.completed?20:0;
  const resource=Math.min(15,(c.resources||0)*3); const planning=Math.min(20,(c.planning||0)*4);
  return clamp(quiz+college+story+resource+planning,0,100);
}
function recommendations(db){
  const items=[
    {id:'major',title:'Major exploration',desc:'Compare pathways using your interests and quiz results.',score:db.quizResults.length?100:0,page:'quiz'},
    {id:'college',title:'College fit',desc:'Rate the factors that matter most to you and save a fit profile.',score:db.collegeFit.completed?100:0,action:'college-fit'},
    {id:'application',title:'Application story',desc:'Connect your experiences, growth, and impact into a clearer story.',score:db.applicationStory.completed?100:0,action:'application-story'}
  ];
  return items.sort((a,b)=>a.score-b.score);
}

ensureDb();
const server=http.createServer(async(req,res)=>{
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type'});return res.end();}
  const parsed=new URL(req.url,`http://${req.headers.host||'localhost'}`),p=parsed.pathname;let db=readDb();
  try{
    if(p==='/api/health'&&req.method==='GET')return send(res,200,{ok:true,service:'EVio backend',chatbot:'external iframe'});
    if(p==='/api/state'&&req.method==='GET')return send(res,200,{profile:db.profile,settings:db.settings,stats:{...db.stats,applicationProgress:applicationProgress(db),...studyStats(db),exploreScore:exploreScore(db)},tasks:db.tasks,schedule:db.schedule,goals:db.goals,quizResults:db.quizResults.slice(-10),application:db.application,explore:{score:exploreScore(db),recommendations:recommendations(db)},collegeFit:db.collegeFit,applicationStory:db.applicationStory});
    if(p==='/api/dashboard'&&req.method==='GET')return send(res,200,{profile:db.profile,stats:{...db.stats,applicationProgress:applicationProgress(db),...studyStats(db),exploreScore:exploreScore(db)},tasks:db.tasks,application:db.application,explore:{score:exploreScore(db),recommendations:recommendations(db)},collegeFit:db.collegeFit,applicationStory:db.applicationStory});
    if(p==='/api/resources'&&req.method==='GET')return send(res,200,db.resources);
    if(p==='/api/profile'&&req.method==='PUT'){const b=await body(req);db.profile={...db.profile,...b};writeDb(db);return send(res,200,db.profile);}
    if(p==='/api/settings'&&req.method==='PUT'){const b=await body(req);db.settings={...db.settings,...b};writeDb(db);return send(res,200,db.settings);}

    if(p==='/api/tasks'&&req.method==='GET')return send(res,200,db.tasks);
    if(p==='/api/tasks'&&req.method==='POST'){const b=await body(req);const task={id:`task-${crypto.randomUUID()}`,title:String(b.title||'New task'),meta:String(b.meta||'Personal task'),due:String(b.due||'This week'),tag:String(b.tag||'MED').toUpperCase(),done:false};db.tasks.push(task);writeDb(db);return send(res,201,task);}
    const taskMatch=p.match(/^\/api\/tasks\/([^/]+)$/);if(taskMatch&&['PATCH','DELETE'].includes(req.method)){const i=db.tasks.findIndex(t=>t.id===taskMatch[1]);if(i<0)return send(res,404,{error:'Task not found'});if(req.method==='DELETE'){const[x]=db.tasks.splice(i,1);writeDb(db);return send(res,200,x);}const b=await body(req);db.tasks[i]={...db.tasks[i],...b};writeDb(db);return send(res,200,db.tasks[i]);}

    if(p==='/api/schedule'&&req.method==='GET')return send(res,200,db.schedule);
    if(p==='/api/schedule'&&req.method==='POST'){const b=await body(req);const item={id:`slot-${crypto.randomUUID()}`,time:String(b.time||'6:00 PM'),title:String(b.title||'Study session'),meta:String(b.meta||'Focus block'),tone:['green','pink','gold'].includes(b.tone)?b.tone:'green'};db.schedule.push(item);writeDb(db);return send(res,201,item);}
    const sm=p.match(/^\/api\/schedule\/([^/]+)$/);if(sm&&req.method==='DELETE'){const i=db.schedule.findIndex(x=>x.id===sm[1]);if(i<0)return send(res,404,{error:'Schedule item not found'});const[x]=db.schedule.splice(i,1);writeDb(db);return send(res,200,x);}

    if(p==='/api/goals'&&req.method==='GET')return send(res,200,db.goals);
    if(p==='/api/goals'&&req.method==='POST'){const b=await body(req);const goal={id:`goal-${crypto.randomUUID()}`,title:String(b.title||'New goal'),progress:clamp(Number(b.progress)||0,0,100)};db.goals.push(goal);writeDb(db);return send(res,201,goal);}
    const gm=p.match(/^\/api\/goals\/([^/]+)$/);if(gm&&req.method==='PATCH'){const i=db.goals.findIndex(x=>x.id===gm[1]);if(i<0)return send(res,404,{error:'Goal not found'});const b=await body(req);db.goals[i]={...db.goals[i],...b,progress:clamp(Number(b.progress??db.goals[i].progress)||0,0,100)};writeDb(db);return send(res,200,db.goals[i]);}

    // Study goals + logged hours. These values drive the dashboard directly.
    if(p==='/api/study'&&req.method==='GET')return send(res,200,studyStats(db));
    if(p==='/api/study'&&req.method==='PUT'){const b=await body(req);resetStudyPeriod(db);if(b.dailyGoal!==undefined)db.study.dailyGoal=clamp(Number(b.dailyGoal)||0,0,24);if(b.weeklyGoal!==undefined)db.study.weeklyGoal=clamp(Number(b.weeklyGoal)||0,0,168);writeDb(db);return send(res,200,studyStats(db));}
    if(p==='/api/study/log'&&req.method==='POST'){const b=await body(req);resetStudyPeriod(db);const hours=clamp(Number(b.hours)||0,0,24);db.study.dailyHours+=hours;db.study.weeklyHours+=hours;db.explore.categories.planning=(db.explore.categories.planning||0)+1;writeDb(db);return send(res,201,studyStats(db));}

    // Full application checklist. Progress is calculated from this list.
    if(p==='/api/application'&&req.method==='GET')return send(res,200,{steps:db.application.steps,progress:applicationProgress(db)});
    const am=p.match(/^\/api\/application\/([^/]+)$/);if(am&&req.method==='PATCH'){const i=db.application.steps.findIndex(x=>x.id===am[1]);if(i<0)return send(res,404,{error:'Application step not found'});const b=await body(req);db.application.steps[i]={...db.application.steps[i],done:!!b.done};db.explore.categories.application=Math.max(0,(db.explore.categories.application||0)+(b.done?1:-1));writeDb(db);return send(res,200,{step:db.application.steps[i],progress:applicationProgress(db)});}
    if(p==='/api/application/reset'&&req.method==='POST'){db.application.steps=clone(defaultApplicationSteps);writeDb(db);return send(res,200,{steps:db.application.steps,progress:0});}

    // Explore score events.
    if(p==='/api/explore'&&req.method==='GET')return send(res,200,{score:exploreScore(db),categories:db.explore.categories,recommendations:recommendations(db),collegeFit:db.collegeFit,applicationStory:db.applicationStory});
    if(p==='/api/explore/event'&&req.method==='POST'){const b=await body(req);const category=['major','college','application','resources','planning'].includes(b.category)?b.category:'planning';db.explore.events.push({id:crypto.randomUUID(),category,action:String(b.action||'explored'),createdAt:new Date().toISOString()});db.explore.categories[category]=(db.explore.categories[category]||0)+1;writeDb(db);return send(res,201,{score:exploreScore(db),categories:db.explore.categories,recommendations:recommendations(db)});}
    if(p==='/api/explore/college-fit'&&req.method==='POST'){const b=await body(req);const vals=['size','location','cost','culture','programs'].map(k=>clamp(Number(b[k])||0,1,5));const score=Math.round(vals.reduce((a,x)=>a+x,0)/25*100);db.collegeFit={answers:b,score,completed:true};db.explore.categories.college=Math.max(db.explore.categories.college||0,1);db.explore.events.push({id:crypto.randomUUID(),category:'college',action:'completed college fit',createdAt:new Date().toISOString()});writeDb(db);return send(res,200,{collegeFit:db.collegeFit,score:exploreScore(db),recommendations:recommendations(db)});}
    if(p==='/api/explore/application-story'&&req.method==='POST'){const b=await body(req);const required=['experience','growth','impact','future'];const complete=required.every(k=>String(b[k]||'').trim().length>=8);if(!complete)return send(res,400,{error:'Complete all four story prompts with at least 8 characters each.'});db.applicationStory={answers:b,completed:true};db.explore.categories.application=Math.max(db.explore.categories.application||0,1);db.explore.events.push({id:crypto.randomUUID(),category:'application',action:'completed application story',createdAt:new Date().toISOString()});writeDb(db);return send(res,200,{applicationStory:db.applicationStory,score:exploreScore(db),recommendations:recommendations(db)});}

    // Major advisor: 506-item bank + server-side scoring against major profiles.
    if(p==='/api/quiz/questions'&&req.method==='GET'){const count=clamp(Number(parsed.searchParams.get('count'))||24,12,40);const all=JSON.parse(fs.readFileSync(QUESTIONS_FILE,'utf8'));const seed=crypto.randomBytes(8).readBigUInt64BE(0);let arr=all.map((q,i)=>({q,i,sort:Number((BigInt(i)*BigInt(1103515245)+seed)%BigInt(2147483647))})).sort((a,b)=>a.sort-b.sort).slice(0,count).map(x=>x.q);return send(res,200,{totalAvailable:all.length,count,questions:arr});}
    if(p==='/api/quiz/results'&&req.method==='POST'){
      const b=await body(req);const bank=JSON.parse(fs.readFileSync(QUESTIONS_FILE,'utf8'));const byId=new Map(bank.map(q=>[q.id,q]));const answers=b.answers||[];const totals={};const detail=[];
      answers.forEach(x=>{const q=byId.get(x.questionId);if(!q)return;const a=q.a[Number(x.optionIndex)];if(!a)return;for(const tag of a.tags)totals[tag]=(totals[tag]||0)+1;detail.push({questionId:q.id,optionIndex:Number(x.optionIndex)});});
      const profiles=JSON.parse(fs.readFileSync(MAJORS_FILE,'utf8'));const ranked=profiles.map(m=>{let raw=0;for(const tag of m.tags)raw+=(totals[tag]||0);return {...m,raw};}).sort((a,b)=>b.raw-a.raw);const max=ranked[0]?.raw||0;const top=ranked.slice(0,5).map(m=>({major:m.name,match:max?Math.round(m.raw/max*100):0}));
      const result={id:crypto.randomUUID(),createdAt:new Date().toISOString(),recommendation:top[0]?.major||'Explore more pathways',top,answers:detail,questionCount:detail.length};db.quizResults.push(result);db.explore.categories.major=Math.max(db.explore.categories.major||0,1);db.explore.events.push({id:crypto.randomUUID(),category:'major',action:'completed major assessment',createdAt:new Date().toISOString()});writeDb(db);return send(res,201,result);
    }
    if(p==='/api/quiz/results'&&req.method==='GET')return send(res,200,db.quizResults.slice(-20));

    const file=safePath(p);if(!file||!fs.existsSync(file)||fs.statSync(file).isDirectory())return send(res,404,{error:'Not found'});const ext=path.extname(file).toLowerCase();const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.txt':'text/plain','.json':'application/json'}[ext]||'application/octet-stream';return send(res,200,fs.readFileSync(file),mime);
  }catch(err){console.error(err);return send(res,500,{error:'Server error',detail:process.env.NODE_ENV==='development'?err.message:undefined});}
});
server.listen(PORT,()=>console.log(`EVio running at http://localhost:${PORT}`));
