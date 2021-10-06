/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import * as select_box from "./SelectBox";
const electron = window.require("electron");
const { ipcRenderer } = electron;

export interface ServertProps {
  id: string;
  name: string;
  ip: string;
  port: string;
  localAddr: string;
  remoteAddr: string;
}

interface ServerState {
  ip: string;
  port: string;
  localAddr: string;
  remoteAddr: string;
  log: string;
}

export class Server extends React.Component<ServertProps, ServerState> {
  points = {
    optionsPoints: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    optionsTid: ["Analog", "Digital"],
  };

  constructor(props: any) {
    super(props);
    this.state = {
      ip: this.props.ip,
      port: this.props.port,
      localAddr: this.props.localAddr,
      remoteAddr: this.props.remoteAddr,
      log: "",
    };
    this.handleRenderer = this.handleRenderer.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("rtu-message", this.handleRenderer);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("rtu-message", this.handleRenderer);
  }

  handleRenderer(event: any, data: any) {
    this.setState({ log: data.log });
  }

  tabCtrl(tabname: any) {
    var i;
    var x: any = document.getElementsByClassName("conf");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    var y: any = document.getElementById(tabname);
    y.style.display = "block";
  }

  sendMsg(msg: string, data: any = {}) {
    ipcRenderer.send("rtu-message", { msg: msg, id: this.props.id, ...data });
  }

  clearLog() {
    this.setState({ log: "" });
  }

  submitHandler = (event: any) => {
    event.preventDefault();
    this.sendMsg("config", {
      ip: this.state.ip,
      port: this.state.port,
      localAddr: this.state.localAddr,
      remoteAddr: this.state.remoteAddr,
    });
  };

  changeHandler = (event: any) => {
    let nam: string = event.target.name;
    if (nam === "ip") {
      this.setState({ ip: event.target.value });
    } else if (nam === "log") {
      this.setState({ log: event.target.value });
    } else if (nam === "remoteAddr") {
      this.setState({ remoteAddr: event.target.value });
    } else if (nam === "localAddr") {
      this.setState({ localAddr: event.target.value });
    } else {
      this.setState({ port: event.target.value });
    }
  };

  render() {
    return (
      <div className="w3-panel w3-dark-grey inv">
        <div className="w3-panel w3-gray">
          <h4>{"RTU: " + this.props.name}</h4>
          <div className="w3-bar w3-dark-grey w3-margin-bottom w3-margin-top">
            <button
              className="w3-bar-item w3-button w3-large"
              onClick={() => this.tabCtrl("configs")}
            >
              Configs
            </button>
            <button
              className="w3-bar-item w3-button w3-large"
              onClick={() => this.tabCtrl("points")}
            >
              Points
            </button>
          </div>
          <div id="configs" className="conf">
            <form onSubmit={this.submitHandler}>
              <h4>RTU Configuration:</h4>
              <table className="w3-table-all w3-hoverable">
                <thead>
                  <tr>
                    <th>Config</th>
                    <th>Value:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>IP</td>
                    <td>
                      <input
                        type="text"
                        name="ip"
                        onChange={this.changeHandler}
                        value={this.state.ip}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Port</td>
                    <td>
                      <input
                        type="text"
                        name="port"
                        onChange={this.changeHandler}
                        value={this.state.port}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Local-Addr</td>
                    <td>
                      <input
                        type="text"
                        name="localAddr"
                        onChange={this.changeHandler}
                        value={this.state.localAddr}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Remote-Addr</td>
                    <td>
                      <input
                        type="text"
                        name="remoteAddr"
                        onChange={this.changeHandler}
                        value={this.state.remoteAddr}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <input type="submit" value="Save" />
            </form>
          </div>

          <div id="points" className="conf" style={{ display: "none" }}>
            <h4>Points:</h4>
            <select_box.SelectBox selectList={this.points} id={this.props.id} />
          </div>
        </div>
        <h3 id="import_show" className="w3-margin">
          Trace:
        </h3>
        <div className="w3-panel w3-light-gray">
          <button
            id="start"
            className="w3-button w3-dark-grey w3-margin"
            onClick={() => this.sendMsg("start")}
          >
            Start
          </button>
          <button
            id="stop"
            className="w3-button w3-dark-grey w3-margin"
            onClick={() => this.sendMsg("stop")}
          >
            Stop
          </button>
          <button
            id="clear"
            className="w3-button w3-dark-grey w3-margin"
            onClick={() => this.clearLog()}
          >
            Clear
          </button>
          <textarea
            id="log"
            name="log"
            rows={20}
            style={{ resize: "none", width: "100%" }}
            value={this.state.log}
            onChange={this.changeHandler}
          ></textarea>
        </div>
      </div>
    );
  }
}
