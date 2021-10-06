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

//==========================================================
// Build a Master config file
//==========================================================
function buildConfigFile(master, port, rtu) {

  let config =
    "ID=" +
    master.id +
    "\n" +
    "IP=" +
    rtu.ip +
    "\n" +
    "PORT=" +
    rtu.port +
    "\n" +
    "ADDR_REMOTE=" +
    rtu.localAddr +
    "\n" +
    "ADDR_LOCAL=" +
    rtu.remoteAddr +
    "\n" +
    "GI=" +
    port.gi +
    "\n" +
    "CLASS1=" +
    port.class1 +
    "\n" +
    "CLASS2=" +
    port.class2 +
    "\n" +
    "CLASS3=" +
    port.class3 +
    "\n";

  // write to a new file named 2pac.txt
  fs.writeFile(port.simulator_conf, config, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("Config file saved!");
  });
}

//==========================================================
// Delete all Master config files
//==========================================================
function deleteConfigFileAll(master) {
  for (var id = 1; id <= 3; id++) {
    port_id = "port"+id;
    if (fs.existsSync(master[port_id].simulator_conf)) fs.unlinkSync(master[port_id].simulator_conf);
  }
}

//==========================================================
// Delete a Master config file
//==========================================================
function deleteConfigFile(port) {
  if (fs.existsSync(port.simulator_conf))
    fs.unlinkSync(port.simulator_conf);
}

exports.buildConfigFile = buildConfigFile;
exports.deleteConfigFile = deleteConfigFile;
exports.deleteConfigFileAll = deleteConfigFileAll;
