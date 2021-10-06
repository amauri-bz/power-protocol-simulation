/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const electron = require("electron");
const { app } = electron;
const { BrowserWindow } = electron;
const path = require("path");
const isDev = require("electron-is-dev");
var child = require("child_process").execFile;
const { ipcMain } = require("electron");

const db_rtu = require("./rtu/DbRtu");
const scheduler_rtu = require("./rtu/SchedulerRtu");
const config_rtu = require("./rtu/ConfigFileRtu");

const db_master = require("./master/DbMaster");
const scheduler_master = require("./master/SchedulerMaster");
const config_master = require("./master/ConfigFileMaster");
const { debug } = require("console");

// Create diagram window
let mainWindow;

// Auxiliar window object
var window;

//================================================================
// Create windows
//================================================================
function createWindow(window, width = 800, height = 600, url = "") {
  window = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  window.loadURL(
    isDev
      ? "http://localhost:3000" + url
      : `file://${path.resolve(__dirname, "..", "build", "index.html" + url)}`
  );

  //if (isDev)
  //  window.webContents.openDevTools();

  window.on("closed", (e) => {
    let rtu = db_rtu.get_rtu_by_window(window);
    if (rtu) db_rtu.set_window_rtu(rtu.id, null);

    let master = db_master.get_master_by_window(window);
    if (master) {
      db_master.set_window_master(master.id, null);
    }
    window = null;
  });
  return window;
}

//================================================================
// Diagram window ready
//================================================================
app.on("ready", () => {
  mainWindow = createWindow(mainWindow);
  scheduler_rtu.dataProviderRtu();
  scheduler_master.dataProviderMaster();
  scheduler_master.pointsProviderMaster();
  scheduler_master.dbProviderMaster();
});

//================================================================
// Diagram window finish
//================================================================
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    db_rtu.del_all_rtu();
    db_master.del_all_master();
    app.quit();
  }
});

//================================================================
// Diagram window activation
//================================================================
app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createWindow(mainWindow);
  }
});

//================================================================
// Message processor from Diagram
//================================================================
ipcMain.on("diagram-message", (event, arg) => {
  console.log("Server-Diagram:", arg);

  //-------------------------------------------------
  //Initialization message from diagram window
  //-------------------------------------------------
  if (arg.msg === "init") {
    if (arg.type.search("RTU") >= 0) {
      let rtu = db_rtu.get_rtu(arg.id);
      if (rtu && rtu.window) return;

      if (rtu) {
        window = createWindow(
          window,
          700,
          900,
          "#/rtu/" +
            arg.id +
            "/" +
            rtu.name +
            "/" +
            rtu.ip +
            "/" +
            rtu.port +
            "/" +
            rtu.localAddr +
            "/" +
            rtu.remoteAddr
        );
        db_rtu.set_window_rtu(arg.id, window);
      } else {
        // RTU not present on DB. Create a default DNP3 RTU
        db_rtu.create_rtu(arg.id, arg.type, "dnp3", null, "created");

        rtu = db_rtu.get_rtu(arg.id);
        window = createWindow(
          window,
          700,
          900,
          "#/rtu/" +
            arg.id +
            "/" +
            rtu.name +
            "/" +
            rtu.ip +
            "/" +
            rtu.port +
            "/" +
            rtu.localAddr +
            "/" +
            rtu.remoteAddr
        );
        if (window) db_rtu.set_window_rtu(arg.id, window);
        rtu = db_rtu.get_rtu(arg.id);
      }

      // Assync replay with points information
      setTimeout(function () {
        if (window && rtu && rtu.points)
          window.webContents.send("rtu-message", {
            msg: "data_reply",
            data: rtu.points,
          });
      }, 2000);
    } else if (arg.type.search("Master") >= 0) {
      let master = db_master.get_master(arg.id);
      if (master && master.window) return;

      if (master) {
        window = createWindow(
          window,
          900,
          900,
          "#/master/" + arg.id + "/" + master.name
        );
        db_master.set_window_master(arg.id, window);
      } else {
        // RTU not present on DB. Create a default DNP3 RTU
        db_master.create_master(arg.id, arg.type, null);

        master = db_master.get_master(arg.id);
        window = createWindow(
          window,
          900,
          900,
          "#/master/" + arg.id + "/" + master.name
        );
        db_master.set_window_master(arg.id, window);

        for (var id = 1; id <= 3; id++) {
          let port_id = "port" + id;
          db_master.create_port(arg.id, port_id, "dnp3", "created");
        }
        master = db_master.get_master(arg.id);
      }
      //Assync replay with configuration
      setTimeout(function () {
        for (var id = 1; id <= 3; id++) {
          let port_id = "port" + id;
          if (window && master) {
            window.webContents.send("master-message", {
              msg: "config",
              port_id: port_id,
              gi: master[port_id].gi,
              class1: master[port_id].class1,
              class2: master[port_id].class2,
              class3: master[port_id].class3,
              log: "log...",
            });
          }
        }
      }, 2000);
    }
  }

  //-------------------------------------------------
  // Delete message from diagram window
  //-------------------------------------------------
  else if (arg.msg === "delete") {
    if (arg.type.search("RTU") >= 0) {
      let rtu = db_rtu.get_rtu(arg.id);
      if (rtu) {
        if (rtu.simulator && Object.keys(rtu.simulator).length !== 0)
          rtu.simulator.kill();
        config_rtu.deleteConfigFile(rtu);
        db_rtu.del_rtu(arg.id);
      }
    } else if (arg.type.search("Master") >= 0) {
      let master = db_master.get_master(arg.id);
      if (master) {
        db_master.del_master(arg.id);
      }
    }
  }

  //-------------------------------------------------
  // Adding link between RTU and Master
  //-------------------------------------------------
  else if (arg.msg === "link") {
    let master = db_master.get_master(arg.target_id);
    let rtu = db_rtu.get_rtu(arg.source_id);

    if (!rtu) {
      // RTU not present on DB. Create a default DNP3 RTU
      db_rtu.create_rtu(arg.source_id, "rtu", "dnp3", null, "created");
      rtu = db_rtu.get_rtu(arg.source_id);
    }

    if (!master) {
      // RTU not present on DB. Create a default DNP3 RTU
      db_master.create_master(arg.target_id, "master", null);
    }

    master = db_master.get_master(arg.target_id);

    if (!master[arg.target_port_name]) {
      db_master.create_port(
        arg.target_id,
        arg.target_port_name,
        "dnp3",
        "created"
      );
    }

    db_rtu.set_master_id(arg.source_id, arg.target_id, arg.target_port_name);
    db_master.set_rtu_id(arg.target_id, arg.target_port_name, arg.source_id);

    if (master && rtu && master[arg.target_port_name])
      config_master.buildConfigFile(master, master[arg.target_port_name], rtu);
    if (rtu) config_rtu.buildConfigFile(rtu);
  }

  //-------------------------------------------------
  // Success replay
  //-------------------------------------------------
  event.reply("diagram-reply", { success: true });
});

