const API_BASE='http://localhost:3000';
const trendingContainer=document.getElementById('trendingContainer');
const latestContainer=document.getElementById('latestContainer');
const searchModal=document.getElementById('searchModal');
const detailModal=document.getElementById('detailModal');
const readerModal=document.getElementById('readerModal');
const loadingSpinner=document.getElementById('loadingSpinner');
const searchResultsContainer=document.getElementById('searchResultsContainer');
let currentMangaData=null;
let currentChapterIndex=0;
let allChapters=[];
let currentChapterNumber=null;
let currentTab='manga';

document.addEventListener('DOMContentLoaded',()=>{
loadAllTrending();
loadAllLatest();
});

function showLoading(){loadingSpinner.classList.remove('hidden');}
function hideLoading(){loadingSpinner.classList.add('hidden');}
function switchTab(tab){
currentTab='manga';
console.log('Switching to tab: manga');
loadAllTrending();
loadAllLatest();
}

async function loadAllTrending(){
try{
showLoading();
trendingContainer.innerHTML='';
let eps=[
{url:API_BASE+'/manga/mangadex/trending',type:'manga'},
{url:API_BASE+'/manga/mangakakalot/trending',type:'manga'},
{url:API_BASE+'/manga/mangapark/trending',type:'manga'},
{url:API_BASE+'/manga/managreader/trending',type:'manga'},
{url:API_BASE+'/manga/mangapill/trending',type:'manga'},
{url:API_BASE+'/manga/mangasee123/trending',type:'manga'}
];
console.log('Endpoints to fetch:', eps);
let all=[];
for(let e of eps){
try{
let r=await fetch(e.url);
let d=await r.json();
console.log('Fetch from '+e.url+':', d);
let res=d.results||d||[];
if(Array.isArray(res)){res.forEach(i=>{i._type=e.type;i._provider=e.url.split('/')[4];});all.push(...res);}
}catch(err){console.error('Error fetching '+e.url+':', err);}
}
if(all.length>0){all.slice(0,24).forEach(i=>{trendingContainer.appendChild(createMangaCard(i))});}
else{trendingContainer.innerHTML='<p style="color:var(--text-secondary);text-align:center;grid-column:1/-1;">No items</p>';}
}catch(e){console.error('Trending error:',e);trendingContainer.innerHTML='<p style="color:var(--text-secondary);">Backend connection error. Make sure API is running on port 3000</p>';}
finally{hideLoading();}
}

async function loadAllLatest(){
try{
showLoading();
latestContainer.innerHTML='';
let eps=[
{url:API_BASE+'/manga/mangadex/recent',type:'manga'},
{url:API_BASE+'/manga/mangakakalot/recent',type:'manga'},
{url:API_BASE+'/manga/mangapark/recent',type:'manga'},
{url:API_BASE+'/manga/managreader/recent',type:'manga'},
{url:API_BASE+'/manga/mangapill/recent',type:'manga'},
{url:API_BASE+'/manga/mangasee123/recent',type:'manga'}
];
let all=[];
for(let e of eps){
try{
let r=await fetch(e.url);
let d=await r.json();
console.log('Fetch from '+e.url+':', d);
let res=d.results||d||[];
if(Array.isArray(res)){res.forEach(i=>{i._type=e.type;i._provider=e.url.split('/')[4];});all.push(...res);}
}catch(err){console.error('Error fetching '+e.url+':', err);}
}
if(all.length>0){all.slice(0,24).forEach(i=>{latestContainer.appendChild(createMangaCard(i))});}
else{latestContainer.innerHTML='<p style="color:var(--text-secondary);text-align:center;grid-column:1/-1;">No items</p>';}
}catch(e){console.error('Latest error:',e);latestContainer.innerHTML='<p style="color:var(--text-secondary);">Backend connection error. Make sure API is running on port 3000</p>';}
finally{hideLoading();}
}

