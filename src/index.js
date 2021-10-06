/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Server } from "./components/Server";
import { Master } from "./components/Master";

import { HashRouter, Route, useParams } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <div>
        <Route exact path="/">
          <App />
        </Route>

        <Route
          exact
          sensitive
          path="/rtu/:id/:name/:ip/:port/:localAddr/:remoteAddr"
          children={<RTU />}
        />
        <Route exact sensitive path="/master/:id/:name" children={<Center />} />
      </div>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

function RTU() {
  let { id, name, ip, port, localAddr, remoteAddr } = useParams();

  return (
    <Server
      id={id}
      name={name}
      ip={ip}
      port={port}
      localAddr={localAddr}
      remoteAddr={remoteAddr}
    />
  );
}

function tabCtrl(tabname) {
  var i;
  var x = document.getElementsByClassName("port");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  var y = document.getElementById(tabname);
  y.style.display = "block";
}

function Center() {
  let { id, name } = useParams();

  return (
    <div className="w3-panel w3-black inv">
      <button
        className="w3-bar-item w3-button w3-large"
        onClick={() => tabCtrl("port1")}
      >
        Port 1
      </button>
      <button
        className="w3-bar-item w3-button w3-large"
        onClick={() => tabCtrl("port2")}
      >
        Port 2
      </button>
      <button
        className="w3-bar-item w3-button w3-large"
        onClick={() => tabCtrl("port3")}
      >
        Port 3
      </button>
      <div id={"port1"} className={"port"}>
        <Master id={id} port_id={"port1"} name={name} />
      </div>
      <div id={"port2"} className={"port"} style={{ display: "none" }}>
        <Master id={id} port_id={"port2"} name={name} />
      </div>
      <div id={"port3"} className={"port"} style={{ display: "none" }}>
        <Master id={id} port_id={"port3"} name={name} />
      </div>
    </div>
  );
}
