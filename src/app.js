import * as d3_base from "d3";
import * as d3_dag from "d3-dag";

import arquint from "./arquint";
import sugiyama from "./sugiyama";

const d3 = Object.assign({}, d3_base, d3_dag);

const useArquint = true
const source = "Grafo";
const sources = {
  "Grafo": ["grafo", d3_dag.dagStratify()],
  "X-Shape": ["ex", d3_dag.dagStratify()],
  "Zherebko": ["zherebko", d3_dag.dagConnect().linkData(() => ({}))]
};

loadDag(source)
  .then(useArquint ? arquint() : sugiyama())
  .catch(console.error.bind(console));

async function loadDag(source) {
  const [key, reader] = sources[source];
  const dag_data = await d3.json(`https://raw.githubusercontent.com/erikbrinkman/d3-dag/master/examples/${key}.json`);
  return reader(dag_data);
}
