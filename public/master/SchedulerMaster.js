/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const db_master = require("./DbMaster");
const fs = require("fs");
const readLastLine = require("read-last-line");

//==========================================================
// Read 40 lines of trace and send to Master window
//==========================================================
function readTraceMaster(item) {
  if (item.window) {
    for (var id = 1; id <= 3; id++) {
      let port_id = "port" + id;

      if (item[port_id].state === "running") {
        if (fs.existsSync(item[port_id].simulator_log)) {
          readLastLine
            .read(item[port_id].simulator_log, 25)
            .then(function (lines) {
              item.window.webContents.send("master-message", {
                msg: "data",
                port_id: port_id,
                log: lines,
              });
            });
        }
      }
    }
  }
}

//==========================================================
// Read 40 lines of history and send to Master window
//==========================================================
function readHistMaster(item) {
  if (item.window) {
    for (var id = 1; id <= 3; id++) {
      let port_id = "port" + id;

      if (item[port_id].state === "running") {
        readLastLine
          .read(item[port_id].simulator_points, 35)
          .then(function (lines) {
            item.window.webContents.send("master-message", {
              msg: "points",
              port_id: port_id,
              log: lines,
            });
          });
      }
    }
  }
}

//==========================================================
// Read 10 lines of DB and send to Master window
//==========================================================
function readDbMaster(item) {
  if (item.window) {
    for (var id = 1; id <= 3; id++) {
      let port_id = "port" + id;

      if (item[port_id].state === "running") {
        readLastLine
          .read(item[port_id].simulator_db, 10)
          .then(function (lines) {
            let db = [];
            let data = lines.split(/\r?\n/);
            for (let i = 0; i < 5; i++) {
              let p =
                /Point:([0-9]+); Value:([0-9]+); Quality:([A-Za-z, ]+)/.exec(
                  data[i]
                );
              if (p)
                db["p" + (i + 1)] = { point: p[1], value: p[2], quality: p[3] };
            }

            item.window.webContents.send("master-message", {
              msg: "db",
              port_id: port_id,
              db: db,
            });
          });
      }
    }
  }
}

//==========================================================
// Start log Scheduler
//==========================================================
function dataProviderMaster() {
  setTimeout(function () {
    db_master.get_master_all().forEach(readTraceMaster);
    dataProviderMaster();
  }, 1000);
}

//==========================================================
// Start points Scheduler
//==========================================================
function pointsProviderMaster() {
  setTimeout(function () {
    db_master.get_master_all().forEach(readHistMaster);
    pointsProviderMaster();
  }, 3000);
}

//==========================================================
// Start points Scheduler
//==========================================================
function dbProviderMaster() {
  setTimeout(function () {
    db_master.get_master_all().forEach(readDbMaster);
    dbProviderMaster();
  }, 2000);
}

exports.dataProviderMaster = dataProviderMaster;
exports.pointsProviderMaster = pointsProviderMaster;
exports.dbProviderMaster = dbProviderMaster;