function createMangaCard(item){
let card=document.createElement('div');
card.className='manga-card';
let title=item.title||item.name||'Unknown';
let image=item.image||item.cover||'https://via.placeholder.com/200x280';
let rating=item.rating||item.score||7.5;
let type=item._type||'manga';
let provider=item._provider||'unknown';
card.innerHTML='<div class=\"manga-image-wrapper\"><img src=\"'+image+'\" alt=\"'+title+'\" class=\"manga-image\"><div class=\"manga-rating\">'+rating.toFixed(1)+'</div></div><div class=\"manga-info\"><div class=\"manga-title\">'+title+'</div></div>';
card.addEventListener('click',async()=>{
let data=await loadDetails(item.id,type,provider);
// If loadDetails returns null, use the card data as fallback
if(!data){
data=item;
}
// Make sure data has all required properties
if(!data._type) data._type=type;
if(!data._provider) data._provider=provider;
if(!data.id) data.id=item.id;

// Set allChapters from either the loaded data or card data
if(Array.isArray(data.chapters)&&data.chapters.length>0){
allChapters=data.chapters;
console.log('Using chapters from data:', allChapters.length);
}else if(Array.isArray(item.chapters)&&item.chapters.length>0){
allChapters=item.chapters;
console.log('Using chapters from item:', allChapters.length);
}else{
allChapters=[];
console.log('No chapters found');
}

showDetailModal(data);
});
return card;
}

async function loadDetails(id,type,provider){
try{
showLoading();
let endpoint='';
console.log('Loading details - ID:', id, 'Type:', type, 'Provider:', provider);

let providers=[];
providers=[provider||'mangadex', 'mangakakalot', 'mangapark', 'managreader', 'mangapill'];

let response=null;
let data=null;
let failedProviders=[];

for(let p of providers){
try{
let testEndpoint=API_BASE+'/manga/'+p+'/info/'+encodeURIComponent(id);
console.log('Trying provider:', p, 'Endpoint:', testEndpoint);
let testResponse=await fetch(testEndpoint);
console.log('Response status:', testResponse.status);
if(testResponse.ok){
let testData=await testResponse.json();
console.log('Provider '+p+' response:', testData);
// Check if response has meaningful data (title and at least some content)
let hasTitle=testData.title&&testData.title.trim()!=='';
let hasChapters=testData.chapters&&(Array.isArray(testData.chapters)?testData.chapters.length>0:testData.chapters>0);
let hasDesc=false;
if(typeof testData.description==='string'){
  hasDesc=testData.description&&testData.description.trim()!=='';
}else if(typeof testData.description==='object'&&testData.description){
  hasDesc=Object.keys(testData.description).length>0;
}
if(hasTitle||(hasChapters||hasDesc)){
// Valid response - use it
response=testResponse;
provider=p;
data=testData;
console.log('Successfully loaded valid details from provider:', provider);
break;
}else{
console.log('Provider '+p+' returned empty data, trying next...');
failedProviders.push(p+' (empty data)');
}
}else{
failedProviders.push(p+' ('+testResponse.status+')');
}
}catch(error){
console.error('Error trying provider '+p+':', error);
failedProviders.push(p+' (error)');
}
}

if(!response||!data){
console.error('All providers failed:',failedProviders);
console.log('Falling back to basic data');
hideLoading();
// Return null so we use the card data
return null;
}

console.log('Details loaded:', data);
data._type='manga';
data._provider=provider;
// Extract chapters - ensure it's an array
allChapters=[];
if(Array.isArray(data.chapters)){
allChapters=data.chapters;
console.log('Found chapters array:', allChapters.length);
}
else if(Array.isArray(data.content)){
allChapters=data.content;
console.log('Found content array:', allChapters.length);
}
else if(Array.isArray(data.data)){
allChapters=data.data;
console.log('Found data array:', allChapters.length);
}
else {
console.log('No chapters array found. Data has these keys:', Object.keys(data));
}
console.log('Chapters found:', allChapters.length);
hideLoading();
return data;
}catch(error){
console.error('Error loading details:',error);
hideLoading();
return null;
}
}

