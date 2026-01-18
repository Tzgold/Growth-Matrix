// ...existing code...
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7?module";

async function loadData() {
  const data = await d3.csv("amounts.csv");

  data.forEach(d => {
    d.amounts = +d.amounts;
  });

  console.log(data);
}
//am balli 0n you whatch out wh=atch
// for some reason
//mey be in another life i will may be not watch this type of fucking stuff like to make my life better yk sometimes its out of my controll and the same as the rest yk
//God like i feel like am tired of this thing like back to this life yk thise week is the best week of my 2018 like i have never happy and satisfied like with my life in this week and yk i kinda ruined it today and help me good don't let me sink to that life again please have mercy on me
loadData();