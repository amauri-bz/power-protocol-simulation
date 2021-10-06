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
  "C:\\Users\\...\\master_dnp3";

// RTU database list
let DB = [];

//==========================================================
// Log all Master of the DB list
//==========================================================
function log_all() {
  console.log(DB);
}

//==========================================================
// Create a Master
//==========================================================
function create_master(id, name, window) {
  DB.push({
    type: "master",
    id: id,
    window: window,
    name: name,
    base_path: BASE_PATH,
    port1: "",
    port2: "",
    port3: "",
  });
}

//==========================================================
// Create a Master
//==========================================================
function create_port(id, port_id, protocol, state) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    let port = {
      protocol: protocol,
      port_id: port_id,
      state: state,
      gi: "60",
      class1: "10",
      class2: "15",
      class3: "20",
      rtu_id: "",
      simulator: "",
      simulator_log: result.base_path + "\\dnp3_out_" + id + port_id + ".txt",
      simulator_conf: result.base_path + "\\master_dnp3_config_" + id + port_id + ".txt",
      simulator_points: result.base_path + "\\dnp3_points_" + id + port_id + ".txt",
      simulator_db: result.base_path + "\\dnp3_db_" + id + port_id + ".txt",
    };

    result[port_id] = port;
  }
}

//==========================================================
// Delete a Master by ID
//==========================================================
function del_master(id) {
  for (var i = 0; i < DB.length; i++) {
    if (DB[i].id === id) {
      for (var j = 1; j <= 3; j++) {
        let port_id = "port"+j;

        if (fs.existsSync(DB[i][port_id].simulator_conf)) fs.unlinkSync(DB[i][port_id].simulator_conf);
        if (fs.existsSync(DB[i][port_id].simulator_log)) fs.unlinkSync(DB[i][port_id].simulator_log);
        if (fs.existsSync(DB[i][port_id].simulator_points)) fs.unlinkSync(DB[i][port_id].simulator_points);
        if (fs.existsSync(DB[i][port_id].simulator_db)) fs.unlinkSync(DB[i][port_id].simulator_db);
        if (DB[i][port_id].simulator) DB[i][port_id].simulator.kill();
      }
      DB.splice(i, 1);
      break;
    }
  }
}

//==========================================================
// Set Master basic configuration
//==========================================================
function set_config_master(id, port_id, gi, class1, class2, class3) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    if(gi) result[port_id].gi = gi;
    if(class1) result[port_id].class1 = class1;
    if(class2) result[port_id].class2 = class2;
    if(class3) result[port_id].class3 = class3;
  }
}

//==========================================================
// Delete all Master and simulators
//==========================================================
function del_all_master() {
  for (var i = DB.length - 1; i >= 0; i--) {
    for (var id = 1; id <= 3; id++) {
      let port_id = "port"+id;

      if (fs.existsSync(DB[i][port_id].simulator_conf)) fs.unlinkSync(DB[i][port_id].simulator_conf);
      if (fs.existsSync(DB[i][port_id].simulator_log)) fs.unlinkSync(DB[i][port_id].simulator_log);
      if (fs.existsSync(DB[i][port_id].simulator_points)) fs.unlinkSync(DB[i][port_id].simulator_points);
      if (fs.existsSync(DB[i][port_id].simulator_db)) fs.unlinkSync(DB[i][port_id].simulator_db);
      if (DB[i][port_id].simulator) DB[i][port_id].simulator.kill();
    }
    DB.splice(i, 1);
  }
}

//==========================================================
// Set a Master state
//==========================================================
function set_state_master(id, port_id, state) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    result[port_id].state = state;
  }
}

//==========================================================
// Set a RTU ID
//==========================================================
function set_rtu_id(id, port_id, rtu_id) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    result[port_id].rtu_id = rtu_id;
  }
}

//==========================================================
// Set a new simulator object
//==========================================================
function set_simulator_master(id, port_id, simulator) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    result[port_id].simulator = simulator;
  }
}

//==========================================================
// Set a new Master windows object
//==========================================================
function set_window_master(id, window) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    result.window = window;
  }
}

//==========================================================
// Get a Master by ID
//==========================================================
function get_master(id) {
  return DB.filter(function (o) {
    return o.id == id;
  })[0];
}

//==========================================================
// Get a Master by window
//==========================================================
function get_master_by_window(window) {
  return DB.filter(function (o) {
    return o.window == window;
  })[0];
}

//==========================================================
// Get the Master state by ID
//==========================================================
function get_state_master(id, port_id) {
  var result = DB.filter(function (o) {
    return o.id == id;
  })[0];
  if (result != null) {
    return result[port_id].state;
  }
}

//==========================================================
// Get the complete list of Master
//==========================================================
function get_master_all() {
  return DB;
}

exports.log_all = log_all;
exports.create_master = create_master;
exports.create_port = create_port;
exports.set_state_master = set_state_master;
exports.set_simulator_master = set_simulator_master;
exports.set_window_master = set_window_master;
exports.set_config_master = set_config_master;
exports.set_rtu_id = set_rtu_id;
exports.get_master = get_master;
exports.get_state_master = get_state_master;
exports.del_master = del_master;
exports.get_master_by_window = get_master_by_window;
exports.get_master_all = get_master_all;
exports.del_all_master = del_all_master;