function showDetailModal(data){
let detailContent=document.getElementById('detailContent');
console.log('Raw API data:', data);
console.log('Data keys:', Object.keys(data));
console.log('AllChapters:', allChapters);

// Try multiple field names for each property
let title=data.title||data.name||'Unknown';
let image=data.image||data.cover||data.poster||'https://via.placeholder.com/200x280';
// Handle description - could be string or object with language keys
let desc='No description available';
if(typeof data.description==='string'&&data.description&&data.description.trim()!==''){
desc=data.description;
}else if(typeof data.description==='object'&&data.description){
// Try to get English description first, then any available language
desc=data.description.en||data.description.en||Object.values(data.description)[0]||'No description available';
}else if(data.synopsis&&data.synopsis.trim()!==''){
desc=data.synopsis;
}else if(data.plot&&data.plot.trim()!==''){
desc=data.plot;
}
let genres=data.genres||data.type||[];
let status=data.status||'Unknown';

// Extract chapters - use the global allChapters array that was set
let chapters=allChapters.length>0?allChapters:[];

console.log('Extracted - Title:', title, 'Image:', image, 'Description:', desc);
console.log('Chapters data:', chapters, 'Length:', chapters.length);

let html='<div class=\"detail-header\"><div class=\"detail-cover\"><img src=\"'+image+'\" alt=\"'+title+'\" onerror=\"this.src=\\\"https://via.placeholder.com/200x280\\\"\"></div><div class=\"detail-info\"><h2>'+title+'</h2><div class=\"detail-meta\"><div class=\"meta-item\"><span>Status:</span><span class=\"meta-value\">'+status+'</span></div></div><div class=\"detail-description\">'+desc+'</div></div></div>';

if(chapters.length>0){
  html+='<div class=\"chapters-list\"><h3>Chapters ('+chapters.length+' total)</h3><div style=\"max-height:400px;overflow-y:auto;\">';
  let mangaId=(data.id||'unknown').toString().replace(/'/g, "\\'");
  let mangaProvider=(data._provider||'mangadex').toString().replace(/'/g, "\\'");
  for(let i=0;i<chapters.length;i++){
    let ch=chapters[i];
    let chId=ch.id||ch.url||ch.link||i; // Fallback to index if no id
    let chTitle=ch.title||ch.name||ch.chapter||'Chapter '+(i+1);
    let chIdStr=String(chId).replace(/'/g, "\\'");
    console.log('Chapter '+i+':', {id: chId, title: chTitle, mangaId: mangaId});
    html+='<div class=\"chapter-item\" onclick=\"readChapter(\''+chIdStr+'\', \''+mangaId+'\', \'manga\', '+i+', \''+mangaProvider+'\')\"><div class=\"chapter-title\">Chapter '+chTitle+'</div></div>';
  }
  html+='</div></div>';
} else {
  html+='<div class=\"chapters-list\"><p style=\"color: var(--text-secondary);\">No chapters found. The provider may not have this title cached.</p></div>';
}

detailContent.innerHTML=html;
detailModal.classList.remove('hidden');
}

function closeDetailModal(){detailModal.classList.add('hidden');}
async function readChapter(chapterId,mangaId,type,index,provider){
console.log('readChapter called with:', {chapterId, mangaId, type, index, provider});
console.log('allChapters length:', allChapters.length);
console.log('allChapters['+index+']:', allChapters[index]);

currentMangaData={id:mangaId,type:'manga',mangaType:'manga',_provider:provider||'mangadex'};
currentChapterIndex=index||0;
if(allChapters[currentChapterIndex]){
currentChapterNumber=allChapters[currentChapterIndex].title||allChapters[currentChapterIndex].name||allChapters[currentChapterIndex].chapter||(currentChapterIndex+1);
}else{
currentChapterNumber=currentChapterIndex+1;
}
closeDetailModal();
closeSearchModal();
await loadAndDisplayChapter(chapterId);
}

async function loadAndDisplayChapter(chapterId){
try{
showLoading();
let endpoint;
let provider=currentMangaData._provider||'mangadex';
endpoint=API_BASE+'/manga/'+provider+'/read/'+encodeURIComponent(chapterId);
console.log('Fetching from endpoint:', endpoint);
console.log('Current manga data:', currentMangaData);
let response=await fetch(endpoint);
console.log('Response status:', response.status);
if(!response.ok){
try{
let errorData=await response.json();
console.error('API Error:', errorData);
}catch(e){}
throw new Error('API returned status '+response.status+'. Provider: '+provider+'. This might be a provider API issue. Try again later.');
}
let data=await response.json();
console.log('Raw chapter data:', data);
let pages=[];
// Try different property names for pages
if(Array.isArray(data)){
  pages=data;
  console.log('Response is direct array, length:', pages.length);
}else if(data.pages){
  pages=data.pages;
}else if(data.sources){
  pages=data.sources;
}else{
  pages=[];
}
console.log('Pages extracted:', pages.length, 'items');
// Filter to only get valid items - string URLs or objects with image/url properties
pages=pages.filter(p=>{
  if(typeof p==='string'&&p.length>0&&p.startsWith('http')) return true;
  if(typeof p==='object'&&(p.img||p.image||p.url||p.link)) return true;
  return false;
});
console.log('Pages after filtering:', pages.length, 'items');
if(pages.length===0){
console.warn('No pages found - provider may not have this chapter cached');
console.log('Response was:', data);
alert('No pages found for this chapter. This provider may not have the content cached or available right now. Try another provider or check back later.');
hideLoading();
return;
}
hideLoading();
showReaderPage(pages,chapterId);
}catch(error){
console.error('Error loading chapter:',error);
hideLoading();
alert('Error loading chapter: '+error.message);
}
}

function showReaderPage(pages,chapterId){
let mainContent=document.querySelector('.main-content');
let originalHTML=mainContent.innerHTML;
mainContent.innerHTML='';
let html='<div style="background:var(--bg-dark);min-height:100vh;padding:20px 0;">';
html+='<div class="container"><button onclick="backToHome()" style="background:var(--primary-color);color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;margin-bottom:20px;font-weight:600;">← Back to Manga</button></div>';
html+='<div class="container">';
html+='<div style="display:grid;gap:15px;grid-template-columns:repeat(auto-fit,minmax(100%,1fr));">';
if(Array.isArray(pages)){
pages.forEach((p,i)=>{
let img=p.img||p.image||'';
if(img){html+='<div style="border:1px solid var(--border-color);border-radius:8px;overflow:hidden;background:var(--bg-card);"><img src=\"'+img+'\" style=\"width:100%;display:block;\" onerror=\"this.src=\\\"https://via.placeholder.com/600x800?text=Error\\\"\"></div>';}
});
}else if(pages.pages){
pages.pages.forEach((p,i)=>{
let img=p.img||p.image||'';
if(img){html+='<div style="border:1px solid var(--border-color);border-radius:8px;overflow:hidden;background:var(--bg-card);"><img src=\"'+img+'\" style=\"width:100%;display:block;\" onerror=\"this.src=\\\"https://via.placeholder.com/600x800?text=Error\\\"\"></div>';}
});
}else{
html+='<p style="color:var(--text-secondary);">No pages found</p>';
}
html+='</div>';
html+='<div style="display:flex;justify-content:space-between;align-items:center;margin-top:40px;padding:20px;background:var(--bg-card);border-radius:8px;gap:20px;">';
// Check if this is the last chapter
let isLastChapter=currentChapterIndex>=allChapters.length-1;
// Previous/Home button - always show
html+='<button onclick="previousChapter()" style="background:var(--primary-color);color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-weight:600;font-size:16px;">← Previous Chapter</button>';
// Chapter indicator
html+='<span style="color:var(--text-secondary);">Chapter '+currentChapterNumber+' ('+currentChapterIndex+'/'+(allChapters.length-1)+')</span>';
// Next button - only show if not last chapter
if(!isLastChapter){
html+='<button onclick="nextChapter()" style="background:var(--primary-color);color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-weight:600;font-size:16px;">Next Chapter →</button>';
}else{
html+='<button onclick="backToHome()" style="background:var(--primary-color);color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-weight:600;font-size:16px;">Back Home</button>';
}
html+='</div>';
html+='</div>';
html+='</div>';
mainContent.innerHTML=html;
mainContent.setAttribute('data-original-html',originalHTML);
detailModal.classList.add('hidden');
}

function backToHome(){
let mainContent=document.querySelector('.main-content');
let originalHTML=mainContent.getAttribute('data-original-html');
if(originalHTML){
mainContent.innerHTML=originalHTML;
mainContent.removeAttribute('data-original-html');
}else{
location.reload();
}
}

function closeReader(){
backToHome();
}

function nextChapter(){
if(!currentMangaData||currentChapterIndex<=0)return;
currentChapterIndex--;
if(allChapters[currentChapterIndex]){
currentChapterNumber=allChapters[currentChapterIndex].title||allChapters[currentChapterIndex].name||allChapters[currentChapterIndex].chapter||(currentChapterIndex+1);
}
let nextChapterId=allChapters[currentChapterIndex].id;
loadAndDisplayChapter(nextChapterId);
}

function previousChapter(){
if(!currentMangaData||currentChapterIndex>=allChapters.length-1)return;
currentChapterIndex++;
if(allChapters[currentChapterIndex]){
currentChapterNumber=allChapters[currentChapterIndex].title||allChapters[currentChapterIndex].name||allChapters[currentChapterIndex].chapter||(currentChapterIndex+1);
}
let prevChapterId=allChapters[currentChapterIndex].id;
loadAndDisplayChapter(prevChapterId);
}

async function performHeaderSearch(){
let query=document.getElementById('headerSearch').value.trim();
if(!query)return;
try{
showLoading();
searchResultsContainer.innerHTML='';
let eps=[
{url:API_BASE+'/manga/mangadex/'+encodeURIComponent(query),type:'manga',provider:'mangadex'},
{url:API_BASE+'/manga/mangakakalot/'+encodeURIComponent(query),type:'manga',provider:'mangakakalot'},
{url:API_BASE+'/manga/managreader/'+encodeURIComponent(query),type:'manga',provider:'managreader'},
{url:API_BASE+'/manga/mangapark/'+encodeURIComponent(query),type:'manga',provider:'mangapark'},
{url:API_BASE+'/manga/mangapill/'+encodeURIComponent(query),type:'manga',provider:'mangapill'}
];
let all=[];
for(let e of eps){
try{
let r=await fetch(e.url);
let d=await r.json();
console.log('Search result from '+e.url+':', d);
let res=d.results||d||[];
if(Array.isArray(res)){res.forEach(i=>{i._type=e.type;i._provider=e.provider;});all.push(...res);}
}catch(err){console.error('Error fetching '+e.url+':', err);}
}
if(all.length>0){all.forEach(i=>{searchResultsContainer.appendChild(createMangaCard(i))});}
else{searchResultsContainer.innerHTML='<p>No results found. Try another search.</p>';}
openSearchModal();
}catch(e){console.error('Search error:',e);openSearchModal();}
finally{hideLoading();}
}

function openSearchModal(){
searchModal.classList.remove('hidden');
}
function closeSearchModal(){searchModal.classList.add('hidden');}
function toggleMobileMenu(){document.querySelector('.nav-menu').classList.toggle('active');}

document.getElementById('headerSearch')?.addEventListener('keypress',(e)=>{if(e.key==='Enter')performHeaderSearch();});
searchModal?.addEventListener('click',(e)=>{if(e.target===searchModal)closeSearchModal();});
detailModal?.addEventListener('click',(e)=>{if(e.target===detailModal)closeDetailModal();});
if(readerModal){
  readerModal.addEventListener('click',(e)=>{if(e.target===readerModal)closeReader();});
}
