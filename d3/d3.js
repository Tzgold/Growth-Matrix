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
loadData();