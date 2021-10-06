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
const electron = window.require("electron");
const { ipcRenderer } = electron;

export interface ServertProps {
  id: string;
  port_id: string;
  name: string;
}

interface ServerState {
  log: string;
  hist: string;
  gi: string;
  class1: string;
  class2: string;
  class3: string;
  p1: any;
  p2: any;
  p3: any;
  p4: any;
  p5: any;
}

export class Master extends React.Component<ServertProps, ServerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      log: "",
      hist: "",
      gi: "60",
      class1: "10",
      class2: "10",
      class3: "10",
      p1: { point: "1", value: "0", quality: "Offline" },
      p2: { point: "2", value: "0", quality: "Offline" },
      p3: { point: "3", value: "0", quality: "Offline" },
      p4: { point: "4", value: "0", quality: "Offline" },
      p5: { point: "5", value: "0", quality: "Offline" },
    };
    this.handleRenderer = this.handleRenderer.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("master-message", this.handleRenderer);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("master-message", this.handleRenderer);
  }

  handleRenderer(event: any, data: any) {
    console.log(this.props.port_id, data);
    if (data.port_id !== this.props.port_id) return;

    if (data.msg === "config") {
      this.setState({ gi: data.gi });
      this.setState({ class1: data.class1 });
      this.setState({ class2: data.class2 });
      this.setState({ class3: data.class3 });
    } else if (data.msg === "data") {
      this.setState({ log: data.log });
    } else if (data.msg === "points") {
      this.setState({ hist: data.log });
    } else if (data.msg === "db") {
      if (data.db.p1) this.setState({ p1: data.db.p1 });
      if (data.db.p2) this.setState({ p2: data.db.p2 });
      if (data.db.p3) this.setState({ p3: data.db.p3 });
      if (data.db.p4) this.setState({ p4: data.db.p4 });
      if (data.db.p5) this.setState({ p5: data.db.p5 });
    }
  }

  tabCtrl(tabname: any) {
    var i;
    var x: any = document.getElementsByClassName("conf" + this.props.port_id);
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    var y: any = document.getElementById(tabname);
    y.style.display = "block";
  }

  tabCtrl2(tabname: any) {
    var i;
    var x: any = document.getElementsByClassName("conf2" + this.props.port_id);
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    var y: any = document.getElementById(tabname);
    y.style.display = "block";
  }

  sendMsg(msg: string, data: any = {}) {
    ipcRenderer.send("master-message", {
      msg: msg,
      id: this.props.id,
      port_id: this.props.port_id,
      ...data,
    });
  }

  clearLog() {
    this.setState({ log: "" });
  }

  submitHandler = (event: any) => {
    event.preventDefault();
    this.sendMsg("config", {
      gi: this.state.gi,
      class1: this.state.class1,
      class2: this.state.class2,
      class3: this.state.class3,
    });
  };

  changeHandler = (event: any) => {
    let nam: string = event.target.name;
    if (nam === "log") {
      this.setState({ log: event.target.value });
    } else if (nam === "hist") {
      this.setState({ hist: event.target.value });
    } else if (nam === "gi") {
      this.setState({ gi: event.target.value });
    } else if (nam === "class1") {
      this.setState({ class1: event.target.value });
    } else if (nam === "class2") {
      this.setState({ class2: event.target.value });
    } else if (nam === "class3") {
      this.setState({ class3: event.target.value });
    }
  };

  renderTableData() {
    return (
      <tbody>
        <tr key={this.state.p1.point}>
          <td>{this.state.p1.point}</td> <td>{this.state.p1.value}</td>
          <td>{this.state.p1.quality}</td>
          <td>
            <button
              id="command"
              className="w3-button w3-dark-grey w3-margin"
              onClick={() => this.sendMsg("cmd", { cmd: this.state.p1.point })}
            >
              {" "}
              Command{" "}
            </button>
          </td>
        </tr>
        <tr key={this.state.p2.point}>
          <td>{this.state.p2.point}</td> <td>{this.state.p2.value}</td>
          <td>{this.state.p2.quality}</td>
          <td>
            <button
              id="command"
              className="w3-button w3-dark-grey w3-margin"
              onClick={() => this.sendMsg("cmd", { cmd: this.state.p2.point })}
            >
              {" "}
              Command{" "}
            </button>
          </td>
        </tr>
        <tr key={this.state.p3.point}>
          <td>{this.state.p3.point}</td> <td>{this.state.p3.value}</td>
          <td>{this.state.p3.quality}</td>
          <td>
            <button
              id="command"
              className="w3-button w3-dark-grey w3-margin"
              onClick={() => this.sendMsg("cmd", { cmd: this.state.p3.point })}
            >
              {" "}
              Command{" "}
            </button>
          </td>
        </tr>
        <tr key={this.state.p4.point}>
          <td>{this.state.p4.point}</td> <td>{this.state.p4.value}</td>
          <td>{this.state.p4.quality}</td>
          <td>
            <button
              id="command"
              className="w3-button w3-dark-grey w3-margin"
              onClick={() => this.sendMsg("cmd", { cmd: this.state.p4.point })}
            >
              {" "}
              Command{" "}
            </button>
          </td>
        </tr>
        <tr key={this.state.p5.point}>
          <td>{this.state.p5.point}</td> <td>{this.state.p5.value}</td>
          <td>{this.state.p5.quality}</td>
          <td>
            <button
              id="command"
              className="w3-button w3-dark-grey w3-margin"
              onClick={() => this.sendMsg("cmd", { cmd: this.state.p5.point })}
            >
              {" "}
              Command{" "}
            </button>
          </td>
        </tr>
      </tbody>
    );
  }

  render() {
    return (
      <div className="w3-panel w3-dark-grey inv">
        <div className="w3-panel w3-gray">
          <h4>
            {"Master: " +
              this.props.name +
              " " +
              this.props.port_id.charAt(0).toUpperCase() +
              this.props.port_id.slice(1).toLowerCase()}
          </h4>
          <div className="w3-bar w3-dark-grey w3-margin-bottom w3-margin-top">
            <button
              className="w3-bar-item w3-button w3-large"
              onClick={() => this.tabCtrl("communication" + this.props.port_id)}
            >
              Comunication
            </button>
            <button
              className="w3-bar-item w3-button w3-large"
              onClick={() => this.tabCtrl("history" + this.props.port_id)}
            >
              History
            </button>
          </div>
          <div
            id={"communication" + this.props.port_id}
            className={"conf" + this.props.port_id}
          >
            <h4>Comunication:</h4>

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

            <div className="w3-panel w3-dark-grey inv">
              <div className="w3-panel w3-light-gray">
                <div className="w3-bar w3-dark-grey w3-margin-bottom w3-margin-top">
                  <button
                    className="w3-bar-item w3-button w3-large"
                    onClick={() => this.tabCtrl2("data" + this.props.port_id)}
                  >
                    Data
                  </button>
                  <button
                    className="w3-bar-item w3-button w3-large"
                    onClick={() => this.tabCtrl2("trace" + this.props.port_id)}
                  >
                    Trace
                  </button>
                  <button
                    className="w3-bar-item w3-button w3-large"
                    onClick={() => this.tabCtrl2("config" + this.props.port_id)}
                  >
                    Config
                  </button>
                </div>

                <div
                  id={"data" + this.props.port_id}
                  className={"conf2" + this.props.port_id}
                >
                  <h4>Data:</h4>
                  <button
                    id="command"
                    className="w3-button w3-dark-grey w3-margin"
                    onClick={() => this.sendMsg("cmd", { cmd: "i" })}
                  >
                    Iterrogation
                  </button>
                  <button
                    id="command"
                    className="w3-button w3-dark-grey w3-margin"
                    onClick={() => this.sendMsg("cmd", { cmd: "e" })}
                  >
                    Exception
                  </button>
                  <button
                    id="command"
                    className="w3-button w3-dark-grey w3-margin"
                    onClick={() => this.sendMsg("cmd", { cmd: "d" })}
                  >
                    Unsoliceted
                  </button>

                  <table className="w3-table-all w3-hoverable">
                    <thead>
                      <tr>
                        <th>Index:</th>
                        <th>Value:</th>
                        <th>Quality:</th>
                        <th>Command:</th>
                      </tr>
                    </thead>
                    {this.renderTableData()}
                  </table>
                </div>

                <div
                  id={"trace" + this.props.port_id}
                  className={"conf2" + this.props.port_id}
                  style={{ display: "none" }}
                >
                  <h4>Trace:</h4>
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
                <div
                  id={"config" + this.props.port_id}
                  className={"conf2" + this.props.port_id}
                  style={{ display: "none" }}
                >
                  <form onSubmit={this.submitHandler}>
                    <h4>Configuration:</h4>
                    <table className="w3-table-all w3-hoverable">
                      <thead>
                        <tr>
                          <th>Config</th>
                          <th>Value:</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>GI</td>
                          <td>
                            <input
                              type="text"
                              name="gi"
                              onChange={this.changeHandler}
                              value={this.state.gi}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Class1</td>
                          <td>
                            <input
                              type="text"
                              name="class1"
                              onChange={this.changeHandler}
                              value={this.state.class1}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Class2</td>
                          <td>
                            <input
                              type="text"
                              name="class2"
                              onChange={this.changeHandler}
                              value={this.state.class2}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Class3</td>
                          <td>
                            <input
                              type="text"
                              name="class3"
                              onChange={this.changeHandler}
                              value={this.state.class3}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <input type="submit" value="Save" />
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div
            id={"history" + this.props.port_id}
            className={"conf" + this.props.port_id}
            style={{ display: "none" }}
          >
            <h4>History:</h4>
            <textarea
              id="hist"
              name="hist"
              rows={20}
              style={{ resize: "none", width: "100%" }}
              value={this.state.hist}
              onChange={this.changeHandler}
            ></textarea>
          </div>
        </div>
      </div>
    );
  }
}
