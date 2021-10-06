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
// Build a RTU config file
//==========================================================
function buildConfigFile(rtu) {
  let config =
    "ID=" +
    rtu.id +
    "\n" +
    "IP=" +
    rtu.ip +
    "\n" +
    "PORT=" +
    rtu.port +
    "\n" +
    "ADDR_LOCAL=" +
    rtu.localAddr +
    "\n" +
    "ADDR_REMOTE=" +
    rtu.remoteAddr +
    "\n";

  if (Object.keys(rtu.points).length !== 0) {
    config +=
      "POINT1=" +
      rtu.points.Point1 +
      "\n" +
      "TID1=" +
      rtu.points.Tid1 +
      "\n" +
      "AUTO1=" +
      rtu.points.Auto1 +
      "\n" +
      "POINT2=" +
      rtu.points.Point2 +
      "\n" +
      "TID2=" +
      rtu.points.Tid2 +
      "\n" +
      "AUTO2=" +
      rtu.points.Auto2 +
      "\n" +
      "POINT3=" +
      rtu.points.Point3 +
      "\n" +
      "TID3=" +
      rtu.points.Tid3 +
      "\n" +
      "AUTO3=" +
      rtu.points.Auto3 +
      "\n" +
      "POINT4=" +
      rtu.points.Point4 +
      "\n" +
      "TID4=" +
      rtu.points.Tid4 +
      "\n" +
      "AUTO4=" +
      rtu.points.Auto4 +
      "\n" +
      "POINT5=" +
      rtu.points.Point5 +
      "\n" +
      "TID5=" +
      rtu.points.Tid5 +
      "\n" +
      "AUTO5=" +
      rtu.points.Auto5 +
      "\n";
  }

  // write to a new file named 2pac.txt
  fs.writeFile(rtu.simulator_conf, config, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("Config file saved!");
  });
}

//==========================================================
// Delete a RTU config file
//==========================================================
function deleteConfigFile(rtu) {
  if (fs.existsSync(rtu.simulator_conf)) fs.unlinkSync(rtu.simulator_conf);
  if (fs.existsSync(rtu.simulator_log)) fs.unlinkSync(rtu.simulator_log);
}

exports.buildConfigFile = buildConfigFile;
exports.deleteConfigFile = deleteConfigFile;