//================================================================
// Message processor from RTU
//================================================================
ipcMain.on("rtu-message", (event, arg) => {
  console.log("Server-RTU:", arg);

  //-------------------------------------------------
  //Configuration message from RTU window
  //-------------------------------------------------
  if (arg.msg === "config") {
    db_rtu.set_config_rtu(
      arg.id,
      arg.ip,
      arg.port,
      arg.localAddr,
      arg.remoteAddr
    );
    let rtu = db_rtu.get_rtu(arg.id);
    if (rtu) {
      config_rtu.buildConfigFile(rtu);

      //Refresh the master config file
      if (rtu.master_id) {
        let master = db_master.get_master(rtu.master_id);
        if (master && rtu.master_port_id) {
          config_master.buildConfigFile(
            master,
            master[rtu.master_port_id],
            rtu
          );
        }
      }
    }
  }

  //-------------------------------------------------
  // Simulation start message from RTU window
  //-------------------------------------------------
  else if (arg.msg === "start") {
    let rtu = db_rtu.get_rtu(arg.id);

    if (rtu && db_rtu.get_state_rtu(arg.id) != "running") {
       let simulator = child(
        rtu.base_path + "\\outstation.exe",
        [arg.id, rtu.base_path],
        function (err, data) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
      simulator.stdin.setEncoding("utf-8");
      db_rtu.set_simulator_rtu(arg.id, simulator);
      db_rtu.set_state_rtu(arg.id, "running");
    }
  }

  //-------------------------------------------------
  // Simulation stop message from RTU window
  //-------------------------------------------------
  else if (arg.msg === "stop") {
    let rtu = db_rtu.get_rtu(arg.id);
    if (rtu && rtu.simulator) rtu.simulator.kill();
    db_rtu.set_state_rtu(arg.id, "stopped");
  }

  //-------------------------------------------------
  // Point configuration from RTU window
  //-------------------------------------------------
  else if (arg.msg === "data") {
    db_rtu.set_points_rtu(arg.id, arg.data);
    let rtu = db_rtu.get_rtu(arg.id);
    if (rtu) config_rtu.buildConfigFile(rtu);
  }

  //-------------------------------------------------
  // Success replay
  //-------------------------------------------------
  event.reply("rtu-reply", { success: true });
});

//================================================================
// Message processor from Master
//================================================================
ipcMain.on("master-message", (event, arg) => {
  console.log("Server-Master:", arg);

  //-------------------------------------------------
  //Configuration message from Master window
  //-------------------------------------------------
  if (arg.msg === "config") {
    db_master.set_config_master(
      arg.id,
      arg.port_id,
      arg.gi,
      arg.class1,
      arg.class2,
      arg.class3
    );
    let master = db_master.get_master(arg.id);
    if (master && master[arg.port_id].rtu_id) {
      let rtu = db_rtu.get_rtu(master[arg.port_id].rtu_id);
      if (rtu) {
        config_master.buildConfigFile(master, master[arg.port_id], rtu);
      }
    }
  }

  //-------------------------------------------------
  // Simulation start message from Master window
  //-------------------------------------------------
  else if (arg.msg === "start") {
    let master = db_master.get_master(arg.id);

    if (master && master[arg.port_id].state != "running") {
      let simulator = child(
        master.base_path + "\\master.exe",
        [arg.id + arg.port_id, master.base_path],
        function (err, data) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
      db_master.set_simulator_master(arg.id, arg.port_id, simulator);
      db_master.set_state_master(arg.id, arg.port_id, "running");
    }
  }

  //-------------------------------------------------
  // Simulation stop message from Master window
  //-------------------------------------------------
  else if (arg.msg === "stop") {
    let master = db_master.get_master(arg.id);
    if (master && master[arg.port_id].simulator)
      master[arg.port_id].simulator.kill();
    db_master.set_state_master(arg.id, arg.port_id, "stopped");
  }

  //-------------------------------------------------
  // Simulation stop message from RTU window
  //-------------------------------------------------
  else if (arg.msg === "cmd") {
    let master = db_master.get_master(arg.id);
    if (master && master[arg.port_id].simulator) {
      master[arg.port_id].simulator.stdin.cork();
      master[arg.port_id].simulator.stdin.write(arg.cmd + "\n");
      master[arg.port_id].simulator.stdin.uncork();
    }
  }

  //-------------------------------------------------
  // Success replay
  //-------------------------------------------------
  event.reply("master-reply", { success: true });
});
