/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require("fs");

let BASE_PATH =
  "C:\\Users\\...\\rtu_dnp3";

// RTU database list
let DB = [];

//==========================================================
// Log all RTUs of the DB list
//==========================================================
function log_all() {
  console.log(DB);
}

//==========================================================
// Create a RTU
//==========================================================
function create_rtu(id, name, protocol, window, state) {
  DB.push({
    type: "rtu",
    protocol: protocol,
    id: id,
    name: name,
    base_path: BASE_PATH,
    window: window,
    state: state,
    ip: "127.0.0.1",
    port: "20000",
    localAddr: "1",
    remoteAddr: "2",
    master_id: "",
    master_port_id: "",
    simulator: "",
    simulator_log: BASE_PATH + "\\dnp3_out_" + id + ".txt",
    simulator_conf: BASE_PATH + "\\rtu_dnp3_config_" + id + ".txt",
    points: "",
  });
}

//==========================================================
// Set RTU basic configuration
//==========================================================
function set_config_rtu(id, ip, port, localAddr, remoteAddr) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    result.ip = ip;
    result.port = port;
    result.localAddr = localAddr;
    result.remoteAddr = remoteAddr;
  }
}

//==========================================================
// Delete a RTU by ID
//==========================================================
function del_rtu(id) {
  for (var i = 0; i < DB.length; i++) {
    if (DB[i].id === id) {
      DB.splice(i, 1);
      break;
    }
  }
}

//==========================================================
// Delete all RTUs and simulators
//==========================================================
function del_all_rtu() {
  for (var i = DB.length - 1; i >= 0; i--) {
    if (fs.existsSync(DB[i].simulator_conf))
      fs.unlinkSync(DB[i].simulator_conf);
    if (fs.existsSync(DB[i].simulator_log)) fs.unlinkSync(DB[i].simulator_log);
    if (Object.keys(DB[i].simulator).length !== 0) DB[i].simulator.kill();
    DB.splice(i, 1);
  }
}

//==========================================================
// Set a RTU state
//==========================================================
function set_state_rtu(id, state) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    result.state = state;
  }
}

//==========================================================
// Set a new simulator object
//==========================================================
function set_simulator_rtu(id, simulator) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    result.simulator = simulator;
  }
}

//==========================================================
// Set a new RTU windows object
//==========================================================
function set_window_rtu(id, window) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    result.window = window;
  }
}

//==========================================================
// Set a new Master ID
//==========================================================
function set_master_id(id, master_id, master_port_id) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    result.master_id = master_id;
    result.master_port_id = master_port_id;
  }
}

//==========================================================
// Set a list of points
//==========================================================
function set_points_rtu(id, points) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    result.points = points;
  }
}

//==========================================================
// Get a RTU by ID
//==========================================================
function get_rtu(id) {
  return DB.filter(function (o) {
    return o.id == id;
  })[0];
}

//==========================================================
// Get a RTU by window
//==========================================================
function get_rtu_by_window(window) {
  return DB.filter(function (o) {
    return o.window == window;
  })[0];
}

//==========================================================
// Get the RTU state by ID
//==========================================================
function get_state_rtu(id) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    return result.state;
  }
}

//==========================================================
// Get the complete list of RTUs
//==========================================================
function get_rtu_all() {
  return DB;
}

exports.log_all = log_all;
exports.create_rtu = create_rtu;
exports.set_config_rtu = set_config_rtu;
exports.set_state_rtu = set_state_rtu;
exports.set_simulator_rtu = set_simulator_rtu;
exports.set_window_rtu = set_window_rtu;
exports.set_master_id = set_master_id;
exports.get_rtu = get_rtu;
exports.get_state_rtu = get_state_rtu;
exports.del_rtu = del_rtu;
exports.get_rtu_by_window = get_rtu_by_window;
exports.get_rtu_all = get_rtu_all;
exports.set_points_rtu = set_points_rtu;
exports.del_all_rtu = del_all_rtu;
