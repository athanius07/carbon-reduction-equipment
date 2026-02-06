
const FILTER_BTNS=document.querySelectorAll(".toggles button");
let DATA=[];
async function loadData(){
  const res=await fetch("seed.json"); DATA=await res.json(); render("All");
}
function tag(power){
  if(/battery/i.test(power)) return "tag battery";
  if(/hydrogen/i.test(power)) return "tag hydrogen";
  if(/methanol|e[- ]?fuel/i.test(power)) return "tag efuels";
  if(/hybrid/i.test(power)) return "tag hybrid";
  return "tag";
}
function render(type){
  const tb=document.querySelector("#equip tbody"); tb.innerHTML="";
  DATA.filter(r=>type==="All"||r.MachineType===type).forEach(r=>{
    tb.insertAdjacentHTML("beforeend", `
    <tr>
      <td><span class="${tag(r.PowerUse)}">${r.PowerUse||""}</span></td>
      <td>${r.OEM||""}</td>
      <td>${r.Country||""}</td>
      <td>${r.ClassTonnage||""}</td>
      <td>${r.EngineMotorPower||""}</td>
      <td>${r.BladeSize||""}</td>
      <td>${r.BucketSize||""}</td>
      <td>${r.MachineType||""}</td>
      <td>${r.YearRelease||""}</td>
      <td>${r.DevStatus||""}</td>
      <td>${r.SourceUrl?`<a href="${r.SourceUrl}" target="_blank">link</a>${r.SourceDate?` (${r.SourceDate})`:""}`:""}</td>
    </tr>`);
  });
}
FILTER_BTNS.forEach(b=>b.addEventListener("click",e=>{
  FILTER_BTNS.forEach(x=>x.classList.remove("active"));
  e.target.classList.add("active"); render(e.target.dataset.type);
}));
loadData();
