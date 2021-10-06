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
  selectList: any;
}

interface ServerState {
  optionsPoints: any;
  Point1: string;
  Point2: string;
  Point3: string;
  Point4: string;
  Point5: string;

  optionsTid: any;
  Tid1: string;
  Tid2: string;
  Tid3: string;
  Tid4: string;
  Tid5: string;

  Auto1: boolean;
  Auto2: boolean;
  Auto3: boolean;
  Auto4: boolean;
  Auto5: boolean;
}

export class SelectBox extends React.Component<ServertProps, ServerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      optionsPoints: this.props.selectList.optionsPoints,
      Point1: "1",
      Point2: "2",
      Point3: "3",
      Point4: "4",
      Point5: "5",

      optionsTid: this.props.selectList.optionsTid,
      Tid1: "Digital",
      Tid2: "Digital",
      Tid3: "Digital",
      Tid4: "Digital",
      Tid5: "Digital",

      Auto1: false,
      Auto2: false,
      Auto3: false,
      Auto4: false,
      Auto5: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRenderer = this.handleRenderer.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("rtu-message", this.handleRenderer);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("rtu-message", this.handleRenderer);
  }

  handleRenderer(event: any, msg: any) {
    if (msg.msg === "data_reply" && msg.data) {
      console.log(msg);
      this.setState({ Point1: msg.data.Point1 });
      this.setState({ Tid1: msg.data.Tid1 });
      this.setState({ Auto1: msg.data.Auto1 });
      this.setState({ Point2: msg.data.Point2 });
      this.setState({ Tid2: msg.data.Tid2 });
      this.setState({ Auto2: msg.data.Auto2 });
      this.setState({ Point3: msg.data.Point3 });
      this.setState({ Tid3: msg.data.Tid3 });
      this.setState({ Auto3: msg.data.Auto3 });
      this.setState({ Point4: msg.data.Point4 });
      this.setState({ Tid4: msg.data.Tid4 });
      this.setState({ Auto4: msg.data.Auto4 });
      this.setState({ Point5: msg.data.Point5 });
      this.setState({ Tid5: msg.data.Tid5 });
      this.setState({ Auto5: msg.data.Auto5 });
    }
  }

  handleChange = (event: any) => {
    let nam = event.target.name;
    if (nam.search("point") >= 0) {
      let name: string = "Point" + nam.split("-")[1];
      if (name === "Point1") this.setState({ Point1: event.target.value });
      if (name === "Point2") this.setState({ Point2: event.target.value });
      if (name === "Point3") this.setState({ Point3: event.target.value });
      if (name === "Point4") this.setState({ Point4: event.target.value });
      if (name === "Point5") this.setState({ Point5: event.target.value });
    } else if (nam.search("tid") >= 0) {
      let name: string = "Tid" + nam.split("-")[1];
      if (name === "Tid1") this.setState({ Tid1: event.target.value });
      if (name === "Tid2") this.setState({ Tid2: event.target.value });
      if (name === "Tid3") this.setState({ Tid3: event.target.value });
      if (name === "Tid4") this.setState({ Tid4: event.target.value });
      if (name === "Tid5") this.setState({ Tid5: event.target.value });
    } else if (nam.search("auto") >= 0) {
      let name: string = "Auto" + nam.split("-")[1];
      if (name === "Auto1") this.setState({ Auto1: event.target.checked });
      if (name === "Auto2") this.setState({ Auto2: event.target.checked });
      if (name === "Auto3") this.setState({ Auto3: event.target.checked });
      if (name === "Auto4") this.setState({ Auto4: event.target.checked });
      if (name === "Auto5") this.setState({ Auto5: event.target.checked });
    } else {
      console.log("ERROR:" + nam);
    }
  };

  handleSubmit(event: any) {
    ipcRenderer.send("rtu-message", {
      msg: "data",
      id: this.props.id,
      data: {
        Point1: this.state.Point1,
        Tid1: this.state.Tid1,
        Auto1: this.state.Auto1,
        Point2: this.state.Point2,
        Tid2: this.state.Tid2,
        Auto2: this.state.Auto2,
        Point3: this.state.Point3,
        Tid3: this.state.Tid3,
        Auto3: this.state.Auto3,
        Point4: this.state.Point4,
        Tid4: this.state.Tid4,
        Auto4: this.state.Auto4,
        Point5: this.state.Point5,
        Tid5: this.state.Tid5,
        Auto5: this.state.Auto5,
      },
    });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <table className="w3-table-all w3-hoverable">
            <thead>
              <tr>
                <th>Point</th>
                <th>Type ID</th>
                <th>Simulate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select
                    className="form-control"
                    id="point"
                    name="point-1"
                    value={this.state.Point1}
                    onChange={this.handleChange}
                  >
                    {this.state.optionsPoints.map((option: any) => (
                      <option>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="form-control"
                    id="tid"
                    name="tid-1"
                    value={this.state.Tid1}
                    onChange={this.handleChange}
                  >
                    {this.state.optionsTid.map((option: any) => (
                      <option>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="auto-1"
                    checked={this.state.Auto1}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <select
                    className="form-control"
                    id="point"
                    name="point-2"
                    value={this.state.Point2}
                    onChange={this.handleChange}
                  >
                    {this.state.optionsPoints.map((option: any) => (
                      <option>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="form-control"
                    id="tid"
                    name="tid-2"
                    value={this.state.Tid2}
                    onChange={this.handleChange}
                  >
                    {this.state.optionsTid.map((option: any) => (
                      <option>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="auto-2"
                    checked={this.state.Auto2}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <select
                    className="form-control"
                    id="point"
                    name="point-3"
                    value={this.state.Point3}
                    onChange={this.handleChange}
                  >
                    {this.state.optionsPoints.map((option: any) => (
                      <option>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="form-control"
                    id="tid"
                    name="tid-3"
                    value={this.state.Tid3}
                    onChange={this.handleChange}
                  >
                    {this.state.optionsTid.map((option: any) => (
                      <option>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="auto-3"
                    checked={this.state.Auto3}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <select
                    className="form-control"
                    id="point"
                    name="point-4"
                    value={this.state.Point4}
                    onChange={this.handleChange}
                  >
                    {this.state.optionsPoints.map((option: any) => (
                      <option>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="form-control"
                    id="tid"
                    name="tid-4"
                    value={this.state.Tid4}
                    onChange={this.handleChange}
                  >
                    {this.state.optionsTid.map((option: any) => (
                      <option>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="auto-4"
                    checked={this.state.Auto4}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <select
                    className="form-control"
                    id="point"
                    name="point-5"
                    value={this.state.Point5}
                    onChange={this.handleChange}
                  >
                    {this.state.optionsPoints.map((option: any) => (
                      <option>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="form-control"
                    id="tid"
                    name="tid-5"
                    value={this.state.Tid5}
                    onChange={this.handleChange}
                  >
                    {this.state.optionsTid.map((option: any) => (
                      <option>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="auto-5"
                    checked={this.state.Auto5}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    );
  }
}
